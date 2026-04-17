//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { renderCode } from '../../../schema/transform/helpers.js';

const typemap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Date: 'Date',
  Time: 'Date',
  Datetime: 'Date',
  Json: 'Record<string, ScalarInput>',
  Object: 'Record<string, ScalarInput>',
  Hash: 'Record<string, ScalarInput>'
};

export default function generate(model: Model, definition: ClassDeclaration) {
  const ids = model.store.ids.filter(
    column => column.type.name in typemap
  );
  
  //public async batch(inputs: Array<Partial<Profile>>, mode = 'upsert') {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'batch',
    parameters: [{
      name: 'inputs',
      type: model.name.toTypeName('Array<Partial<%s>>')
    }, {
      name: 'mode',
      type: `'create' | 'update' | 'upsert'`,
      initializer: `'upsert'`
    }],
    statements: renderCode(TEMPLATE.BATCH, {
      type: model.name.toTypeName(),
      store: model.name.toClassName('%sStore'),
      update: ids.map(
        column => `typeof input.${column.name.toPropertyName()} !== 'undefined'`
      ).toArray().join(' && '),
      ids: ids.map(
        column => ({ column: column.name.toString() })
      ).toArray(),
      uniques: model.store.uniques.map(
        column => ({ column: column.name.toString() })
      ).toArray()
    })
  });
};

export const TEMPLATE = {

//public async batch(inputs: Array<Partial<Profile>>, mode = 'upsert') {}
BATCH:
`const results: StatusResponse<<%type%> | null>[] = [];
try {
  await this.engine.transaction(async () => {
    let rollback = false;
    for (const input of inputs) {
      try {
        if (mode === 'upsert') {
          results.push({ 
            code: 200, 
            status: 'OK', 
            results: await this.upsert(input),
            total: 1
          });
        } else if (mode === 'create') {
          results.push({ 
            code: 200, 
            status: 'OK', 
            results: await this.create(input),
            total: 1
          });
        } else if (mode === 'update') {
          <%#?:ids.length%>
            if (<%update%>) {
              const eq = { 
                <%#@:ids%>
                  <%column%>: input.<%column%>,
                <%/@:ids%> 
              };
              const exists = await this.find({ eq });
              if (exists) {
                const rows = await this.update({ eq }, input);
                results.push({ 
                  code: 200, 
                  status: 'OK', 
                  results: rows[0] || null,
                  total: 1
                });
                continue;
              }
            }
          <%/?:ids.length%>
          <%#@:uniques%>
            if (
              typeof input.<%column%> !== 'undefined'
              && input.<%column%> !== null
              && input.<%column%> !== ''
            ) {
              const eq = { <%column%>: input.<%column%> };
              const exists = await this.find({ eq });
              if (exists) {
                const rows = await this.update({ eq }, input);
                results.push({ 
                  code: 200, 
                  status: 'OK', 
                  results: rows[0] || null,
                  total: 1
                });
                continue;
              }
            }
          <%/@:uniques%>
          results.push({ error: 'ID or unique field is required for update mode' });
        }
      } catch (e) {
        const error = e as any;
        const exception = typeof error.toResponse !== 'function'
          ? Exception.upgrade(error)
          : error as Exception;
        const response = exception.toResponse();
        results.push({ 
          code: response.code, 
          status: response.status, 
          error: response.error, 
          errors: response.errors 
        });
        rollback = true;
      }
    }
    if (rollback) {
      throw Exception.for('Batch operation failed');
    }
  });
} catch(e) {}
return results;`

};