//node
import path from 'node:path';
//modules
import type { FileSystem } from '@stackpress/lib/types';
import type { Directory } from 'ts-morph';
//stackpress/schema
import Schema from '../../schema/Schema.js';

/**
 * This is the The params comes form the cli
 */
export default async function generate(
  directory: Directory, 
  schema: Schema, 
  fs: FileSystem,
  packageName: string
) {
  const pwd = directory.getPath();
  const exports: Record<string, string> = {};
  const types: Record<string, string[]> = {};

  schema.models.forEach(model => {
    const name = model.name.toPathName();
    const admin = `${name}/admin`;
    const components = `${name}/components`;
    const columns = `${name}/columns`;
    const events = `${name}/events`;
    const tests = `${name}/tests`;

    exports[`./${admin}/pages/*`] = `./${admin}/pages/*.js`;
    exports[`./${admin}/views/*`] = `./${admin}/views/*.js`;
    exports[`./${admin}/routes`] = `./${admin}/routes.js`;
    exports[`./${components}/fields/*`] = `./${components}/fields/*.js`;
    exports[`./${components}/filters/*`] = `./${components}/filters/*.js`;
    exports[`./${components}/lists/*`] = `./${components}/lists/*.js`;
    exports[`./${components}/spans/*`] = `./${components}/spans/*.js`;
    exports[`./${components}/views/*`] = `./${components}/views/*.js`;
    exports[`./${columns}`] = `./${columns}/index.js`;
    exports[`./${columns}/*`] = `./${columns}/*.js`;
    exports[`./${events}`] = `./${events}/index.js`;
    exports[`./${events}/*`] = `./${events}/*.js`;
    exports[`./${tests}`] = `./${tests}/index.js`;
    exports[`./${tests}/*`] = `./${tests}/*.js`;
    exports[`./${name}`] = `./${name}/index.js`;
    exports[`./${name}/*`] = `./${name}/*.js`;

    types[`${admin}/pages/*`] = [ `./${admin}/pages/*.d.ts` ];
    types[`${admin}/views/*`] = [ `./${admin}/views/*.d.ts` ];
    types[`${admin}/routes`] = [ `./${admin}/routes.d.ts` ];
    types[`${components}/fields/*`] = [ `./${components}/fields/*.d.ts` ];
    types[`${components}/filters/*`] = [ `./${components}/filters/*.d.ts` ];
    types[`${components}/lists/*`] = [ `./${components}/lists/*.d.ts` ];
    types[`${components}/spans/*`] = [ `./${components}/spans/*.d.ts` ];
    types[`${components}/views/*`] = [ `./${components}/views/*.d.ts` ];
    types[columns] = [ `./${columns}/index.d.ts` ];
    types[`${columns}/*`] = [ `./${columns}/*.d.ts` ];
    types[events] = [ `./${events}/index.d.ts` ];
    types[`${events}/*`] = [ `./${events}/*.d.ts` ];
    types[tests] = [ `./${tests}/index.d.ts` ];
    types[`${tests}/*`] = [ `./${tests}/*.d.ts` ];
    types[name] = [ `./${name}/index.d.ts` ];
    types[`${name}/*`] = [ `./${name}/*.d.ts` ];
  });

  schema.fieldsets.forEach(fieldset => {
    const name = fieldset.name.toPathName();
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
      name: packageName,
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