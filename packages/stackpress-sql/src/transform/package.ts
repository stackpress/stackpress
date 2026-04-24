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
    const events = `${name}/events`;

    packageJson.set('exports', `./${events}`, `./${events}/index.js`);
    packageJson.set('exports', `./${events}/*`, `./${events}/*.js`);

    packageJson.set('typesVersions', `*`, `./${events}`, [ `./${events}/index.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${events}/*`, [ `./${events}/*.d.ts` ]);
  });

  savePackageJsonNest(pwd, packageJson);
};