//stackpress-schema
import type { ClientPluginProps } from 'stackpress-schema/types';
import Schema from 'stackpress-schema/Schema';
//stackpress-mcp
import generateGetModel from './tools/get_model.js';
import generateListModels from './tools/list_models.js';

export default async function generate(props: ClientPluginProps) {
  //------------------------------------------------------------------//
  // 1. Config

  const schema = Schema.make(props.schema);
  const directory = props.directory;
  
  //------------------------------------------------------------------//
  // 2. Generators

  generateGetModel(directory, schema);
  generateListModels(directory, schema);
};