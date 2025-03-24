import type { UnknownNest } from '@stackpress/lib/types';
import type { 
  NodeRequest, 
  NodeOptResponse 
} from '@stackpress/ingest/types';
import type IngestRequest from '@stackpress/ingest/Request';
import type IngestResponse from '@stackpress/ingest/Response';
import type IngestServer from '@stackpress/ingest/Server';
import type IngestRouter from '@stackpress/ingest/Router';
import type IngestRoute from '@stackpress/ingest/Route';

export type * from '@stackpress/ingest/types';

export type Response = IngestResponse<NodeOptResponse>;
export type Request = IngestRequest<NodeRequest>;
export type Server<
  C extends UnknownNest = UnknownNest
> = IngestServer<C, NodeRequest, NodeOptResponse>;
export type Router = IngestRouter<NodeRequest, NodeOptResponse>;
export type Route<
  C extends UnknownNest = UnknownNest
> = IngestRoute<C, NodeRequest, NodeOptResponse>;

import {
  Adapter,
  gateway,
  handler,
  server,
  router,
  reqToURL,
  reqQueryToObject,
  readableToReadableStream
} from '@stackpress/ingest/whatwg';

export {
  Adapter,
  gateway,
  handler,
  server,
  router,
  reqToURL,
  reqQueryToObject,
  readableToReadableStream
};