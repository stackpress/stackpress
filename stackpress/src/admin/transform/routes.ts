//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../schema/transform/helpers.js';

export default function generate(directory: Directory, model: Model) {
  const ids = model.store.ids.toArray().map(
    column => `:${column.name.toString()}`
  ).join('/');
  const related = model.columns.filter(
    column => Boolean(
      column.type.model 
        && column.store.localRelationship
        && column.store.localRelationship.foreign.type === 2
    )
  ).toArray();
  
  const filepath = model.name.toPathName('%s/admin/routes.ts');
  //load Profile/index.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);
  
  //import type Server from '@stackpress/ingest//Server';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/Server',
    defaultImport: 'Server'
  });
  //export default function route(server: Server) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'routes',
    parameters: [
      { name: 'server', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.ROUTES,
      {
        ids: ids,
        copy: {
          route: model.name.toURLPath('${root}/%s/create/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/create'),
          import: './pages/copy.js'
        },
        create: {
          route: model.name.toURLPath('${root}/%s/create'),
          view: model.name.toPathName('${module}/%s/admin/views/create'),
          import: './pages/create.js'
        },
        detail: {
          route: model.name.toURLPath('${root}/%s/detail/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/detail'),
          import: './pages/detail.js'
        },
        remove: {
          route: model.name.toURLPath('${root}/%s/remove/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/remove'),
          import: './pages/remove.js'
        },
        restore: model.store.restorable ? {
          route: model.name.toURLPath('${root}/%s/restore/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/restore'),
          import: './pages/restore.js'
        } : null,
        search: {
          route: model.name.toURLPath('${root}/%s/search'),
          view: model.name.toPathName('${module}/%s/admin/views/search'),
          import: './pages/search.js'
        },
        update: {
          route: model.name.toURLPath('${root}/%s/update/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/update'),
          import: './pages/update.js'
        },
        import: {
          route: model.name.toURLPath('${root}/%s/import'),
          import: './pages/import.js'
        },
        export: {
          route: model.name.toURLPath('${root}/%s/export'),
          import: './pages/export.js'
        },
        details: related.map(column => {
          const relationship = column.store.localRelationship!;
          return {
            create: {
              route: renderCode('${root}/<%model%>/detail/<%ids%>/<%relation%>/create', {
                model: model.name.toURLPath(),
                ids: ids,
                relation: relationship.foreign.column.name.toURLPath()
              }),
              import: renderCode('./pages/<%relation%>/create.js', {
                relation: relationship.foreign.column.name.toString()
              }),
              view: renderCode('${module}/<%model%>/admin/views/<%relation%>/create', {
                model: model.name.toString(),
                relation: relationship.foreign.column.name.toString()
              })
            },
            export: {
              route: renderCode('${root}/<%model%>/detail/<%ids%>/<%relation%>/export', {
                model: model.name.toURLPath(),
                ids: ids,
                relation: relationship.foreign.column.name.toURLPath()
              }),
              import: renderCode('./pages/<%relation%>/export.js', {
                relation: relationship.foreign.column.name.toString()
              }),
              view: renderCode('${module}/<%model%>/admin/views/<%relation%>/export', {
                model: model.name.toString(),
                relation: relationship.foreign.column.name.toString()
              })
            },
            import: {
              route: renderCode('${root}/<%model%>/detail/<%ids%>/<%relation%>/import', {
                model: model.name.toURLPath(),
                ids: ids,
                relation: relationship.foreign.column.name.toURLPath()
              }),
              import: renderCode('./pages/<%relation%>/import.js', {
                relation: relationship.foreign.column.name.toString()
              }),
              view: renderCode('${module}/<%model%>/admin/views/<%relation%>/import', {
                model: model.name.toString(),
                relation: relationship.foreign.column.name.toString()
              })
            },
            search: {
              route: renderCode('${root}/<%model%>/detail/<%ids%>/<%relation%>/search', {
                model: model.name.toURLPath(),
                ids: ids,
                relation: relationship.foreign.column.name.toURLPath()
              }),
              import: renderCode('./pages/<%relation%>/search.js', {
                relation: relationship.foreign.column.name.toString()
              }),
              view: renderCode('${module}/<%model%>/admin/views/<%relation%>/search', {
                model: model.name.toString(),
                relation: relationship.foreign.column.name.toString()
              })
            }
          };
        })
      }
    )
  });
};

export const TEMPLATE = {

ROUTES:
`const base = server.config.path('admin.base', '/admin');
const root = server.config.path('admin.root', base);
server.import.all(
  \`<%create.route%>\`, 
  () => import('<%create.import%>')
);
server.import.all(
  \`<%search.route%>\`, 
  () => import('<%search.import%>')
);
server.import.all(
  \`<%export.route%>\`, 
  () => import('<%export.import%>')
);
server.import.all(
  \`<%import.route%>\`, 
  () => import('<%import.import%>')
);
<%#ids%>
  server.import.all(
    \`<%copy.route%>\`, 
    () => import('<%copy.import%>')
  );
  server.import.all(
    \`<%detail.route%>\`, 
    () => import('<%detail.import%>')
  );
  server.import.all(
    \`<%remove.route%>\`, 
    () => import('<%remove.import%>')
  );
  <%#restore%>
    server.import.all(
      \`<%restore.route%>\`, 
      () => import('<%restore.import%>')
    );
  <%/restore%>
  server.import.all(
    \`<%update.route%>\`, 
    () => import('<%update.import%>')
  );
  <%#details%>
    server.import.all(
      \`<%create.route%>\`, 
      () => import('<%create.import%>')
    );
    server.import.all(
      \`<%export.route%>\`, 
      () => import('<%export.import%>')
    );
    server.import.all(
      \`<%import.route%>\`, 
      () => import('<%import.import%>')
    );
    server.import.all(
      \`<%search.route%>\`, 
      () => import('<%search.import%>')
    );
  <%/details%>
<%/ids%>

const module = server.config.path<string>('client.module');
if (module) {
  server.view.all(
    \`<%create.route%>\`, 
    \`<%create.view%>\`,
    -100
  );
  server.view.all(
    \`<%search.route%>\`, 
    \`<%search.view%>\`,
    -100
  );
  <%#ids%>
    server.view.all(
      \`<%copy.route%>\`, 
      \`<%copy.view%>\`,
      -100
    );
    server.view.all(
      \`<%detail.route%>\`, 
      \`<%detail.view%>\`,
      -100
    );
    server.view.all(
      \`<%remove.route%>\`, 
      \`<%remove.view%>\`,
      -100
    );
    <%#restore%>
      server.view.all(
        \`<%restore.route%>\`, 
        \`<%restore.view%>\`,
        -100
      );
    <%/restore%>
    server.view.all(
      \`<%update.route%>\`, 
      \`<%update.view%>\`,
      -100
    );
    <%#details%>
      server.view.all(
        \`<%create.route%>\`, 
        \`<%create.view%>\`,
        -100
      );
      server.view.all(
        \`<%search.route%>\`, 
        \`<%search.view%>\`,
        -100
      );
    <%/details%>
  <%/ids%>
}`,

};