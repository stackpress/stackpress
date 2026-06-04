# Stackpress AI

MCP server package for the Stackpress framework.

## Configuration

```ts
mcp: {
  name: 'Blog MCP',
  tools: [
    {
      name: 'article_search',
      type: 'app',
      method: 'GET',
      event: 'article-search',
      scopes: ['articles.read'],
      input: {
        type: 'object',
        properties: {
          q: { type: 'string' }
        }
      }
    },
    {
      mode: 'plugin',
      type: 'user',
      event: 'comment-tool'
    }
  ]
}
```

## Authorization

- `public` tools require no bearer token
- `app` tools authenticate through `application-detail`
- `user` tools authenticate through `session-detail`
- non-`GET` `app` and `user` tools require the token secret to match the stored application or session secret

## Live Transport Auth

- Streamable HTTP resolves bearer auth per initialize request in `stateful` mode and per request in `stateless` mode
- SSE resolves bearer auth from the initial event-stream connection and keeps that auth bound to the session
- authenticated transports only register the tools visible to that caller, so live `tools/list` and `tools/call` stay in sync
- user-scoped tool calls receive `profileId`, `applicationId`, and `sessionId` in the downstream event payload

## Current Status

- Tool registry assembly, plugin resolution, and transport shells are implemented
- JSON Schema inputs are validated through `zod.fromJSONSchema()`
- `tools/list` auth filtering helpers are implemented
- Per-request authenticated filtering is wired into the live HTTP and SSE MCP transports
