//tests
import { expect } from 'chai';
import { describe, it } from 'mocha';
//src
import plugin from '../src/plugin.js';

describe('server/plugin', () => {
  it('should register a listen handler', () => {
    const handlers = new Map<string, Function>();
    const server = {
      on(event: string, handler: Function) {
        handlers.set(event, handler);
      }
    };

    plugin(server as any);

    expect(handlers.get('listen')).to.be.a('function');
  });

  it('should register terminal events when the listen handler runs', async () => {
    const handlers = new Map<string, Function>();
    const events: Array<{ event: string, handler: Function }> = [];
    const server = {
      on(event: string, handler: Function) {
        handlers.set(event, handler);
      }
    };
    const ctx = {
      on(event: string, handler: Function) {
        events.push({ event, handler });
      }
    };

    plugin(server as any);
    const listen = handlers.get('listen');
    await listen?.({ ctx });

    expect(events.map(({ event }) => event)).to.deep.equal([
      'develop',
      'emit',
      'serve'
    ]);
    for (const entry of events) {
      expect(entry.handler).to.be.a('function');
    }
  });
});
