//modules
import { describe, it } from 'mocha';
import { expect } from 'chai';
//client
import stdio from '../src/scripts/stdio.js';
import { createCtxStub } from './helpers.js';

describe('ai/stdio', () => {
  it('should throw when the MCP registry is empty', async () => {
    try {
      await stdio(createCtxStub({
        config: { 'mcp.tools': [] }
      }));
      expect.fail('Expected stdio to throw');
    } catch (error) {
      expect((error as Error).message).to.equal('Resolved MCP tool registry is empty.');
    }
  });
});
