//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//schema
import type Registry from '../../../schema/Registry';
import type Model from '../../../schema/spec/Model';

export default function createPage(directory: Directory, _registry: Registry, model: Model) {
  const file = `${model.name}/admin/views/create.tsx`;
  const source = directory.createSourceFile(file, '', { overwrite: true });
  //import 'frui/frui.css';
  //import 'stackpress/fouc.css';

  //import type { NestedObject, PageHeadProps, PageBodyProps, 
  //AdminDataProps } from 'stackpress/view';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view',
    namedImports: [
      'NestedObject',
      'PageHeadProps',
      'PageBodyProps',
      'AdminDataProps'
    ]
  });
  //import type { ProfileInput, Profile } from '../../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types',
    namedImports: [ `${model.title}Input`, model.title ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Button from 'frui/element/Button';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/element/Button',
    defaultImport: 'Button'
  });
  //import { Crumbs, LayoutAdmin } from 'stackpress/view';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view',
    namedImports: [ 'Crumbs', 'LayoutAdmin' ]
  });
  //import { ActiveFieldControl } from '../../components/fields/ActiveField';
  model.fields.forEach(column => {
    //skip if no component
    if (typeof column.field.component !== 'string') return;
    source.addImportDeclaration({
      moduleSpecifier: `../../components/fields/${column.title}Field`,
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
          ${model.fields.map(column => (`
            <${column.title}FieldControl 
              className="px-mb-20"
              value={input.${column.name}} 
              error={errors.${column.name}?.toString()} 
            />
          `))}
          <Button 
            className="theme-bc-bd2 theme-bg-bg2 border !px-px-14 !px-py-8 px-mr-5" 
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
    parameters: [{ 
      name: 'props', 
      type: `PageBodyProps<${[
        'AdminDataProps', 
        `Partial<${model.title}Input>`,
        model.title
      ].join(', ')}>` 
    }],
    statements: (`
      const { request, response } = props;
      const input = response.results || request.data || {};
      const errors = response.errors || {};
      //render
      return (
        <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
          <div className="px-px-10 px-py-14 theme-bg-bg2">
            <Admin${model.title}CreateCrumbs />
          </div>
          <div className="px-p-10">
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
      type: `PageHeadProps<${[
        'AdminDataProps', 
        `Partial<${model.title}Input>`,
        model.title
      ].join(', ')}>` 
    }],
    statements: (`
      const { data, styles = [] } = props;
      const { _ } = useLanguage();
      return (
        <>
          <title>{_('Create ${model.singular}')}</title>
          {data.icon && <link rel="icon" type="image/svg+xml" href={data.icon} />}
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
      type: `PageBodyProps<${[
        'AdminDataProps', 
        `Partial<${model.title}Input>`,
        model.title
      ].join(', ')}>` 
    }],
    statements: (`
      const { data, session, request } = props;
      const theme = request.session.theme as string | undefined;
      const {
        root = '/admin',
        name = 'Admin',
        logo = '/images/logo-square.png',
        menu = []
      } = data.admin;
      const path = request.url.pathname;
      return (
        <LayoutAdmin
          theme={theme} 
          brand={name}
          base={root}
          logo={logo}
          path={path} 
          menu={menu}
          session={session}
        >
          <Admin${model.title}CreateBody {...props} />
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
