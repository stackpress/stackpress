//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//schema
import type Registry from '../../../schema/Registry';
import type Model from '../../../schema/spec/Model';

export default function removePage(directory: Directory, _registry: Registry, model: Model) {
  const file = `${model.name}/admin/views/update.tsx`;
  const source = directory.createSourceFile(file, '', { overwrite: true });
  const ids = model.ids.map(column => column.name);
  const path = ids.map(name => `\${results.${name}}`).join('/');
  const link = (action: string) => `\`\${root}/${model.dash}/${action}/${path}\``;

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
  //import type { ProfileInput, ProfileExtended } from '../../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types',
    namedImports: [ `${model.title}Input`, `${model.title}Extended` ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import { Crumbs, LayoutAdmin } from 'stackpress/view';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view',
    namedImports: [ 'Crumbs', 'LayoutAdmin' ]
  });
  //import Button from 'frui/element/Button';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/element/Button',
    defaultImport: 'Button'
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

  //export function AdminProfileUpdateCrumbs() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}UpdateCrumbs`,
    parameters: [{ 
      name: 'props', 
      type: `{ root: string, results: ${model.title}Extended }` 
    }],
    statements: (`
      const { root, results } = props;
      //hooks
      const { _ } = useLanguage();
      //variables
      const crumbs = [
        {
          label: (<span className="theme-info">{_('${model.plural}')}</span>),
          icon: '${model.icon}',
          href: \`\${root}/${model.dash}/search\`
        },
        {
          label: (
            <span className="theme-info">
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
  //export function AdminProfileUpdateBody() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}UpdateBody`,
    parameters: [{ 
      name: 'props', 
      type: `PageBodyProps<${[
        'AdminDataProps', 
        `Partial<${model.title}Input>`, 
        `${model.title}Extended`
      ].join(',')}>` 
    }],
    statements: (`
      const { data, request, response } = props;
      const { root = '/admin' } = data.admin || {};
      const input = request.data || response.results || {};
      const errors = response.errors || {};
      const results = response.results as ${model.title}Extended;
      //render
      return (
        <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
          <div className="px-px-10 px-py-14 theme-bg-bg2">
            <Admin${model.title}UpdateCrumbs root={root} results={results}  />
          </div>
          <div className="px-p-10">
            <Admin${model.title}UpdateForm 
              errors={errors} 
              input={input} 
            />
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
      type: `PageHeadProps<${[
        'AdminDataProps', 
        `Partial<${model.title}Input>`, 
        `${model.title}Extended`
      ].join(',')}>` 
    }],
    statements: (`
      const { data, styles = [] } = props;
      const { _ } = useLanguage();
      return (
        <>
          <title>{_('Update ${model.singular}')}</title>
          {data.icon && <link rel="icon" type="image/svg+xml" href={data.icon} />}
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
      type: `PageBodyProps<${[
        'AdminDataProps', 
        `Partial<${model.title}Input>`, 
        `${model.title}Extended`
      ].join(',')}>`  
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
          <Admin${model.title}UpdateBody {...props} />
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