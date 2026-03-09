//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { renderCode } from '../../../schema/transform/helpers.js';

export default function generate(
  model: Model,
  definition: ClassDeclaration
) {
  //public count(query: StoreSelectFilters = {}, q = '"') {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'count',
    parameters: [{
      name: 'query',
      type: 'StoreSelectFilters & { columns?: string[] }',
      initializer: '{}'
     }, {
      name: 'q',
      initializer: `'"'`
     }],
    statements: renderCode(TEMPLATE.COUNT, {
      searchable: model.columns.filter(column => column.store.searchable).size > 0,
      searchables: model.columns
        .filter(column => column.store.searchable)
        .map(column => ({ column: column.name.toString() }))
        .toArray(),
      active: model.columns.findValue(column => column.store.active)?.name.toString()
    })
  });
};

export const TEMPLATE = {

COUNT:
`//extract params
let { q: keywords, columns = [ '*' ], filter = {}, span = {} } = query;
//valid columns: 
// - createdAt
// - user.emailAddress
// - user.address.streetName
// - user.address.*
// - user.*
// - *
//reference: user User @relation({ local "userId" foreign "id" })
columns = columns.map(column => this.getColumnSelectors(column)).flat();
//collect info for each column
//ex. group.owner.address.streetName
// - name: group.owner.address.streetName
// - table: group__owner__address
// - column: street_name
// - alias: group__owner__address__street_name
// - joins: 
//   - group as group ON (product.group_id = group.id)
//   - user as group__owner ON (group.owner_id = group__owner.id)
//   - address as group__owner__address ON (group__owner.address_id = group__owner__address.id)
const info = columns
  .map(column => this.getColumnInfo(column))
  .filter(column => column.path.length > 0);
//finally, make the select builder
const select = new Select<{ total: number }>('COUNT(*) as total').from(this.table);
//make a joins map
const joins: StoreSelectJoinMap = {};
info.forEach(selector => Object.assign(joins, selector.joins));
Object.values(joins).forEach(({ table, from, to, alias }) => select.join(
  'inner', 
  table, 
  from.replaceAll('.', \`\${q}.\${q}\`), 
  to.replaceAll('.', \`\${q}.\${q}\`),
  alias
));

//where
const where = this.where({ q: keywords, filter, span }, q);
if (where.clause) {
  select.where(where.clause, where.values);
}

return select;`,

};