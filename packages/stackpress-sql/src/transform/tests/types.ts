//stackpress-schema
import type Model from 'stackpress-schema/Model';

export type TestModule = {
  moduleSpecifier: string,
  name: string
};

export type TestAggregateContext = {
  model: Model,
  modules: TestModule[]
};
