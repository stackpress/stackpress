//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Schema from '../../../schema/Schema.js';
//stackpress/view
import generateFormat from './format.js';
import generateFieldset from './fieldset/index.js';
import generateTemplate from './template.js';

export default function generate(directory: Directory, schema: Schema) {
  //for each model
  for (const model of schema.models.values()) {
    //and for each column
    for (const column of model.columns.values()) {
      //get the form field attribute
      const attribute = column.component.listFormat;
      //skip if no form field 
      if (!attribute?.component.defined) continue;
      //this is the component definition token...
      const component = attribute.component.definition!;
      component.name === 'Fieldset'
        ? generateFieldset(directory, model, column)
        : component.name === 'Template'
        ? generateTemplate(directory, model, column)
        : generateFormat(directory, model, column); 
    }
  }
  //for each fieldset
  for (const fieldset of schema.fieldsets.values()) {
    //generate all column formats
    for (const column of fieldset.columns.values()) {
      //get the form field attribute
      const attribute = column.component.listFormat;
      //skip if no form field 
      if (!attribute?.component.defined) continue;
      //this is the component definition token...
      const component = attribute.component.definition!;
      component.name === 'Fieldset'
        ? generateFieldset(directory, fieldset, column)
        : component.name === 'Template'
        ? generateTemplate(directory, fieldset, column)
        : generateFormat(directory, fieldset, column);
    }
  }
};