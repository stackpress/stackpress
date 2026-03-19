//modules
import type { Directory } from 'ts-morph';
import type { FileLoader } from '@stackpress/lib';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress
import type { SchemaConfig } from '@stackpress/idea-parser';
//schema
import Revisions from '../Revisions.js';

/**
 * This is the The params comes form the cli
 */
export default async function generate(
  directory: Directory, 
  config: SchemaConfig, 
  loader?: FileLoader,
  revisionsPath?: string
) {
  //-----------------------------//
  // 1. Add revision

  //if can revision
  if (loader && revisionsPath) {
    //add a new revision
    Revisions.insert(revisionsPath, loader, config);
  }

  //-----------------------------//
  // 2. config.ts
  const source = directory.createSourceFile('config.ts', '', { overwrite: true });

  //import type { SchemaConfig } from '@stackpress/idea-parser';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/idea-parser',
    namedImports: [ 'SchemaConfig' ]
  });
  //export const config = {} as SchemaConfig;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'config',
      type: 'SchemaConfig',
      initializer: JSON.stringify(config, null, 2)
    }]
  });
  //export default config;
  source.addStatements('export default config;');
};