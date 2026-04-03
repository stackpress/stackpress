//node
import fs from 'node:fs';
import path from 'node:path';
//stackpress
import { action } from 'stackpress/server';

export default action(async function ErrorPage(req, res, ctx) {
  //if this is a terminal error, not from HTTP/WHATWG, abort
  if (req.mimetype === 'terminal/arguments') return false;
  //if method is not GET or there is already a body
  if (req.method.toUpperCase() !== 'GET' || res.body) return;
  //set data for template layer
  res.data.set('server', { 
    mode: ctx.config.path('server.mode', 'production'),
  });
  //general settings
  const response = res.toStatusResponse();
  const { stack = [] } = response;
  //add snippets to stack
  stack.forEach((trace, i) => {
    //skip the first trace
    if (i === 0 
      || !trace.file.startsWith(path.sep) 
      || !fs.existsSync(trace.file)
    ) return;
    const { file, line, char } = trace;
    const source = fs.readFileSync(file, 'utf8')
    const lines = source.split('\n');
    const snippet: Record<string, string|undefined> = {
      before: lines[line - 2] || undefined,
      main: lines[line - 1] || undefined,
      after: lines[line] || undefined,
    };
    //if location doesnt match main line
    if (snippet.main && snippet.main.length >= char) {
      snippet.location = ' '.repeat(Math.max(char - 1, 0)) + '^';
    }
    //@ts-ignore - snippet does not exist in type Trace
    stack[i] = { ...trace, snippet };
  });

  if (req.data.has('json')) {
    return;
  } else if (req.url.pathname.endsWith('.js')) {
    delete response.stack;
    res.setBody(
      'application/javascript', 
      `console.log(${JSON.stringify(response)});`, 
      res.code, 
      res.status
    );
    return;
  } else if (req.url.pathname.endsWith('.css')) {
    delete response.stack;
    res.setBody(
      'text/css', 
      `/* ${JSON.stringify(response)} */`, 
      res.code, 
      res.status
    );
    return;
  }
  //most likely an HTML request, render the error page

  //get props from config
  const props = ctx.config.path('view.props', {});
  //get the session
  const session = await ctx.resolve('me', req);
  //render the html
  const html = await ctx.view.render('@/plugins/app/views/error', {
    data: {...props, ...res.data<Record<string, unknown>>() },
    session: session.results,
    request: {
      url: {
        hash: req.url.hash,
        host: req.url.host,
        hostname: req.url.hostname,
        href: req.url.href,
        origin: req.url.origin,
        pathname: req.url.pathname,
        port: req.url.port,
        protocol: req.url.protocol,
        search: req.url.search
      },
      headers: Object.fromEntries(req.headers.entries()),
      session: req.session.data,
      method: req.method,
      mime: req.mimetype,
      data: req.data()
    },
    response: res.toStatusResponse()
  });
  if (typeof html === 'string') {
    res.setHTML(html, res.code, res.status);
  }
});