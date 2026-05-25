//modules
import type { ClientPluginProps } from 'stackpress-schema/types';
import Schema from 'stackpress-schema/Schema';
import { loadProjectFile } from 'stackpress-schema/transform/helpers';
//client
import generatePackage from './package.js';
import generateTools from './tools.js';

/**
 * Generate MCP tool registries into the client package through the idea flow.
 */
export default async function generate(props: ClientPluginProps) {
  //start by rebuilding the schema helper so the transform can iterate models
  const schema = Schema.make(props.schema);
  const directory = props.directory;

  //generate every per-model tool module plus the root tools registry
  generateTools(directory, schema);

  //patch the root client index so the generated package exports tools
  const source = loadProjectFile(directory, 'index.ts');
  const hasImport = source.getImportDeclaration(
    declaration => declaration.getModuleSpecifierValue() === './tools.js'
  );

  //add the root tools import only once so repeated generation stays stable
  if (!hasImport) {
    source.addImportDeclaration({
      defaultImport: 'tools',
      moduleSpecifier: './tools.js'
    });
  }

  const hasExport = source.getExportDeclaration(
    declaration => declaration.getNamedExports().some(
      specifier => specifier.getName() === 'tools'
    )
  );

  //add the root tools export only once so the client package exposes it
  if (!hasExport) {
    source.addExportDeclaration({
      namedExports: [ 'tools' ]
    });
  }

  //patch package.json so consumers can import the generated tool modules
  generatePackage(directory, schema);
}
