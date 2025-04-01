//modules
import type { Directory } from 'ts-morph';
//registry
import type Registry from '../../schema/Registry';
import type Column from '../../schema/spec/Column';
import type Model from '../../schema/spec/Model';

export default function generate(directory: Directory, registry: Registry) {
  //for each model
  for (const model of registry.model.values()) {
    //generate all column formats
    model.columns.forEach(
      column => generateFormat(directory, model, column)
    );
  }
}

export function generateFormat(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //skip if no format component
  if (typeof column.view.component !== 'string') return;
  //get the path where this should be saved
  const path = `${model.name}/components/views/${column.title}ViewFormat.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });
  //import Text from 'frui/format/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/format/${column.view.component}`,
    defaultImport: column.view.component
  });
  const props = `{ 
    data: ${model.title}Extended,
    value: ${column.typemap.format}${column.multiple ? '[]': ''} 
  }`;
  if (column.view.method === 'template') {
    //import mustache from 'mustache';
    source.addImportDeclaration({
      moduleSpecifier: 'mustache',
      defaultImport: 'mustache'
    });
    //import type { ProfileExtended } from '../../types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '../../types',
      namedImports: [ `${model.title}Extended` ]
    });
    //export function NameFormat() {
    source.addFunction({
      isDefaultExport: true,
      name: `${column.title}Format`,
      parameters: [ { name: 'props', type: props } ],
      statements: (`
        //props
        const { data } = props;
        const value = mustache.render(
          '${column.view.attributes.template}',
          data
        );
        //render
        return (
          <${column.view.component} value={value} />
        );
      `)
    });
    return;
  }
  //export function NameFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.title}Format`,
    parameters: [ { name: 'props', type: props } ],
    statements: (`
      //props
      const { data, value } = props;
      const attributes = ${JSON.stringify(column.view.attributes)};
      //render
      return (
        <${column.view.component} {...attributes} data={data} value={value} />
      );
    `)
  });
}