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
          route: model.name.toURLPath('${base}/%s/create/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/create'),
          import: './pages/copy.js'
        },
        create: {
          route: model.name.toURLPath('${base}/%s/create'),
          view: model.name.toPathName('${module}/%s/admin/views/create'),
          import: './pages/create.js'
        },
        detail: {
          route: model.name.toURLPath('${base}/%s/detail/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/detail'),
          import: './pages/detail.js'
        },
        remove: {
          route: model.name.toURLPath('${base}/%s/remove/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/remove'),
          import: './pages/remove.js'
        },
        restore: model.store.restorable ? {
          route: model.name.toURLPath('${base}/%s/restore/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/restore'),
          import: './pages/restore.js'
        } : null,
        search: {
          route: model.name.toURLPath('${base}/%s/search'),
          view: model.name.toPathName('${module}/%s/admin/views/search'),
          import: './pages/search.js'
        },
        update: {
          route: model.name.toURLPath('${base}/%s/update/' + ids),
          view: model.name.toPathName('${module}/%s/admin/views/update'),
          import: './pages/update.js'
        },
        import: {
          route: model.name.toURLPath('${base}/%s/import'),
          import: './pages/import.js'
        },
        export: {
          route: model.name.toURLPath('${base}/%s/export'),
          import: './pages/export.js'
        },
        details: related.map(column => {
          const relationship = column.store.localRelationship!;
          return {
            name: column.name.toString(),
            create: {
              route: renderCode('${base}/<%model%>/detail/<%ids%>/<%relation%>/create', {
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
              route: renderCode('${base}/<%model%>/detail/<%ids%>/<%relation%>/export', {
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
              route: renderCode('${base}/<%model%>/detail/<%ids%>/<%relation%>/import', {
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
              route: renderCode('${base}/<%model%>/detail/<%ids%>/<%relation%>/search', {
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

//------------------------------------------------------------------//
// Page Routes

//create
server.import.get(
  \`<%create.route%>\`, 
  () => import('<%create.import%>')
);
server.import.post(
  \`<%create.route%>\`, 
  () => import('<%create.import%>')
);

//search
server.import.get(
  \`<%search.route%>\`, 
  () => import('<%search.import%>')
);

//export
server.import.get(
  \`<%export.route%>\`, 
  () => import('<%export.import%>')
);

//import
server.import.post(
  \`<%import.route%>\`, 
  () => import('<%import.import%>')
);

<%#?:ids%>
  //copy
  server.import.get(
    \`<%copy.route%>\`, 
    () => import('<%copy.import%>')
  );
  server.import.post(
    \`<%copy.route%>\`, 
    () => import('<%copy.import%>')
  );

  //detail
  server.import.get(
    \`<%detail.route%>\`, 
    () => import('<%detail.import%>')
  );

  //remove
  server.import.get(
    \`<%remove.route%>\`, 
    () => import('<%remove.import%>')
  );
  server.import.delete(
    \`<%remove.route%>\`, 
    () => import('<%remove.import%>')
  );

  <%#?:restore%>
    //restore
    server.import.get(
      \`<%restore.route%>\`, 
      () => import('<%restore.import%>')
    );
    server.import.post(
      \`<%restore.route%>\`, 
      () => import('<%restore.import%>')
    );
  <%/?:restore%>

  //update
  server.import.get(
    \`<%update.route%>\`, 
    () => import('<%update.import%>')
  );
  server.import.post(
    \`<%update.route%>\`, 
    () => import('<%update.import%>')
  );
  server.import.put(
    \`<%update.route%>\`, 
    () => import('<%update.import%>')
  );

  <%#?:details%>
    //<%name%> create
    server.import.get(
      \`<%create.route%>\`, 
      () => import('<%create.import%>')
    );
    server.import.post(
      \`<%create.route%>\`, 
      () => import('<%create.import%>')
    );

    //<%name%> export
    server.import.get(
      \`<%export.route%>\`, 
      () => import('<%export.import%>')
    );

    //<%name%> import
    server.import.post(
      \`<%import.route%>\`, 
      () => import('<%import.import%>')
    );

    //<%name%> search
    server.import.get(
      \`<%search.route%>\`, 
      () => import('<%search.import%>')
    );
  <%/?:details%>
<%/?:ids%>

//------------------------------------------------------------------//
// View Routes

const module = server.config.path<string>('client.module');
if (module) {
  //create
  server.view.get(
    \`<%create.route%>\`, 
    \`<%create.view%>\`,
    -100
  );
  server.view.post(
    \`<%create.route%>\`, 
    \`<%create.view%>\`,
    -100
  );

  //search
  server.view.get(
    \`<%search.route%>\`, 
    \`<%search.view%>\`,
    -100
  );

  <%#?:ids%>
    //copy
    server.view.get(
      \`<%copy.route%>\`, 
      \`<%copy.view%>\`,
      -100
    );
    server.view.post(
      \`<%copy.route%>\`, 
      \`<%copy.view%>\`,
      -100
    );

    //detail
    server.view.get(
      \`<%detail.route%>\`, 
      \`<%detail.view%>\`,
      -100
    );

    //remove
    server.view.get(
      \`<%remove.route%>\`, 
      \`<%remove.view%>\`,
      -100
    );
    server.view.delete(
      \`<%remove.route%>\`, 
      \`<%remove.view%>\`,
      -100
    );

    <%#?:restore%>
      //restore
      server.view.get(
        \`<%restore.route%>\`, 
        \`<%restore.view%>\`,
        -100
      );
      server.view.post(
        \`<%restore.route%>\`, 
        \`<%restore.view%>\`,
        -100
      );
    <%/?:restore%>

    //update
    server.view.get(
      \`<%update.route%>\`, 
      \`<%update.view%>\`,
      -100
    );
    server.view.post(
      \`<%update.route%>\`, 
      \`<%update.view%>\`,
      -100
    );
    server.view.put(
      \`<%update.route%>\`, 
      \`<%update.view%>\`,
      -100
    );

    <%#?:details%>
      //<%name%> create
      server.view.get(
        \`<%create.route%>\`, 
        \`<%create.view%>\`,
        -100
      );
      server.view.post(
        \`<%create.route%>\`, 
        \`<%create.view%>\`,
        -100
      );

      //<%name%> search
      server.view.get(
        \`<%search.route%>\`, 
        \`<%search.view%>\`,
        -100
      );
    <%/?:details%>
  <%/?:ids%>
}`,

};