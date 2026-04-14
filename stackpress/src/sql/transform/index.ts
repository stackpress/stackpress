//modules
import type { Directory } from 'ts-morph';
//stackpress
import type { IdeaProjectPluginProps } from '../../types.js';
//stackpress/schema
import type Model from '../../schema/Model.js';
import Schema from '../../schema/Schema.js';
//stackpress/sql
import generateEvents from './events/index.js';
import generateStore from './store/index.js';
import generateActions from './actions/index.js';
import generateScripts from './scripts.js';
import generateTypes from './types.js';
import generateActionsTests from './tests/actions.js';
import generateEventsTests from './tests/events.js';
import generateStoreTests from './tests/store.js';

export default async function generate(props: IdeaProjectPluginProps) {
  //------------------------------------------------------------------//
  // 1. Config

  const schema = Schema.make(props.schema);
  const directory = props.directory;

  //------------------------------------------------------------------//
  // 2. Generators

  for (const model of schema.models.values()) {
    generateModel(directory, model);
  }

  //------------------------------------------------------------------//
  // 3. scripts.ts

  generateScripts(directory, schema);
};

export function generateModel(directory: Directory, model: Model) {
  //------------------------------------------------------------------//
  // 1. Profile/ProfileStore.ts

  generateStore(directory, model);

  //------------------------------------------------------------------//
  // 2. Profile/ProfileActions.ts

  generateActions(directory, model);

  //------------------------------------------------------------------//
  // 3. Profile/events/*.ts

  generateEvents(directory, model);

  //------------------------------------------------------------------//
  // 4. Profile/ProfileTypes.ts

  generateTypes(directory, model);

  //------------------------------------------------------------------//
  // 5. Profile/tests/ProfileStore.test.ts

  generateStoreTests(directory, model);

  //------------------------------------------------------------------//
  // 6. Profile/tests/ProfileActions.test.ts

  generateActionsTests(directory, model);

  //------------------------------------------------------------------//
  // 7. Profile/tests/events.test.ts

  generateEventsTests(directory, model);
}