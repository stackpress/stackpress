//modules
import type { Directory } from 'ts-morph';
//stackpress
import type Registry from '@/schema/Registry';

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, registry: Registry) {
  // get the source file
  const source = directory.createSourceFile('enums.ts', '', { overwrite: true });
  //loop through enums
  for (const [ name, options ] of registry.enum.entries()) {
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