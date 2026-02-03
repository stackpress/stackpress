//modules
import type { Directory } from 'ts-morph';
//schema
import type Schema from '../../schema/Schema.js';

export default function generate(directory: Directory, schema: Schema) {
  //loop through models
  for (const model of schema.models.values()) {
    const ids = model.store.ids.toArray().map(column => `:${column.name.toString()}`).join('/')
    const file = `${model.name.toString()}/admin/routes.ts`;
    const source = directory.createSourceFile(file, '', { overwrite: true });
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
      statements: `
        const root = server.config.path('admin.root', '/admin');
        server.import.all(
          \`\${root}/${model.name.dashCase}/create\`, 
          () => import('./pages/create.js')
        );
        server.import.all(
          \`\${root}/${model.name.dashCase}/detail/${ids}\`, 
          () => import('./pages/detail.js')
        );
        server.import.all(
          \`\${root}/${model.name.dashCase}/export\`, 
          () => import('./pages/export.js')
        );
        server.import.all(
          \`\${root}/${model.name.dashCase}/import\`, 
          () => import('./pages/import.js')
        );
        server.import.all(
          \`\${root}/${model.name.dashCase}/remove/${ids}\`, 
          () => import('./pages/remove.js')
        );
        server.import.all(
          \`\${root}/${model.name.dashCase}/restore/${ids}\`, 
          () => import('./pages/restore.js')
        );
        server.import.all(
          \`\${root}/${model.name.dashCase}/search\`, 
          () => import('./pages/search.js')
        );
        server.import.all(
          \`\${root}/${model.name.dashCase}/update/${ids}\`, 
          () => import('./pages/update.js')
        );

        const module = server.config.path<string>('client.module');
        if (module) {
          server.view.all(
            \`\${root}/${model.name.dashCase}/create\`, 
            \`\${module}/${model.name.toString()}/admin/views/create\`,
            -100
          );
          server.view.all(
            \`\${root}/${model.name.dashCase}/detail/${ids}\`, 
            \`\${module}/${model.name.toString()}/admin/views/detail\`,
            -100
          );
          server.view.all(
            \`\${root}/${model.name.dashCase}/remove/${ids}\`, 
            \`\${module}/${model.name.toString()}/admin/views/remove\`,
            -100
          );
          server.view.all(
            \`\${root}/${model.name.dashCase}/restore/${ids}\`, 
            \`\${module}/${model.name.toString()}/admin/views/restore\`,
            -100
          );
          server.view.all(
            \`\${root}/${model.name.dashCase}/search\`, 
            \`\${module}/${model.name.toString()}/admin/views/search\`,
            -100
          );
          server.view.all(
            \`\${root}/${model.name.dashCase}/update/${ids}\`, 
            \`\${module}/${model.name.toString()}/admin/views/update\`,
            -100
          );
        }
      `.trim()
    });
  }

  const source = directory.createSourceFile('admin.ts', '', { 
    overwrite: true 
  });
  //import Server from '@stackpress/ingest/Server';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/ingest/Server',
    defaultImport: 'Server'
  });
  //import profileRoutes from './profile/admin/routes.js';
  for (const model of schema.models.values()) {
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name.toString()}/admin/routes.js`,
      defaultImport: `${model.name.camelCase}Routes`
    });
  }

  //export default function route(router: MethodRouter) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'admin',
    parameters: [
      { name: 'server', type: 'Server' }
    ],
    statements: `
      ${Array.from(schema.models.values()).map(
        model => `${model.name.camelCase}Routes(server);`
      ).join('\n')}
    `.trim()
  });
};