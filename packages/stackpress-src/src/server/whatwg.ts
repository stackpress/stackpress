import type { UnknownNest } from '@stackpress/lib/dist/types';
import type { 
  NodeRequest, 
  NodeOptResponse 
} from '@stackpress/ingest/dist/types';
import type IngestRequest from '@stackpress/ingest/dist/Request';
import type IngestResponse from '@stackpress/ingest/dist/Response';
import type IngestServer from '@stackpress/ingest/dist/Server';
import type IngestRouter from '@stackpress/ingest/dist/Router';
import type IngestRoute from '@stackpress/ingest/dist/Route';

export type * from '@/types';

export type Response = IngestResponse<NodeOptResponse>;
export type Request<
  C extends UnknownNest = UnknownNest
> = IngestRequest<NodeRequest, IngestServer<C, NodeRequest, NodeOptResponse>>;
export type Server<
  C extends UnknownNest = UnknownNest
> = IngestServer<C, NodeRequest, NodeOptResponse>;
export type Router<
  C extends UnknownNest = UnknownNest
> = IngestRouter<C, NodeRequest, NodeOptResponse>;
export type Route<
  C extends UnknownNest = UnknownNest
> = IngestRoute<C, NodeRequest, NodeOptResponse>;

import {
  Adapter,
  gateway,
  handler,
  server,
  router
} from '@stackpress/ingest/dist/whatwg';

export {
  Adapter,
  gateway,
  handler,
  server,
  router
};