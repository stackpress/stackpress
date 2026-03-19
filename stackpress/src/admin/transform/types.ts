//stackpress/schema
import type Column from '../../schema/Column.js';
import type Fieldset from '../../schema/Fieldset.js';
import type Model from '../../schema/Model.js';

export type Relationship = {
  foreign: {
      model: Model,
      column: Column,
      key: Column,
      type: number
  },
  local: {
      model: Fieldset,
      column: Column,
      key: Column,
      type: number
  };
};