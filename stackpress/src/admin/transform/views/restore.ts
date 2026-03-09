//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';
//stackpress/admin
import { render } from '../helpers.js';

export default function restoreView(directory: Directory, model: Model) {
  const ids = model.store.ids.toArray().map(column => column.name);
  const path = ids.map(name => `\${results.${name}}`).join('/');
  const link = (action: string) => `\`\${base}/${model.name.dashCase}/${action}/${path}\``;

  const filepath = model.name.toPathName('%s/admin/views/restore.tsx');
  //load Profile/admin/views/restore.tsx if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

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
  //import type { StoreSearchQuery } from 'stackpress/sql/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql/types',
    namedImports: [ 'StoreSearchQuery' ]
  });
  //import type { ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ model.name.toTypeName('%sExtended') ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Bread from 'frui/Bread';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Bread',
    defaultImport: 'Bread'
  });
  //import { useServer, LayoutAdmin } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'useServer', 'LayoutAdmin' ]
  });

  //export function AdminProfileRestoreCrumbs() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sRestoreCrumbs'),
    parameters: [{ 
      name: 'props', 
      type: renderCode(TEMPLATE.RESTORE_CRUMBS_PROPS, { 
        type: model.name.toTypeName('%sExtended') 
      }) 
    }],
    statements: renderCode(TEMPLATE.RESTORE_CRUMBS_BODY, {
      search: {
        label: model.name.plural || model.name.titleCase,
        icon: model.name.icon
      },
      detail: {
        label: render(model, "${results?.%s || ''}"),
        href: link('detail')
      }
    })
  });
  //export function AdminProfileRestoreForm() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sRestoreForm'),
    parameters: [{ 
      name: 'props', 
      type: renderCode(TEMPLATE.RESTORE_FORM_PROPS, { 
        type: model.name.toTypeName('%sExtended') 
      }) 
    }],
    statements: renderCode(TEMPLATE.RESTORE_FORM_BODY, { 
      label: render(model, "${results?.%s || ''}"),
      href: link('detail')
    })
  });
  //export function AdminProfileRestoreBody() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sRestoreBody'),
    statements: renderCode(TEMPLATE.RESTORE_BODY, {
      type: model.name.toTypeName('%sExtended'),
      crumbs: model.name.toComponentName('Admin%sRestoreCrumbs'),
      form: model.name.toComponentName('Admin%sRestoreForm')
    })
  });
  //export function AdminProfileRestoreHead() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sRestoreHead'),
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: renderCode(TEMPLATE.RESTORE_HEAD, { 
      name: model.name.singular 
    })
  });
  //export function AdminProfileRestorePage() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sRestorePage'),
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: renderCode(TEMPLATE.RESTORE_PAGE, { 
      component: model.name.toComponentName('Admin%sRestoreBody') 
    })
  });
  //export const Head = AdminProfileRestoreHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: model.name.toComponentName('Admin%sRestoreHead')
    }]
  });
  //export default AdminProfileRestorePage;
  source.addStatements(
    `export default ${model.name.toComponentName('Admin%sRestorePage')};`
  );
};

export const TEMPLATE = {

RESTORE_CRUMBS_PROPS:
'{ base: string, results: <%type%> }',

RESTORE_CRUMBS_BODY:
`const { base, results } = props;
//hooks
const { _ } = useLanguage();
return (
  <Bread crumb={({ active }) => active ? 'font-bold' : 'font-normal'}>
    <Bread.Slicer value="›" />
    <Bread.Crumb icon="<%search.icon%>" className="admin-crumb" href="../search">
      {_('<%search.label%>')}
    </Bread.Crumb>
    <Bread.Crumb href={<%detail.href%>}>
      {_(\`<%detail.label%>\`)}
    </Bread.Crumb>
    <Bread.Crumb icon="check-circle">
      {_('Restore')}
    </Bread.Crumb>
  </Bread>
);`,

RESTORE_FORM_PROPS:
'{ base: string, results: <%type%> }',

RESTORE_FORM_BODY:
`const { base, results } = props;
const { _ } = useLanguage();
return (
  <div>
    <div className="message">
      <i className="icon fas fa-fw fa-info-circle"></i>
      <strong>
        {_(
          'Are you sure you want to restore %s?', 
          \`<%label%>\`
        )}
      </strong> 
    </div>
    <div className="actions">
      <a className="action cancel" href={<%href%>}>
        <i className="icon fas fa-fw fa-arrow-left"></i>
        <span>Nevermind.</span>
      </a>
      <a className="action restore" href="?confirmed=true">
        <i className="icon fas fa-fw fa-check-circle"></i>
        <span>{_('Confirmed')}</span>
      </a>
    </div>
  </div>
);`,

RESTORE_BODY:
`const { config, response } = useServer<AdminConfigProps, Partial<StoreSearchQuery>, <%type%>>();
const base = config.path('admin.base', '/admin');
const results = response.results as <%type%>;
//render
return (
  <main className="admin-page admin-confirm-page">
    <div className="admin-crumbs">
      <<%crumbs%> base={base} results={results} />
    </div>
    <div className="admin-confirm">
      <<%form%> base={base} results={results} />
    </div>
  </main>
);`,

RESTORE_HEAD:
`const { data, styles = [] } = props;
const { favicon = '/favicon.ico' } = data?.brand || {};
const { _ } = useLanguage();
const mimetype = favicon.endsWith('.png')
  ? 'image/png'
  : favicon.endsWith('.svg')
  ? 'image/svg+xml'
  : 'image/x-icon';
return (
  <>
    <title>{_('Restore <%name%>')}</title>
    {favicon && <link rel="icon" type={mimetype} href={favicon} />}
    <link rel="stylesheet" type="text/css" href="/styles/global.css" />
    {styles.map((href, index) => (
      <link key={index} rel="stylesheet" type="text/css" href={href} />
    ))}
  </>
);`,

RESTORE_PAGE:
`return (
  <LayoutAdmin {...props}>
    <<%component%> />
  </LayoutAdmin>
);`

};