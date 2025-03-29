//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//schema
import type Registry from '../../../schema/Registry';
import type Model from '../../../schema/spec/Model';

export default function removePage(directory: Directory, _registry: Registry, model: Model) {
  const file = `${model.name}/admin/views/restore.tsx`;
  const source = directory.createSourceFile(file, '', { overwrite: true });
  const ids = model.ids.map(column => column.name);
  const path = ids.map(name => `\${results.${name}}`).join('/');
  const link = (action: string) => `\`\${root}/${model.dash}/${action}/${path}\``;

  //import 'frui/frui.css';
  //import 'stackpress/fouc.css';

  //import type { PageHeadProps, PageBodyProps, 
  //AdminDataProps } from 'stackpress/view';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view',
    namedImports: [
      'PageHeadProps',
      'PageBodyProps',
      'AdminDataProps'
    ]
  });
  //import type { SearchParams } from 'stackpress/sql';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql',
    namedImports: [ 'SearchParams' ]
  });
  //import type { ProfileExtended } from '../../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types',
    namedImports: [ `${model.title}Extended` ]
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

  //export function AdminProfileRestoreCrumbs() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}RestoreCrumbs`,
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
          label: (
            <span className="theme-info">{_('${model.plural}')}</span>
          ),
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
          label: _('Restore'),
          icon: 'check-circle'
        }
      ];
      return (<Crumbs crumbs={crumbs} />);
    `)
  });
  //export function AdminProfileRestoreForm() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}RestoreForm`,
    parameters: [{ 
      name: 'props', 
      type: `{ root: string, results: ${model.title}Extended }` 
    }],
    statements: (`
      const { root, results } = props;
      const { _ } = useLanguage();
      return (
        <div>
          <div className="theme-bg-bg1 px-fs-16 px-p-20">
            <i className="px-mr-5 inline-block fas fa-fw fa-info-circle"></i>
            <strong className="font-semibold">
              {_(
                'Are you sure you want to restore %s?', 
                \`${model.transformTemplate('${results?.%s || \'\'}')}\`
              )}
            </strong> 
          </div>
          <div className="px-mt-20">
            <a 
              className="theme-bg-muted px-px-14 px-py-10 inline-block rounded" 
              href={${link('detail')}}
            >
              <i className="px-mr-5 inline-block fas fa-fw fa-arrow-left"></i>
              <span>Nevermind.</span>
            </a>
            <a 
              className="theme-bg-success px-px-14 px-py-10 px-ml-10 inline-block rounded" 
              href="?confirmed=true"
            >
              <i className="px-mr-5 inline-block fas fa-fw fa-check-circle"></i>
              <span>{_('Confirmed')}</span>
            </a>
          </div>
        </div>
      ); 
    `)
  });
  //export function AdminProfileRestoreBody() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}RestoreBody`,
    parameters: [{ 
      name: 'props', 
      type: `PageBodyProps<${[
        `AdminDataProps`, 
        'Partial<SearchParams>', 
        `${model.title}Extended`
      ].join(', ')}>`  
    }],
    statements: (`
      const { data, response } = props;
      const { root = '/admin' } = data.admin || {};
      const results = response.results as ${model.title}Extended;
      //render
      return (
        <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
          <div className="px-px-10 px-py-14 theme-bg-bg2">
            <Admin${model.title}RestoreCrumbs root={root} results={results} />
          </div>
          <div className="px-p-10">
            <Admin${model.title}RestoreForm root={root} results={results} />
          </div>
        </main>
      );
    `)
  });
  //export function AdminProfileRestoreHead() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}RestoreHead`,
    parameters: [{ 
      name: 'props', 
      type: `PageHeadProps<${[
        `AdminDataProps`, 
        'Partial<SearchParams>', 
        `${model.title}Extended`
      ].join(', ')}>`  
    }],
    statements: (`
      const { data, styles = [] } = props;
      const { _ } = useLanguage();
      return (
        <>
          <title>{_('Restore ${model.singular}')}</title>
          {data.icon && <link rel="icon" type="image/svg+xml" href={data.icon} />}
          <link rel="stylesheet" type="text/css" href="/styles/global.css" />
          {styles.map((href, index) => (
            <link key={index} rel="stylesheet" type="text/css" href={href} />
          ))}
        </>
      );  
    `)
  });
  //export function AdminProfileRestorePage() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}RestorePage`,
    parameters: [{ 
      name: 'props', 
      type: `PageBodyProps<${[
        `AdminDataProps`, 
        'Partial<SearchParams>', 
        `${model.title}Extended`
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
          <Admin${model.title}RestoreBody {...props} />
        </LayoutAdmin>
      );
    `)
  });
  //export const Head = AdminProfileRestoreHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: `Admin${model.title}RestoreHead`
    }]
  });
  //export default AdminProfileRestorePage;
  source.addStatements(`export default Admin${model.title}RestorePage;`);
}