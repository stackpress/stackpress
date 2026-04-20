//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Schema from '../../../schema/Schema.js';
//stackpress/view
import generateBoolean from './boolean.js';
import generateField from './field.js';
import generateRelation from './relation.js';

export default function generate(directory: Directory, schema: Schema) {
  //for each model
  for (const model of schema.models.values()) {
    //and for each column
    for (const column of model.columns.values()) {
      //get the filter field attribute
      const attribute = column.component.filterField;
      //skip if no filter field 
      if (!attribute?.component.defined) continue;
      //this is the component definition token...
      const component = attribute.component.definition!;
      //if filter field component is Relation
      component.name === 'Relation'
        //generate relation filter field
        ? generateRelation(directory, model, column)
        //else if filter field component is Boolean
        : ['Checkbox', 'Switch'].includes(component.name)
        //generate boolean filter field
        ? generateBoolean(directory, model, column)
        //otherwise generate standard field
        : generateField(directory, model, column);
    }
  }
};