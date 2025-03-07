//stackpress
import type { PluginWithProject } from '@stackpress/incept/dist/types';
import Registry from '@stackpress/incept/dist/schema/Registry';
//local
import enumGenerator from './enums';
import typeGenerator from './types';


/**
 * Client File Structure
 * - profile/
 * | - index.ts
 * | - types.ts
 * - address/
 * | - index.ts
 * | - types.ts
 * - enums.ts
 * - index.ts
 * - types.ts
 */

/**
 * This is the The params comes form the cli
 */
export default function generate(props: PluginWithProject) {
  //-----------------------------//
  // 1. Config
  //extract props
  const { schema, project } = props;
  const registry = new Registry(schema);

  //-----------------------------//
  // 2. Generators
  //generate enums
  enumGenerator(project, registry);
  //generate typescript
  typeGenerator(project, registry);

  //-----------------------------//
  // 3. profile/index.ts

  for (const model of registry.model.values()) {
    const filepath = `${model.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = project.getSourceFile(filepath) 
      || project.createSourceFile(filepath, '', { overwrite: true });
    //export type * from './module/[name]/types';
    source.addExportDeclaration({ moduleSpecifier: `./types` });
  }

  //-----------------------------//
  // 4. address/index.ts

  for (const fieldset of registry.fieldset.values()) {
    const filepath = `${fieldset.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = project.getSourceFile(filepath) 
      || project.createSourceFile(filepath, '', { overwrite: true });
    //export type * from './module/[name]/types';
    source.addExportDeclaration({ moduleSpecifier: `./types` });
  }

  //-----------------------------//
  // 5. index.ts
  //load index.ts if it exists, if not create it
  const source = project.getSourceFile('index.ts') 
    || project.createSourceFile('index.ts', '', { overwrite: true });
  //export type * from './types';
  source.addExportDeclaration({ 
    isTypeOnly: true,
    moduleSpecifier: './types'
  });
};