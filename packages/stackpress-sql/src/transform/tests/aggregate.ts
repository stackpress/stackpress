//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { generateTestAggregate } from 'stackpress-schema/transform/tests';

export default function generate(directory: Directory, model: Model) {
  generateTestAggregate(directory, model, [
    {
      moduleSpecifier: model.name.toPathName('./tests/%sStore.test.js'),
      name: model.name.toClassName('%sStoreTests')
    },
    {
      moduleSpecifier: model.name.toPathName('./tests/%sActions.test.js'),
      name: model.name.toClassName('%sActionTests')
    },
    {
      moduleSpecifier: './tests/events.test.js',
      name: model.name.toClassName('%sEventsTests')
    }
  ]);
};
