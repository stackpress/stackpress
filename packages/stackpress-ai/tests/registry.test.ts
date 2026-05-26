import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
  buildTools,
  listToolsForAuth,
  normalizeTool,
  parseAuthorization,
  requiresSecret,
  resolveListAuth,
  toMcpText,
  validateInput,
  withToolData
} from '../src/helpers.js';
import type { ToolResolverServer } from '../src/types.js';
import { createCtxStub } from './helpers.js';

describe('ai/registry', () => {
  it('should resolve plugin-mode tools and let config override metadata', async () => {
    const ctx = createCtxStub({
      resolves: {
        'article-tool': {
          results: {
            name: 'article_search',
            title: 'Article Search',
            description: 'Default description',
            method: 'GET',
            type: 'app',
            event: 'article-search',
            scopes: [ 'articles.read' ]
          }
        }
      }
    });

    const tools = await buildTools(ctx as unknown as ToolResolverServer, [{
      mode: 'plugin',
      event: 'article-tool',
      description: 'Search articles'
    }]);

    expect(tools).to.have.length(1);
    expect(tools[0].description).to.equal('Search articles');
    expect(tools[0].event).to.equal('article-search');
    expect(tools[0].name).to.equal('article_search');
  });

  it('should ignore invalid plugin results', async () => {
    const ctx = createCtxStub({
      resolves: {
        'invalid-tool': {
          results: [ 'bad' ]
        }
      }
    });

    const tools = await buildTools(ctx as unknown as ToolResolverServer, [{
      mode: 'plugin',
      event: 'invalid-tool'
    }]);

    expect(tools).to.deep.equal([]);
  });

  it('should default missing title from the event name', async () => {
    const tool = normalizeTool({
      event: 'article-search',
      name: 'article_search',
      method: 'GET'
    });

    expect(tool?.title).to.equal('Article Search');
  });

  it('should prefer application auth over session auth in tools/list', async () => {
    const ctx = createCtxStub({
      application: {
        id: 'app_1',
        name: 'App',
        secret: 'secret',
        scopes: [ 'articles.read' ],
        active: true,
        expires: new Date(),
        created: new Date(),
        updated: new Date()
      },
      session: {
        id: 'app_1',
        applicationId: 'app_1',
        profileId: 'profile_1',
        secret: 'secret',
        scopes: [ 'comments.read' ],
        active: true,
        expires: new Date(),
        created: new Date(),
        updated: new Date()
      }
    });
    const auth = await resolveListAuth(
      ctx as unknown as ToolResolverServer,
      'Bearer app_1'
    );

    expect(auth.kind).to.equal('app');
  });

  it('should filter app tools by scope and keep public tools', () => {
    const tools = [
      normalizeTool({
        name: 'public_ping',
        title: 'Public Ping',
        event: 'public-ping',
        type: 'public',
        method: 'GET'
      })!,
      normalizeTool({
        name: 'article_search',
        title: 'Article Search',
        event: 'article-search',
        type: 'app',
        method: 'GET',
        scopes: [ 'articles.read' ]
      })!,
      normalizeTool({
        name: 'comment_search',
        title: 'Comment Search',
        event: 'comment-search',
        type: 'user',
        method: 'GET',
        scopes: [ 'comments.read' ]
      })!
    ];

    const filtered = listToolsForAuth(tools, {
      kind: 'app',
      token: { token: 'app_1', id: 'app_1', secret: '' },
      application: {
        id: 'app_1',
        name: 'App',
        secret: 'secret',
        scopes: [ 'articles.read' ],
        active: true,
        expires: new Date(),
        created: new Date(),
        updated: new Date()
      }
    });

    expect(filtered.map(tool => tool.name)).to.deep.equal([
      'public_ping',
      'article_search'
    ]);
  });

  it('should parse bearer tokens with optional secret', () => {
    expect(parseAuthorization('Bearer app_1:secret')).to.deep.equal({
      token: 'app_1:secret',
      id: 'app_1',
      secret: 'secret'
    });
    expect(parseAuthorization('Bearer session_1')).to.deep.equal({
      token: 'session_1',
      id: 'session_1',
      secret: ''
    });
  });

  it('should inject session context for user tools', () => {
    const data = withToolData(
      normalizeTool({
        name: 'comment_create',
        title: 'Comment Create',
        event: 'comment-create',
        type: 'user',
        method: 'POST'
      })!,
      { body: 'hi' },
      {
        kind: 'user',
        token: { token: 'session_1:secret', id: 'session_1', secret: 'secret' },
        session: {
          id: 'session_1',
          applicationId: 'app_1',
          profileId: 'profile_1',
          secret: 'secret',
          scopes: [ 'comments.write' ],
          active: true,
          expires: new Date(),
          created: new Date(),
          updated: new Date()
        }
      }
    );

    expect(data).to.include({
      body: 'hi',
      profileId: 'profile_1',
      applicationId: 'app_1',
      sessionId: 'session_1'
    });
  });

  it('should classify non-get methods as secret-required', () => {
    expect(requiresSecret('GET')).to.equal(false);
    expect(requiresSecret('POST')).to.equal(true);
    expect(requiresSecret('delete')).to.equal(true);
  });

  it('should validate input against a JSON schema when provided', () => {
    const tool = normalizeTool({
      name: 'article_search',
      title: 'Article Search',
      event: 'article-search',
      method: 'GET',
      input: {
        type: 'object',
        properties: {
          query: { type: 'string' }
        },
        required: [ 'query' ]
      }
    })!;

    expect(validateInput(tool, { query: 'elden ring' })).to.deep.equal({
      query: 'elden ring'
    });
  });

  it('should render artifact results as readable MCP text', () => {
    const result = toMcpText({
      type: 'artifact',
      title: 'Article Search',
      url: 'https://example.com/admin/article/search?artifact=1',
      route: '/admin/article/search',
      operation: 'search',
      model: 'article',
      disposition: 'body',
      description: 'Admin article search page rendered without header or navigation.'
    });

    expect(result).to.deep.equal({
      content: [{
        type: 'text',
        text: [
          'Artifact: Article Search',
          'URL: https://example.com/admin/article/search?artifact=1',
          'Route: /admin/article/search',
          'Operation: search',
          'Model: article',
          'Disposition: body',
          'Description: Admin article search page rendered without header or navigation.'
        ].join('\n')
      }]
    });
  });

  it('should keep non-artifact object results as JSON text', () => {
    const result = toMcpText({
      ok: true,
      count: 2
    });

    expect(result).to.deep.equal({
      content: [{
        type: 'text',
        text: JSON.stringify({ ok: true, count: 2 }, null, 2)
      }]
    });
  });
});
