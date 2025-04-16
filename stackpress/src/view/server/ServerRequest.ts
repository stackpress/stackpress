//stackpress
import type { 
  Method, 
  UnknownNest,
  CallableMap, 
  CallableNest
} from '@stackpress/lib/types';
import map from '@stackpress/lib/map';
import { nest } from '@stackpress/lib/Nest';
//views
import type { ServerRequestProps } from '../types.js';

/**
 * Client version of request. Readonly.
 */
export default class Request<I extends UnknownNest = UnknownNest> {
  //data controller
  public readonly data: CallableNest;
  //head controller
  public readonly headers: CallableMap<string, string|string[]>;
  //session controller
  public readonly session: CallableMap<string, string|string[]>;
  //url controller
  public readonly url = new URL('http://unknownhost/');
  //request method
  public readonly method: Method;

  /**
   * Sets request defaults
   */
  public constructor(config: ServerRequestProps<I>) {
    this.data = nest(config.data);
    this.url = new URL(config.url.href);
    this.headers = map(Object.entries(config.headers));
    this.session = map(Object.entries(config.session));
    this.method = config.method || 'GET';
  }
}