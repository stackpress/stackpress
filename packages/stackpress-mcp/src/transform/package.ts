//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Schema from 'stackpress-schema/Schema';
import {
  loadPackageJsonNest,
  savePackageJsonNest
} from 'stackpress-schema/transform/helpers';

export default function generate(directory: Directory, schema: Schema) {
  const pwd = directory.getPath();
  const packageJson = loadPackageJsonNest(pwd);

  packageJson.set('exports', './mcp', './mcp.js');
  packageJson.set('typesVersions', '*', 'mcp', [ './mcp.d.ts' ]);

  schema.models.forEach(model => {
    const name = model.name.toPathName();
    const tools = `${name}/tools`;
    packageJson.set('exports', `./${tools}`, `./${tools}/index.js`);
    packageJson.set('exports', `./${tools}/*`, `./${tools}/*.js`);
    packageJson.set('typesVersions', '*', `${tools}`, [ `./${tools}/index.d.ts` ]);
    packageJson.set('typesVersions', '*', `${tools}/*`, [ `./${tools}/*.d.ts` ]);
  });

  savePackageJsonNest(pwd, packageJson);
}

