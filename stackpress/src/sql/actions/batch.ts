//stackpress
import type { UnknownNest, StatusResponse } from '@stackpress/lib/types';
import type Engine from '@stackpress/inquire/Engine';
//root
import Exception from '../../Exception.js';
//schema
import type Model from '../../schema/spec/Model.js';
//sql
import { toResponse } from '../helpers.js';
//local
import create from './create.js';
import update from './update.js';

export type Action = 'check' | 'create' | 'update';

/**
 * Upserts many rows into the database table
 */
export default async function batch<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  rows: M[],
  seed?: string
) {
  //map rows with actions
  const actions: { row: M, action: Action }[] = rows.map(row => {
    const action: Action = model.ids.some(
      column => row[column.name] === undefined
    ) ? 'create' : 'check';
    return { row, action };
  });
  //get all the rows that need checking
  const check = actions.filter(({ action }) => action === 'check');
  //get the db quoter
  const q = engine.dialect.q;
  //get the id names
  const ids = model.ids.map(column => column.name);
  //make select column names
  const columns = model.ids.map(column => `${q}${column.snake}${q}`);
  //make the where clauses
  const clauses = columns.map(column => `${column} = ?`).join(' AND ');
  //make the where statement
  const where = check.map(() => `(${clauses})`).join(' OR ');
  //make the where bind values
  const values = check.map(({ row }) => {
    return ids.map(id => row[id] as string|number);
  }).flat();
  //this is a holder for results...
  const results: Partial<StatusResponse<Partial<M>>>[] = [];
  try {
    let error = false;
    //start a transaction
    await engine.transaction(async () => {
      //if there are rows to check
      if (where.length > 0 && values.length > 0) {
        //get all the rows that already exists
        const exists = await engine
          .select<Record<string, string|number>>(columns)
          .from(model.snake)
          .where(where, values);
        //update the check actions rows to create or update
        for (const action of actions) {
          if (action.action !== 'check') continue;
          //determine the action, update if every id is found
          action.action = exists.some(
            exist => ids.every(id => exist[id] === action.row[id])
          ) ? 'update' : 'create';
        }
      }
      //now loop through actions and create or update
      for (const { row, action } of actions) {
        //if create action
        if (action === 'create') {
          const response = await create<M>(model, engine, row, seed);
          if (response.code !== 200) error = true;
          results.push(response);
        //if update action
        } else if (action === 'update') {
          const filter = Object.fromEntries(
            ids.map(id => [id, row[id] as string|number])
          );
          const response = await update<M>(model, engine, filter, row, seed);
          if (response.code !== 200) error = true;
          results.push(response);
        }
      }
      if (error) {
        throw Exception.for('Errors found in batch inputs');
      }
    });
  } catch(e) {
    const error = Exception.upgrade(e as Error);
    return {
      code: 400,
      status: 'Bad Request',
      error: error.message,
      results: results,
      total: results.length,
      stack: error.trace()
    };
  }
  return toResponse(results);
};