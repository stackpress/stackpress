//root
import type { IdeaPluginWithProject } from '../../types/index.js';
//schema
import Registry from '../../schema/Registry.js';
//types
import enumGenerator from './enums.js';
import typeGenerator from './types.js';

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
export default function generate(props: IdeaPluginWithProject) {
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
    //export type * from './module/[name]/types.js';
    source.addExportDeclaration({ moduleSpecifier: './types.js' });
  }

  //-----------------------------//
  // 4. address/index.ts

  for (const fieldset of registry.fieldset.values()) {
    const filepath = `${fieldset.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = project.getSourceFile(filepath) 
      || project.createSourceFile(filepath, '', { overwrite: true });
    //export type * from './module/[name]/types.js';
    source.addExportDeclaration({ moduleSpecifier: './types.js' });
  }

  //-----------------------------//
  // 5. index.ts
  //load index.ts if it exists, if not create it
  const source = project.getSourceFile('index.ts') 
    || project.createSourceFile('index.ts', '', { overwrite: true });
  //export type * from './types.js';
  source.addExportDeclaration({ 
    isTypeOnly: true,
    moduleSpecifier: './types.js'
  });
};