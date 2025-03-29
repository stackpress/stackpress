//modules
import type { Directory } from 'ts-morph';
//schema
import type Registry from '../../schema/Registry';

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
          \`\${root}/${model.dash}/create\`, 
          () => import('./pages/create')
        );
        server.import.all(
          \`\${root}/${model.dash}/detail/${ids}\`, 
          () => import('./pages/detail')
        );
        server.import.all(
          \`\${root}/${model.dash}/export\`, 
          () => import('./pages/export')
        );
        server.import.all(
          \`\${root}/${model.dash}/import\`, 
          () => import('./pages/import')
        );
        server.import.all(
          \`\${root}/${model.dash}/remove/${ids}\`, 
          () => import('./pages/remove')
        );
        server.import.all(
          \`\${root}/${model.dash}/restore/${ids}\`, 
          () => import('./pages/restore')
        );
        server.import.all(
          \`\${root}/${model.dash}/search\`, 
          () => import('./pages/search')
        );
        server.import.all(
          \`\${root}/${model.dash}/update/${ids}\`, 
          () => import('./pages/update')
        );

        const module = server.config.path('client.module', '.client');
        server.view.all(
          \`\${root}/${model.dash}/create\`, 
          \`\${module}/${model.name}/admin/views/create\`,
          -100
        );
        server.view.all(
          \`\${root}/${model.dash}/detail/${ids}\`, 
          \`\${module}/${model.name}/admin/views/detail\`,
          -100
        );
        server.view.all(
          \`\${root}/${model.dash}/remove/${ids}\`, 
          \`\${module}/${model.name}/admin/views/remove\`,
          -100
        );
        server.view.all(
          \`\${root}/${model.dash}/restore/${ids}\`, 
          \`\${module}/${model.name}/admin/views/restore\`,
          -100
        );
        server.view.all(
          \`\${root}/${model.dash}/search\`, 
          \`\${module}/${model.name}/admin/views/search\`,
          -100
        );
        server.view.all(
          \`\${root}/${model.dash}/update/${ids}\`, 
          \`\${module}/${model.name}/admin/views/update\`,
          -100
        );
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
  //import profileRoutes from './profile/admin/routes';
  for (const model of registry.model.values()) {
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name}/admin/routes`,
      defaultImport: `${model.camel}Routes`
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
        model => `${model.camel}Routes(server);`
      ).join('\n')}
    `.trim()
  });
};