//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import Schema from '../Schema.js';
import { 
  loadPackageJsonNest,
  savePackageJsonNest
} from './helpers.js';

/**
 * This is the The params comes form the cli
 */
export default function generate(
  directory: Directory, 
  schema: Schema,
  packageName: string
) {
  const pwd = directory.getPath();

  const packageJson = loadPackageJsonNest(pwd);

  packageJson.set('name', packageName);
  packageJson.set('type', 'module');
  packageJson.set('module', 'index.js');
  packageJson.set('exports', '.', './index.js');
  packageJson.set('exports', './*', './*.js');
  packageJson.set('exports', './index.js', './index.js');
  packageJson.set('typesVersions', '*', '.', [ './index.d.ts' ]);
  packageJson.set('typesVersions', '*', '*', [ './*.d.ts' ]);
  packageJson.set('typesVersions', '*', 'index.js', [ './index.d.ts' ]);

  schema.models.forEach(model => {
    const name = model.name.toPathName();
    const columns = `${name}/columns`;
    const tests = `${name}/tests`;
    
    packageJson.set('exports', `./${columns}`, `./${columns}/index.js`);
    packageJson.set('exports', `./${columns}/*`, `./${columns}/*.js`);
    packageJson.set('exports', `./${tests}`, `./${tests}/index.js`);
    packageJson.set('exports', `./${tests}/*`, `./${tests}/*.js`);
    packageJson.set('exports', `./${name}`, `./${name}/index.js`);
    packageJson.set('exports', `./${name}/*`, `./${name}/*.js`);
    
    packageJson.set('typesVersions', `*`, `./${columns}`, [ `./${columns}/index.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${columns}/*`, [ `./${columns}/*.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${tests}`, [ `./${tests}/index.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${tests}/*`, [ `./${tests}/*.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${name}`, [ `./${name}/index.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${name}/*`, [ `./${name}/*.d.ts` ]);
  });

  schema.fieldsets.forEach(fieldset => {
    const name = fieldset.name.toPathName();
    const columns = `${name}/columns`;
    const tests = `${name}/tests`;
    
    packageJson.set('exports', `./${columns}`, `./${columns}/index.js`);
    packageJson.set('exports', `./${columns}/*`, `./${columns}/*.js`);
    packageJson.set('exports', `./${tests}`, `./${tests}/index.js`);
    packageJson.set('exports', `./${tests}/*`, `./${tests}/*.js`);
    packageJson.set('exports', `./${name}`, `./${name}/index.js`);
    packageJson.set('exports', `./${name}/*`, `./${name}/*.js`);
    
    packageJson.set('typesVersions', `*`, `./${columns}`, [ `./${columns}/index.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${columns}/*`, [ `./${columns}/*.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${tests}`, [ `./${tests}/index.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${tests}/*`, [ `./${tests}/*.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${name}`, [ `./${name}/index.d.ts` ]);
    packageJson.set('typesVersions', `*`, `./${name}/*`, [ `./${name}/*.d.ts` ]);
  });

  savePackageJsonNest(pwd, packageJson);
};