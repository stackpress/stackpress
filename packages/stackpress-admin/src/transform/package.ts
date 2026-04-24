//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import Schema from 'stackpress-schema/Schema';
import { 
  loadPackageJsonNest,
  savePackageJsonNest
} from 'stackpress-schema/transform/helpers';

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, schema: Schema) {
  const pwd = directory.getPath();

  const packageJson = loadPackageJsonNest(pwd);

  schema.models.forEach(model => {
    const name = model.name.toPathName();
    const admin = `${name}/admin`;

    packageJson.set('exports', `./${admin}/pages/*`, `./${admin}/pages/*.js`);
    packageJson.set('exports', `./${admin}/views/*`, `./${admin}/views/*.js`);
    packageJson.set('exports', `./${admin}/routes`, `./${admin}/routes.js`);

    packageJson.set('typesVersions', `*`, `./${admin}/pages/*`, [ `./${admin}/pages/*.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${admin}/views/*`, [ `./${admin}/views/*.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${admin}/routes`, [ `./${admin}/routes.d.ts` ]);
  });

  savePackageJsonNest(pwd, packageJson);
};