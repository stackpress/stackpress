//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { renderCode } from '../../../schema/transform/helpers.js';

export default function generate(model: Model, definition: ClassDeclaration) {
  //public async remove(query: StoreSelectFilters) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'remove',
    parameters: [{
      name: 'query',
      type: `StoreSelectFilters`
    }],
    statements: renderCode(TEMPLATE.REMOVE, {
      active: Boolean(model.store.active),
      column: model.store.active?.name.toString() || ''
    })
  });
};

export const TEMPLATE = {

//public async remove(query: StoreSelectFilters) {}
REMOVE:
`<%#active%>
  return await this.update(query, { <%column%>: false });
<%/active%>
<%^active%>
  return await this.delete(query);
<%/active%>`,

};