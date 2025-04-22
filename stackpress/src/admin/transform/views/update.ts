//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//schema
import type Registry from '../../../schema/Registry.js';
import type Model from '../../../schema/spec/Model.js';

export default function removePage(directory: Directory, _registry: Registry, model: Model) {
  const file = `${model.name}/admin/views/update.tsx`;
  const source = directory.createSourceFile(file, '', { overwrite: true });
  const ids = model.ids.map(column => column.name);
  const path = ids.map(name => `\${results.${name}}`).join('/');
  const link = (action: string) => `\`\${base}/${model.dash}/${action}/${path}\``;

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
    namedImports: [ `${model.title}Input`, `${model.title}Extended` ]
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
  //import Button from 'frui/form/Button';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/Button',
    defaultImport: 'Button'
  });
  //import { ActiveFieldControl } from '../../components/fields/ActiveField.js';
  model.fields.forEach(column => {
    //skip if no component
    if (typeof column.field.component !== 'string') return;
    if (column.field.method === 'fieldset') {
      //import { ActiveFieldsetControl } from '../../components/fields/ActiveField.js';
      source.addImportDeclaration({
        moduleSpecifier: `../../components/fields/${column.title}Field.js`,
        namedImports: [ `${column.title}FieldsetControl` ]
      });
      return;
    }
    source.addImportDeclaration({
      moduleSpecifier: `../../components/fields/${column.title}Field.js`,
      namedImports: [ `${column.title}FieldControl` ]
    });
  });

  //export function AdminProfileUpdateCrumbs() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}UpdateCrumbs`,
    parameters: [{ 
      name: 'props', 
      type: `{ base: string, results: ${model.title}Extended }` 
    }],
    statements: (`
      const { base, results } = props;
      //hooks
      const { _ } = useLanguage();
      //variables
      const crumbs = [
        {
          label: (<span className="admin-crumb">{_('${model.plural}')}</span>),
          icon: '${model.icon}',
          href: \`\${base}/${model.dash}/search\`
        },
        {
          label: (
            <span className="admin-crumb">
              {\`${model.transformTemplate('${results?.%s || \'\'}')}\`}
            </span>
          ),
          icon: '${model.icon}',
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
    name: `Admin${model.title}UpdateForm`,
    parameters: [{ 
      name: 'props', 
      type: `{ 
        input: Partial<${model.title}Input>,
        errors: NestedObject<string | string[]>
      }` 
    }],
    statements: (`
      const { input, errors } = props;
      const { _ } = useLanguage();
      return (
        <form method="post">
          ${model.fields.map(column => column.field.method === 'fieldset' ? (`
            <${column.title}FieldsetControl 
              className="control"
              name="${column.name}"
              value={input.${column.name}} 
              error={errors.${column.name}?.toString()} 
            />
          `) : (`
            <${column.title}FieldControl 
              className="control"
              name="${column.name}"
              value={input.${column.name}} 
              error={errors.${column.name}?.toString()} 
            />
          `)).join('\n')}
          <Button className="submit" type="submit">
            <i className="fas fa-fw fa-save"></i>
            {_('Save')}
          </Button>
        </form>
      ); 
    `)
  });
  //export function AdminProfileUpdateBody() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}UpdateBody`,
    statements: (`
      const { config, request, response } = useServer<${[
        'AdminConfigProps', 
        `Partial<${model.title}Input>`, 
        `${model.title}Extended`
      ].join(',')}>();
      const base = config.path('admin.base', '/admin');
      const input = { ...response.results, ...request.data() };
      const errors = response.errors();
      const results = response.results as ${model.title}Extended;
      //render
      return (
        <main className="admin-page admin-form-page">
          <div className="admin-crumbs">
            <Admin${model.title}UpdateCrumbs base={base} results={results} />
          </div>
          <div className="admin-form">
            <Admin${model.title}UpdateForm errors={errors} input={input} />
          </div>
        </main>
      );
    `)
  });
  //export function AdminProfileUpdateHead() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}UpdateHead`,
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
          <title>{_('Update ${model.singular}')}</title>
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
    name: `Admin${model.title}UpdatePage`,
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: (`
      return (
        <LayoutAdmin {...props}>
          <Admin${model.title}UpdateBody />
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
      initializer: `Admin${model.title}UpdateHead`
    }]
  });
  //export default AdminProfileUpdatePage;
  source.addStatements(`export default Admin${model.title}UpdatePage;`);
}