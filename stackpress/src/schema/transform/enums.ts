//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Schema from '../../schema/Schema.js';
import { loadProjectFile } from '../../schema/transform/helpers.js';

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, schema: Schema) {
  // get the source file
  const source = loadProjectFile(directory, 'enums.ts');
  //loop through enums
  for (const [ name, options ] of schema.enums.entries()) {
    source.addEnum({
      name: name,
      isExported: true,
      // { name: "ADMIN", value: "Admin" }
      members: Object.keys(options).map(key => ({ 
        name: key, 
        value: options[key] as string
      }))
    }); 
  }
};