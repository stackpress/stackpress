//stackpress
import type { Method, ResponseStatus } from '@stackpress/lib/dist/types';
import type { 
  EntryTask,
  ServerRequest
} from '@stackpress/ingest/dist/types';
import type Server from '@stackpress/ingest/dist/Server';
import Response from '@stackpress/ingest/dist/Response';
import { getStatus } from '@stackpress/lib/dist/Status';
//local
import type { Renderer } from './types';

export default class Router {
  //A route map to task queues
  public readonly templates = new Map<string, Set<EntryTask>>();
  //server
  protected _server: Server;
  //render
  protected _render: Renderer;
  
  /**
   * Set the server and render function
   */
  constructor(server: Server, render: Renderer) {
    this._server = server;
    this._render = render;
  }

  /**
   * Route for any method
   */
  public all(path: string, action: string, priority?: number) {
    return this.route('[A-Z]+', path, action, priority);
  }

  /**
   * Route for CONNECT method
   */
  public connect(path: string, action: string, priority?: number) {
    return this.route('CONNECT', path, action, priority);
  }

  /**
   * Route for DELETE method
   */
  public delete(path: string, action: string, priority?: number) {
    return this.route('DELETE', path, action, priority);
  }

  /**
   * Route for GET method
   */
  public get(path: string, action: string, priority?: number) {
    return this.route('GET', path, action, priority);
  }

  /**
   * Route for HEAD method
   */
  public head(path: string, action: string, priority?: number) {
    return this.route('HEAD', path, action, priority);
  }

  /**
   * Route for OPTIONS method
   */
  public options(path: string, action: string, priority?: number) {
    return this.route('OPTIONS', path, action, priority);
  }

  /**
   * Route for PATCH method
   */
  public patch(path: string, action: string, priority?: number) {
    return this.route('PATCH', path, action, priority);
  }

  /**
   * Route for POST method
   */
  public post(path: string, action: string, priority?: number) {
    return this.route('POST', path, action, priority);
  }

  /**
   * Route for PUT method
   */
  public put(path: string, action: string, priority?: number) {
    return this.route('PUT', path, action, priority);
  }

  /**
   * Route for TRACE method
   */
  public trace(path: string, action: string, priority?: number) {
    return this.route('TRACE', path, action, priority);
  }

  /**
   * Makes an entry action
   */
  public make(action: string) {
    const router = this;
    return async function TemplateFile(req: ServerRequest, res: Response) {
      //set the final status
      const status = getStatus(res.code || 200) as ResponseStatus;
      res.setStatus(status.code, status.status);
      //get the noteplate flag
      const notemplate = req.context.config.path(
        'template.config.notemplate', 
        'json'
      );
      //const render, if redirecting
      if (res.headers.has('Location') 
        //or if json
        || req.data.has(notemplate)
        //or body is a string already
        || typeof res.body === 'string'
      ) return;
      const server = req.context;
      const session = await server.call('me', req);
      const html = await router._render(action, {
        config: server.config(),
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
      res.setHTML(html, status.code, status.status);
    }
  }

  /**
   * Adds a callback to the given event listener
   */
  public on(
    event: string|RegExp, 
    entry: string,
    priority = 0
  ) {
    //create a key for the entry
    const key = event.toString();
    //if the listener group does not exist, create it
    if (!this.templates.has(key)) {
      this.templates.set(key, new Set());
    }
    //add the listener to the group
    this.templates.get(key)?.add({ entry, priority });
    //now listen for the event
    this._server.on(event, this.make(entry), priority);
    return this;
  }

  /**
   * Returns a route
   */
  public route(
    method: Method|'[A-Z]+', 
    path: string, 
    entry: string,
    priority?: number
  ) {
    //convert path to a regex pattern
    const pattern = path
      //replace the :variable-_name01
      .replace(/(\:[a-zA-Z0-9\-_]+)/g, '*')
      //replace the stars
      //* -> ([^/]+)
      .replaceAll('*', '([^/]+)')
      //** -> ([^/]+)([^/]+) -> (.*)
      .replaceAll('([^/]+)([^/]+)', '(.*)');
    //now form the event pattern
    const event = new RegExp(`^${method}\\s${pattern}/*$`, 'ig');
    this._server.routes.set(event.toString(), {
      method: method === '[A-Z]+' ? 'ALL' : method,
      path: path
    });
    //add to tasks
    return this.on(event, entry, priority);
  }
}