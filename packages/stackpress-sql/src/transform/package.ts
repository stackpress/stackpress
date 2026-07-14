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

  packageJson.set('exports', './tests', './tests.js');
  packageJson.set('typesVersions', '*', 'tests', [ './tests.d.ts' ]);

  schema.models.forEach(model => {
    const name = model.name.toPathName();
    const events = `${name}/events`;
    const tests = `${name}/tests`;

    packageJson.set('exports', `./${events}`, `./${events}/index.js`);
    packageJson.set('exports', `./${events}/*`, `./${events}/*.js`);
    packageJson.set('exports', `./${tests}`, `./${tests}.js`);

    packageJson.set('typesVersions', `*`, `./${events}`, [ `./${events}/index.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${events}/*`, [ `./${events}/*.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${tests}`, [ `./${tests}.d.ts` ]);
  });

  savePackageJsonNest(pwd, packageJson);
};
