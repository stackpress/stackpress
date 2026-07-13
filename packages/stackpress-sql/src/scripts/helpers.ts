//modules
import type Alter from '@stackpress/inquire/Alter';
import type Create from '@stackpress/inquire/Create';
import type Engine from '@stackpress/inquire/Engine';
import type { QueryObject } from '@stackpress/inquire/types';
//stackpress-sql
import type {
  DestructiveAlterChanges,
  DestructiveSchemaChanges
} from '../types.js';

export type InspectedSchemaChanges = {
  queries: QueryObject[],
  destructive: DestructiveSchemaChanges
};

export function isNoAlterationsError(error: unknown) {
  return error instanceof Error
    && error.message === 'No alterations made.';
}

export function getDestructiveAlterChanges(build: ReturnType<Alter['build']>) {
  //collect only removed schema pieces
  return {
    fields: build.fields.remove,
    primary: build.primary.remove,
    unique: build.unique.remove,
    keys: build.keys.remove,
    foreign: build.foreign.remove
  } satisfies DestructiveAlterChanges;
}

export function hasDestructiveAlterChanges(changes: DestructiveAlterChanges) {
  //true when any alter category removes data
  return Object.values(changes).some(values => values.length > 0);
}

export function hasDestructiveSchemaChanges(
  changes: DestructiveSchemaChanges
) {
  //true when any table alter or drop is destructive
  return changes.alters.length > 0 || changes.drops.length > 0;
}

export function formatDestructiveSchemaMessage(
  changes: DestructiveSchemaChanges
) {
  //start with the high-level refusal reason
  const lines = [
    'Destructive schema changes detected.',
    'Stackpress refused to apply this diff because it removes existing schema pieces and may drop data.'
  ];

  //list each destructive table diff
  for (const alter of changes.alters) {
    lines.push('', `Table "${alter.table}":`);
    if (alter.changes.fields.length > 0) {
      lines.push(`- Removed fields: ${alter.changes.fields.join(', ')}`);
    }
    if (alter.changes.primary.length > 0) {
      lines.push(`- Removed primary keys: ${alter.changes.primary.join(', ')}`);
    }
    if (alter.changes.unique.length > 0) {
      lines.push(`- Removed unique keys: ${alter.changes.unique.join(', ')}`);
    }
    if (alter.changes.keys.length > 0) {
      lines.push(`- Removed indexes: ${alter.changes.keys.join(', ')}`);
    }
    if (alter.changes.foreign.length > 0) {
      lines.push(`- Removed foreign keys: ${alter.changes.foreign.join(', ')}`);
    }
  }

  //include dropped tables after altered tables
  if (changes.drops.length > 0) {
    lines.push('', `Dropped tables: ${changes.drops.join(', ')}`);
  }

  //end with the override instruction
  lines.push(
    '',
    'Re-run with `--force` only if you intentionally want to accept these destructive changes.'
  );
  return lines.join('\n');
}

export function inspectSchemaChanges(
  database: Engine,
  previous: Create[],
  current: Create[],
  forced = false
) {
  //collect the resulting queries and any destructive findings together
  const inspected: InspectedSchemaChanges = {
    queries: [],
    destructive: { alters: [], drops: [] }
  };

  //loop through all 'current' the models
  for (const schema of current) {
    const name = schema.build().table;
    const before = previous.find(from => from.build().table === name);
    //if the schema wasn't there before
    if (!before) {
      //set the engine to determine the dialect
      schema.engine = database;
      //add to the queries
      inspected.queries.push(...schema.query());
      continue;
    }
    //the model was there before...
    try {
      const alter = database.diff(before, schema);
      const changes = getDestructiveAlterChanges(alter.build());
      //save destructive alters for one complete warning
      if (!forced && hasDestructiveAlterChanges(changes)) {
        inspected.destructive.alters.push({ table: name, changes });
        continue;
      }
      //this could error if there were no differences found.
      //push all the alter statements
      inspected.queries.push(...alter.query());
    } catch (error) {
      //ignore the expected no-op diff and surface everything else
      if (isNoAlterationsError(error)) {
        continue;
      }
      throw error;
    }
  }

  //loop through all 'previous' the models
  for (const schema of previous) {
    const name = schema.build().table;
    const after = current.find(to => to.build().table === name);
    //if the model is not there now
    if (!after) {
      //save dropped tables for the same warning
      if (!forced) {
        inspected.destructive.drops.push(name);
        continue;
      }
      //we need to drop this table
      inspected.queries.push(database.dialect.drop(name));
    }
  }

  return inspected;
}
