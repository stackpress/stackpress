//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//schema
import type Registry from '../../../schema/Registry.js';
import type Model from '../../../schema/spec/Model.js';

export default function createPage(directory: Directory, _registry: Registry, model: Model) {
  const file = `${model.name}/admin/views/create.tsx`;
  const source = directory.createSourceFile(file, '', { overwrite: true });
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
  //import type { ProfileInput, Profile } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ `${model.title}Input`, model.title ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Button from 'frui/form/Button';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/Button',
    defaultImport: 'Button'
  });
  //import { useServer, Crumbs, LayoutAdmin } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'useServer', 'Crumbs', 'LayoutAdmin' ]
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
  
  //export function AdminProfileCreateCrumbs() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}CreateCrumbs`,
    statements: (`
      //hooks
      const { _ } = useLanguage();
      //variables
      const crumbs = [
        {
          label: (<span className="theme-info">{_('${model.plural}')}</span>),
          icon: 'user',
          href: 'search'
        },
        {
          label: _('Create'),
          icon: 'plus'
        }
      ];
      return (<Crumbs crumbs={crumbs} />);
    `)
  });
  //export function AdminProfileCreateForm() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}CreateForm`,
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
              className="px-mb-20"
              name="${column.name}"
              value={input.${column.name}} 
              error={errors.${column.name}?.toString()} 
            />
          `) : (`
            <${column.title}FieldControl 
              className="px-mb-20"
              name="${column.name}"
              value={input.${column.name}} 
              error={errors.${column.name}?.toString()} 
            />
          `)).join('\n')}
          <Button 
            className="theme-bc-primary theme-bg-primary border !px-px-14 !px-py-8" 
            type="submit"
          >
            <i className="text-sm fas fa-fw fa-save"></i>
            {_('Save')}
          </Button>
        </form>
      ); 
    `)
  });
  //export function AdminProfileCreateBody() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}CreateBody`,
    statements: (`
      const { request, response } = useServer<${[
        'AdminConfigProps', 
        `Partial<${model.title}Input>`,
        model.title
      ].join(', ')}>();
      const input = { ...response.results, ...request.data() };
      const errors = response.errors();
      //render
      return (
        <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
          <div className="px-px-10 px-py-14 theme-bg-bg2">
            <Admin${model.title}CreateCrumbs />
          </div>
          <div className="px-p-10 flex-grow overflow-auto">
            <Admin${model.title}CreateForm errors={errors} input={input} />
          </div>
        </main>
      );
    `)
  });
  //export function AdminProfileCreateHead() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}CreateHead`,
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
          <title>{_('Create ${model.singular}')}</title>
          {favicon && <link rel="icon" type={mimetype} href={favicon} />}
          <link rel="stylesheet" type="text/css" href="/styles/global.css" />
          {styles.map((href, index) => (
            <link key={index} rel="stylesheet" type="text/css" href={href} />
          ))}
        </>
      );  
    `)
  });
  //export function AdminProfileCreatePage() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}CreatePage`,
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: (`
      return (
        <LayoutAdmin {...props}>
          <Admin${model.title}CreateBody />
        </LayoutAdmin>
      );  
    `)
  });
  //export const Head = AdminProfileCreateHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: `Admin${model.title}CreateHead`
    }]
  });
  //export default AdminProfileCreatePage;
  source.addStatements(`export default Admin${model.title}CreatePage;`);
}
