//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
//src
import listen, {
  install,
  migrate,
  purge,
  push,
  query,
  populate,
  uninstall,
  upgrade
} from '../src/events/index.js';

describe('sql/events', () => {
  it('should export every terminal event handler', () => {
    const handlers = [
      install,
      migrate,
      purge,
      push,
      query,
      populate,
      uninstall,
      upgrade
    ];

    for (const handler of handlers) {
      expect(handler).to.be.a('function');
    }
  });

  it('should register terminal event handlers on a live server', () => {
    const server = listen();
    const expected = [
      'install',
      'migrate',
      'purge',
      'push',
      'query',
      'populate',
      'uninstall',
      'upgrade'
    ];

    for (const event of expected) {
      expect(server.action.tasks(event).size).to.be.greaterThan(0);
    }
  });
});
