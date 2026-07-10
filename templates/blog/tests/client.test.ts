import * as BlogTestSchema from './blog.test';

export default function runClientTest(engine?: any) {
  return BlogTestSchema.default(engine);
}
