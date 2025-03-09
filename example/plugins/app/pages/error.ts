//node
import fs from 'node:fs';
import path from 'node:path';
//stackpress
import type { Response, ServerRequest } from 'stackpress/server';

export default async function ErrorPage(req: ServerRequest, res: Response) {
  //if there is already a body
  if (res.body) return;
  //extract project and model from client
  const server = req.context;
  //set data for template layer
  res.data.set('server', { 
    mode: server.config.path('server.mode', 'production'),
  });
  
  //general settings
  const response = res.toStatusResponse();
  const { stack = [] } = response;
  //add snippets to stack
  stack.forEach((trace, i) => {
    //skip the first trace
    if (i === 0) return;
    const { file } = trace;
    if (!file.startsWith(path.sep) || !fs.existsSync(file)) {
      return trace;
    }
    const { line, char } = trace;
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
  if (req.url.pathname.endsWith('.js')) {
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
};