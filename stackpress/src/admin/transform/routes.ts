//modules
import type { Directory } from 'ts-morph';
//schema
import type Registry from '../../schema/Registry.js';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    const ids = model.ids.map(column => `:${column.name}`).join('/')
    const file = `${model.name}/admin/routes.ts`;
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
          \`\${root}/${model.dashCase}/create\`, 
          () => import('./pages/create.js')
        );
        server.import.all(
          \`\${root}/${model.dashCase}/detail/${ids}\`, 
          () => import('./pages/detail.js')
        );
        server.import.all(
          \`\${root}/${model.dashCase}/export\`, 
          () => import('./pages/export.js')
        );
        server.import.all(
          \`\${root}/${model.dashCase}/import\`, 
          () => import('./pages/import.js')
        );
        server.import.all(
          \`\${root}/${model.dashCase}/remove/${ids}\`, 
          () => import('./pages/remove.js')
        );
        server.import.all(
          \`\${root}/${model.dashCase}/restore/${ids}\`, 
          () => import('./pages/restore.js')
        );
        server.import.all(
          \`\${root}/${model.dashCase}/search\`, 
          () => import('./pages/search.js')
        );
        server.import.all(
          \`\${root}/${model.dashCase}/update/${ids}\`, 
          () => import('./pages/update.js')
        );

        const module = server.config.path<string>('client.module');
        if (module) {
          server.view.all(
            \`\${root}/${model.dashCase}/create\`, 
            \`\${module}/${model.name}/admin/views/create\`,
            -100
          );
          server.view.all(
            \`\${root}/${model.dashCase}/detail/${ids}\`, 
            \`\${module}/${model.name}/admin/views/detail\`,
            -100
          );
          server.view.all(
            \`\${root}/${model.dashCase}/remove/${ids}\`, 
            \`\${module}/${model.name}/admin/views/remove\`,
            -100
          );
          server.view.all(
            \`\${root}/${model.dashCase}/restore/${ids}\`, 
            \`\${module}/${model.name}/admin/views/restore\`,
            -100
          );
          server.view.all(
            \`\${root}/${model.dashCase}/search\`, 
            \`\${module}/${model.name}/admin/views/search\`,
            -100
          );
          server.view.all(
            \`\${root}/${model.dashCase}/update/${ids}\`, 
            \`\${module}/${model.name}/admin/views/update\`,
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
  for (const model of registry.model.values()) {
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name}/admin/routes.js`,
      defaultImport: `${model.camelCase}Routes`
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
      ${Array.from(registry.model.values()).map(
        model => `${model.camelCase}Routes(server);`
      ).join('\n')}
    `.trim()
  });
};