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
    const components = `${name}/components`;

    packageJson.set('exports', `./${components}/fields/*`, `./${components}/fields/*.js`);
    packageJson.set('exports', `./${components}/filters/*`, `./${components}/filters/*.js`);
    packageJson.set('exports', `./${components}/lists/*`, `./${components}/lists/*.js`);
    packageJson.set('exports', `./${components}/spans/*`, `./${components}/spans/*.js`);
    packageJson.set('exports', `./${components}/views/*`, `./${components}/views/*.js`);

    packageJson.set('typesVersions', `*`, `./${components}/fields/*`, [ `./${components}/fields/*.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${components}/filters/*`, [ `./${components}/filters/*.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${components}/lists/*`, [ `./${components}/lists/*.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${components}/spans/*`, [ `./${components}/spans/*.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${components}/views/*`, [ `./${components}/views/*.d.ts` ]);
  });

  savePackageJsonNest(pwd, packageJson);
};