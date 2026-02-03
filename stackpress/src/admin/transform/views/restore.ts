//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress/schema
import type Schema from '../../../schema/Schema.js';
import type Model from '../../../schema/model/Model.js';
//stackpress/admin
import { render } from '../helpers.js';

export default function removeView(directory: Directory, _schema: Schema, model: Model) {
  const file = `${model.name.toString()}/admin/views/restore.tsx`;
  const source = directory.createSourceFile(file, '', { overwrite: true });
  const ids = model.store.ids.toArray().map(column => column.name);
  const path = ids.map(name => `\${results.${name}}`).join('/');
  const link = (action: string) => `\`\${base}/${model.name.dashCase}/${action}/${path}\``;

  //import 'frui/frui.css';
  //import 'stackpress/fouc.css';

  //import type { ServerPageProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'ServerPageProps' ]
  });
  //import type { AdminConfigProps } from 'stackpress/admin/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/admin/types',
    namedImports: [ 'AdminConfigProps' ]
  });
  //import type { SearchParams } from 'stackpress/sql';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql',
    namedImports: [ 'SearchParams' ]
  });
  //import type { ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ `${model.name.titleCase}Extended` ]
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

  //export function AdminProfileRestoreCrumbs() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.name.titleCase}RestoreCrumbs`,
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
          label: (
            <span className="admin-crumb">{_('${model.name.plural}')}</span>
          ),
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
    name: `Admin${model.name.titleCase}RestoreForm`,
    parameters: [{ 
      name: 'props', 
      type: `{ base: string, results: ${model.name.titleCase}Extended }` 
    }],
    statements: (`
      const { base, results } = props;
      const { _ } = useLanguage();
      return (
        <div>
          <div className="message">
            <i className="icon fas fa-fw fa-info-circle"></i>
            <strong className="font-semibold">
              {_(
                'Are you sure you want to restore %s?', 
                \`${render(model, "${results?.%s || ''}")}\`
              )}
            </strong> 
          </div>
          <div className="actions">
            <a className="action cancel" href={${link('detail')}}>
              <i className="icon fas fa-fw fa-arrow-left"></i>
              <span>Nevermind.</span>
            </a>
            <a className="action restore" href="?confirmed=true">
              <i className="icon fas fa-fw fa-check-circle"></i>
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
    name: `Admin${model.name.titleCase}RestoreBody`,
    statements: (`
      const { config, response } = useServer<${[
        `AdminConfigProps`, 
        'Partial<SearchParams>', 
        `${model.name.titleCase}Extended`
      ].join(', ')}>();
      const base = config.path('admin.base', '/admin');
      const results = response.results as ${model.name.titleCase}Extended;
      //render
      return (
        <main className="admin-page admin-confirm-page">
          <div className="admin-crumbs">
            <Admin${model.name.titleCase}RestoreCrumbs base={base} results={results} />
          </div>
          <div className="admin-confirm">
            <Admin${model.name.titleCase}RestoreForm base={base} results={results} />
          </div>
        </main>
      );
    `)
  });
  //export function AdminProfileRestoreHead() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.name.titleCase}RestoreHead`,
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
          <title>{_('Restore ${model.name.singular}')}</title>
          {favicon && <link rel="icon" type={mimetype} href={favicon} />}
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
    name: `Admin${model.name.titleCase}RestorePage`,
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: (`
      return (
        <LayoutAdmin {...props}>
          <Admin${model.name.titleCase}RestoreBody />
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
      initializer: `Admin${model.name.titleCase}RestoreHead`
    }]
  });
  //export default AdminProfileRestorePage;
  source.addStatements(`export default Admin${model.name.titleCase}RestorePage;`);
}