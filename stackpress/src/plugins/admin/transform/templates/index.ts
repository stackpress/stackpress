//modules
import type { Directory } from 'ts-morph';
//stackpress
import type { FileSystem } from '@stackpress/lib/types';
//schema
import type Registry from '../../../../schema/Registry';

//generators
import generateCreate from './create';
import generateDetail from './detail';
import generateRemove from './remove';
import generateRestore from './restore';
import generateSearch from './search';
import generateUpdate from './update';

export default function generate(
  directory: Directory, 
  registry: Registry,
  fs: FileSystem
) {
  generateCreate(directory, registry, fs);
  generateDetail(directory, registry, fs);
  generateRemove(directory, registry, fs);
  generateRestore(directory, registry, fs);
  generateSearch(directory, registry, fs);
  generateUpdate(directory, registry, fs);
};