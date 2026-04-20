//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Schema from '../../../schema/Schema.js';
//stackpress/view
import generateRelation from './relation.js';
import generateFieldset from './fieldset/index.js';
import generateBoolean from './boolean.js';
import generateField from './field.js';

export default function generate(directory: Directory, schema: Schema) {
  //for each model
  for (const model of schema.models.values()) {
    //and for each column
    for (const column of model.columns.values()) {
      //get the form field attribute
      const attribute = column.component.formField;
      //skip if no form field 
      if (!attribute?.component.defined) continue;
      //this is the component definition token...
      const component = attribute.component.definition!;
      //if form field component is Relation
      component.name === 'Relation'
        //generate relation field
        ? generateRelation(directory, model, column)
        //if component is a fieldset
        : component.name === 'Fieldset'
        //generate fieldset field
        ? generateFieldset(directory, model, column)
        //if component is boolean
        : ['Checkbox', 'Switch'].includes(component.name)
        //generate boolean field
        ? generateBoolean(directory, model, column)
        //generate normal field
        : generateField(directory, model, column);
    }
  }
  //for each fieldset
  for (const fieldset of schema.fieldsets.values()) {
    //and for each column
    for (const column of fieldset.columns.values()) {
      //get the form field attribute
      const attribute = column.component.formField;
      //skip if no form field 
      if (!attribute?.component.defined) continue;
      //this is the component definition token...
      const component = attribute.component.definition!;
      //if form field component is a fieldset
      component.name === 'Fieldset'
        //generate fieldset field
        ? generateFieldset(directory, fieldset, column)
        //if component is boolean
        : [ 'Checkbox', 'Switch' ].includes(component.name)
        //generate boolean field
        ? generateBoolean(directory, fieldset, column)
        //generate normal field
        : generateField(directory, fieldset, column);
    }
  }
};