import { describe, it } from 'mocha';
import { expect } from 'chai';

import dev from '../src/events/dev.js';

describe('desktop/events/dev', () => {
  it('should expose a desktop:dev action handler', () => {
    expect(dev).to.be.a('function');
  });
});
