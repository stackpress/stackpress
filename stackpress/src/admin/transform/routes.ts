//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../schema/transform/helpers.js';

export default function generate(directory: Directory, model: Model) {
  const ids = model.store.ids.toArray().map(column => `:${column.name.toString()}`).join('/')
  
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
        create: {
          route: model.name.toURLPath('${root}/%s/create'),
          view: model.name.toPathName('${module}/%s/admin/views/create')
        },
        detail: {
          route: model.name.toURLPath('${root}/%s/detail/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/detail')
        },
        remove: {
          route: model.name.toURLPath('${root}/%s/remove/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/remove')
        },
        restore: {
          route: model.name.toURLPath('${root}/%s/restore/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/restore')
        },
        search: {
          route: model.name.toURLPath('${root}/%s/search'),
          view: model.name.toPathName('${module}/%s/admin/views/search')
        },
        update: {
          route: model.name.toURLPath('${root}/%s/update/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/update')
        },
        import: {
          route: model.name.toURLPath('${root}/%s/import')
        },
        export: {
          route: model.name.toURLPath('${root}/%s/export')
        }
      }
    )
  });
};

export const TEMPLATE = {

ROUTES:
`const root = server.config.path('admin.root', '/admin');
server.import.all(
  \`<%create.route%>\`, 
  () => import('./pages/create.js')
);
server.import.all(
  \`<%search.route%>\`, 
  () => import('./pages/search.js')
);
server.import.all(
  \`<%export.route%>\`, 
  () => import('./pages/export.js')
);
server.import.all(
  \`<%import.route%>\`, 
  () => import('./pages/import.js')
);
<%#ids%>
  server.import.all(
    \`<%detail.route%>\`, 
    () => import('./pages/detail.js')
  );
  server.import.all(
    \`<%remove.route%>\`, 
    () => import('./pages/remove.js')
  );
  server.import.all(
    \`<%restore.route%>\`, 
    () => import('./pages/restore.js')
  );
  server.import.all(
    \`<%update.route%>\`, 
    () => import('./pages/update.js')
  );
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
      \`<%detail.route%>\`, 
      \`<%detail.view%>\`,
      -100
    );
    server.view.all(
      \`<%remove.route%>\`, 
      \`<%remove.view%>\`,
      -100
    );
    server.view.all(
      \`<%restore.route%>\`, 
      \`<%restore.view%>\`,
      -100
    );
    server.view.all(
      \`<%update.route%>\`, 
      \`<%update.view%>\`,
      -100
    );
  <%/ids%>
}`,

};