//stackpress-schema
import type Column from 'stackpress-schema/Column';
import type Fieldset from 'stackpress-schema/Fieldset';
import type Model from 'stackpress-schema/Model';

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