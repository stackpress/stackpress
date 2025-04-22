//node
import path from 'node:path';
//modules
import type { Directory } from 'ts-morph';
//stackpress
import type { SchemaConfig } from '@stackpress/idea-parser';
import type Server from '@stackpress/ingest/Server';

/**
 * This is the The params comes form the cli
 */
export default async function generate(
  directory: Directory, 
  schema: SchemaConfig, 
  server: Server
) {
  const fs = server.loader.fs;
  const pwd = directory.getPath();
  const name = server.config.path('client.package', 'stackpress-client');
  const exports: Record<string, string> = {};
  const types: Record<string, string[]> = {};
  
  Object.values(schema.model || {}).forEach(model => {
    const name = model.name;
    const actions = `${name}/actions`;
    const admin = `${name}/admin`;
    const components = `${name}/components`;
    const events = `${name}/events`;
    const tests = `${name}/tests`;

    exports[`./${actions}`] = `./${actions}/index.js`;
    exports[`./${actions}/*`] = `./${actions}/*.js`;
    exports[`./${admin}/pages/*`] = `./${admin}/pages/*.js`;
    exports[`./${admin}/views/*`] = `./${admin}/views/*.js`;
    exports[`./${admin}/routes`] = `./${admin}/routes.js`;
    exports[`./${components}/fields/*`] = `./${components}/fields/*.js`;
    exports[`./${components}/filters/*`] = `./${components}/filters/*.js`;
    exports[`./${components}/lists/*`] = `./${components}/lists/*.js`;
    exports[`./${components}/spans/*`] = `./${components}/spans/*.js`;
    exports[`./${components}/views/*`] = `./${components}/views/*.js`;
    exports[`./${events}`] = `./${events}/index.js`;
    exports[`./${events}/*`] = `./${events}/*.js`;
    exports[`./${tests}`] = `./${tests}/index.js`;
    exports[`./${tests}/*`] = `./${tests}/*.js`;
    exports[`./${name}`] = `./${name}/index.js`;
    exports[`./${name}/*`] = `./${name}/*.js`;

    types[actions] = [ `./${actions}/index.d.ts` ];
    types[`${actions}/*`] = [ `./${actions}/*.d.ts` ];
    types[`${admin}/pages/*`] = [ `./${admin}/pages/*.d.ts` ];
    types[`${admin}/views/*`] = [ `./${admin}/views/*.d.ts` ];
    types[`${admin}/routes`] = [ `./${admin}/routes.d.ts` ];
    types[`${components}/fields/*`] = [ `./${components}/fields/*.d.ts` ];
    types[`${components}/filters/*`] = [ `./${components}/filters/*.d.ts` ];
    types[`${components}/lists/*`] = [ `./${components}/lists/*.d.ts` ];
    types[`${components}/spans/*`] = [ `./${components}/spans/*.d.ts` ];
    types[`${components}/views/*`] = [ `./${components}/views/*.d.ts` ];
    types[events] = [ `./${events}/index.d.ts` ];
    types[`${events}/*`] = [ `./${events}/*.d.ts` ];
    types[tests] = [ `./${tests}/index.d.ts` ];
    types[`${tests}/*`] = [ `./${tests}/*.d.ts` ];
    types[name] = [ `./${name}/index.d.ts` ];
    types[`${name}/*`] = [ `./${name}/*.d.ts` ];
  });

  Object.values(schema.type || {}).forEach(fieldset => {
    const name = fieldset.name;
    const components = `${name}/components`;
    
    exports[`./${components}/fields/*`] = `./${components}/fields/*.js`;
    exports[`./${components}/lists/*`] = `./${components}/lists/*.js`;
    exports[`./${components}/views/*`] = `./${components}/views/*.js`;
    exports[`./${name}`] = `./${name}/index.js`;
    exports[`./${name}/*`] = `./${name}/*.js`;

    types[`${components}/fields/*`] = [ `./${components}/fields/*.d.ts` ];
    types[`${components}/lists/*`] = [ `./${components}/lists/*.d.ts` ];
    types[`${components}/views/*`] = [ `./${components}/views/*.d.ts` ];
    types[name] = [ `./${name}/index.d.ts` ];
    types[`${name}/*`] = [ `./${name}/*.d.ts` ];
  });

  if (!await fs.exists(pwd)) {
    await fs.mkdir(pwd, { recursive: true });
  }
  await fs.writeFile(
    path.join(pwd, 'package.json'), 
    JSON.stringify({
      name,
      type: 'module',
      module: 'index.js',
      exports: {
        '.': './index.js',
        './*': './*.js',
        './index.js': './index.js',
        ...exports
      },
      "typesVersions": {
        "*": {
          '.': [ './index.d.ts' ],
          '*': [ './*.d.ts' ],
          'index.js': [ './index.d.ts' ],
          ...types
        }
      }
    }, null, 2)
  );
};