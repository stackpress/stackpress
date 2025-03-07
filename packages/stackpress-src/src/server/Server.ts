//stackpress
import type { UnknownNest } from '@stackpress/lib';
import IngestServer from '@stackpress/ingest/dist/Server';
export default class Server<
  //configuration map
  C extends UnknownNest = UnknownNest, 
  //request resource
  R = unknown, 
  //response resource
  S = unknown
> extends IngestServer<C, R, S> {
  constructor() {
    super();
  }
}