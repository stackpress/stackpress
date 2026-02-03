//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress/schema
import type Schema from '../../../schema/Schema.js';
import type Model from '../../../schema/model/Model.js';
//stackpress/admin
import { render } from '../helpers.js';

export default function updateView(directory: Directory, _schema: Schema, model: Model) {
  const file = `${model.name.toString()}/admin/views/update.tsx`;
  const source = directory.createSourceFile(file, '', { overwrite: true });
  const ids = model.store.ids.toArray().map(column => column.name);
  const path = ids.map(name => `\${results.${name}}`).join('/');
  const link = (action: string) => `\`\${base}/${model.name.dashCase}/${action}/${path}\``;

  //import 'frui/frui.css';
  //import 'stackpress/fouc.css';

  //import type { NestedObject, ServerPageProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'NestedObject', 'ServerPageProps' ]
  });
  //import type { AdminConfigProps } from 'stackpress/admin/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/admin/types',
    namedImports: [ 'AdminConfigProps' ]
  });
  //import type { ProfileInput, ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ `${model.name.titleCase}Input`, `${model.name.titleCase}Extended` ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import { useServer, Crumbs, LayoutAdmin } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'useServer', 'Crumbs', 'LayoutAdmin' ]
  });
  //import Button from 'frui/Button';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Button',
    defaultImport: 'Button'
  });
  //import { ActiveFieldControl } from '../../components/fields/ActiveField.js';
  model.component.formFields.forEach(column => {
    const field = column.component.formField!;
    const component = field.component.definition!;
    if (component.name === 'Fieldset') {
      //import { ActiveFieldsetControl } from '../../components/fields/ActiveField.js';
      source.addImportDeclaration({
        moduleSpecifier: `../../components/fields/${column.name.titleCase}Field.js`,
        namedImports: [ `${column.name.titleCase}FieldsetControl` ]
      });
      return;
    }
    source.addImportDeclaration({
      moduleSpecifier: `../../components/fields/${column.name.titleCase}Field.js`,
      namedImports: [ `${column.name.titleCase}FieldControl` ]
    });
  });

  //export function AdminProfileUpdateCrumbs() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.name.titleCase}UpdateCrumbs`,
    parameters: [{ 
      name: 'props', 
      type: `{ base: string, results: ${model.name.titleCase}Extended }` 
    }],
    statements: (`
      const { base, results } = props;
      //hooks
      const { _ } = useLanguage();
      //variables
      const crumbs = [
        {
          label: (<span className="admin-crumb">{_('${model.name.plural}')}</span>),
          icon: '${model.name.icon}',
          href: \`\${base}/${model.name.dashCase}/search\`
        },
        {
          label: (
            <span className="admin-crumb">
              {\`${render(model, "${results?.%s || ''}")}\`}
            </span>
          ),
          icon: '${model.name.icon}',
          href: ${link('detail')}
        },
        {
          label: _('Update'),
          icon: 'edit'
        }
      ];
      return (<Crumbs crumbs={crumbs} />);
    `)
  });
  //export function AdminProfileUpdateForm() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.name.titleCase}UpdateForm`,
    parameters: [{ 
      name: 'props', 
      type: `{ 
        input: Partial<${model.name.titleCase}Input>,
        errors: NestedObject<string | string[]>
      }` 
    }],
    statements: (`
      const { input, errors } = props;
      const { _ } = useLanguage();
      return (
        <form method="post">
          ${model.component.formFields.toArray().map(column => {
            const attribute = column.component.formField!;
            const component = attribute.component.definition!;
            if (component.name === 'Fieldset') {
              return (`
                <${column.name.titleCase}FieldsetControl 
                  className="control"
                  name="${column.name.toString()}"
                  value={input['${column.name.toString()}']} 
                  errors={errors['${column.name.toString()}']} 
                />
              `);
            }
            return (`
              <${column.name.titleCase}FieldControl 
                className="control"
                name="${column.name.toString()}${column.type.multiple ? '[]' : ''}"
                value={input['${column.name.toString()}']} 
                error={errors.${column.name.toString()}?.toString()} 
              />
            `);
          }).join('\n')}
          <Button className="submit" type="submit">
            <i className="icon fas fa-fw fa-save"></i>
            {_('Save')}
          </Button>
        </form>
      ); 
    `)
  });
  //export function AdminProfileUpdateBody() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.name.titleCase}UpdateBody`,
    statements: (`
      const { config, request, response } = useServer<${[
        'AdminConfigProps', 
        `Partial<${model.name.titleCase}Input>`, 
        `${model.name.titleCase}Extended`
      ].join(',')}>();
      const base = config.path('admin.base', '/admin');
      const input = { ...response.results, ...request.data() };
      const errors = response.errors();
      const results = response.results as ${model.name.titleCase}Extended;
      //render
      return (
        <main className="admin-page admin-form-page">
          <div className="admin-crumbs">
            <Admin${model.name.titleCase}UpdateCrumbs base={base} results={results} />
          </div>
          <div className="admin-form">
            <Admin${model.name.titleCase}UpdateForm errors={errors} input={input} />
          </div>
        </main>
      );
    `)
  });
  //export function AdminProfileUpdateHead() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.name.titleCase}UpdateHead`,
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: (`
      const { data, styles = [] } = props;
      const { favicon = '/favicon.ico' } = data?.brand || {};
      const { _ } = useLanguage();
      const mimetype = favicon.endsWith('.png')
        ? 'image/png'
        : favicon.endsWith('.svg')
        ? 'image/svg+xml'
        : 'image/x-icon';
      return (
        <>
          <title>{_('Update ${model.name.singular}')}</title>
          {favicon && <link rel="icon" type={mimetype} href={favicon} />}
          <link rel="stylesheet" type="text/css" href="/styles/global.css" />
          {styles.map((href, index) => (
            <link key={index} rel="stylesheet" type="text/css" href={href} />
          ))}
        </>
      );  
    `)
  });
  //export function AdminProfileUpdatePage() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.name.titleCase}UpdatePage`,
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: (`
      return (
        <LayoutAdmin {...props}>
          <Admin${model.name.titleCase}UpdateBody />
        </LayoutAdmin>
      );
    `)
  });
  //export const Head = AdminProfileUpdateHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: `Admin${model.name.titleCase}UpdateHead`
    }]
  });
  //export default AdminProfileUpdatePage;
  source.addStatements(`export default Admin${model.name.titleCase}UpdatePage;`);
}