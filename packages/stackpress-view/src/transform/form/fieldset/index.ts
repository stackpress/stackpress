//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Column from 'stackpress-schema/Column';
import type Fieldset from 'stackpress-schema/Fieldset';
//stackpress-view
import generateSingle from './single.js';
import generateMultiple from './multiple.js';

export default function generate(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  column.type.multiple
    ? generateMultiple(directory, fieldset, column)
    : generateSingle(directory, fieldset, column)
};