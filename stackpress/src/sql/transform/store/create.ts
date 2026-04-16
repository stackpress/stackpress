//modules
import type { SourceFile, ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { renderCode } from '../../../schema/transform/helpers.js';
//stackpress/sql
import { getFieldSetup } from '../helpers.js';

export default function generate(
  source: SourceFile,
  model: Model,
  definition: ClassDeclaration
) {
  const relations = model.store.foreignRelationships.map(column => {
    const relation = column.store.foreignRelationship!;
    const table = column.type.model?.name.snakeCase as string;
    const foreign = relation.foreign.key.name.snakeCase as string;
    const local = relation.local.key.name.snakeCase as string;
    return { table, foreign, local, delete: 'CASCADE', update: 'RESTRICT' };
  });

  //------------------------------------------------------------------//
  // Import Modules

  //import Create from '@stackpress/inquire/Create';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/inquire/Create',
    defaultImport: 'Create'
  });

  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client
  //------------------------------------------------------------------//
  // Store Methods

  //public create() {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'create',
    statements: renderCode(TEMPLATE.SCHEMA, {
      fields: model.columns
        .map(column => ({
          field: column.name.snakeCase,
          options: JSON.stringify(getFieldSetup(column), null, 2)
        }))
        .toArray()
        .filter(column => column.options !== 'false'),
      primaries: model.store.ids.map(column => ({
        field: column.name.snakeCase
      })).toArray(),
      uniques: model.store.uniques.map(column => ({
        index: `${model.name.snakeCase}_${column.name.snakeCase}_unique`,
        field: column.name.snakeCase
      })).toArray(),
      keys: model.store.indexables.map(column => ({
        index: `${model.name.snakeCase}_${column.name.snakeCase}_index`,
        field: column.name.snakeCase
      })).toArray(),
      relations: relations.map(relation => ({
        index: `${model.name.snakeCase}_${relation.local}_foreign`,
        options: JSON.stringify(relation, null, 2)
      })).toArray()
    })
  });
};

export const TEMPLATE = {

FIELD:
`schema.addField(<%field%>, <%options%>);`,

SCHEMA:
`const schema = new Create(this.table);
<%#each fields%>
  schema.addField('<%field%>', <%options%>);
<%/each%>
<%#each primaries%>
  schema.addPrimaryKey('<%field%>');
<%/each%>
<%#each uniques%>
  schema.addUniqueKey('<%index%>', '<%field%>');
<%/each%>
<%#each keys%>
  schema.addKey('<%index%>', '<%field%>');
<%/each%>
<%#each relations%>
  schema.addForeignKey('<%index%>', <%options%>);
<%/each%>
return schema;`

};