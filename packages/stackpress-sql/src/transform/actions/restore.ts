//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { renderCode } from 'stackpress-schema/transform/helpers';

export default function generate(model: Model, definition: ClassDeclaration) {
  //public async restore(query: StoreSelectFilters) {}
  if (model.store.restorable) {
    definition.addMethod({
      scope: Scope.Public,
      isAsync: true,
      name: 'restore',
      parameters: [{
        name: 'query',
        type: `StoreSelectFilters`
      }],
      statements: renderCode(TEMPLATE.RESTORE, {
        active: Boolean(model.store.active),
        column: model.store.active?.name.toString() || ''
      })
    });
  }
};

export const TEMPLATE = {

//public async restore(query: StoreSelectFilters) {}
RESTORE:
`<%#?:active%>
  return await this.update(query, { <%column%>: true });
<%/?:active%>`

};