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

## Current Status

- Tool registry assembly, plugin resolution, and transport shells are implemented
- JSON Schema inputs are validated through `zod.fromJSONSchema()`
- `tools/list` auth filtering helpers are implemented
- Per-request authenticated filtering inside the live MCP transports is not fully wired yet
