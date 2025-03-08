import type { UnknownNest } from '@stackpress/lib/dist/types';
import type { IM, SR } from '@stackpress/ingest/dist/types';
import type IngestRequest from '@stackpress/ingest/dist/Request';
import type IngestResponse from '@stackpress/ingest/dist/Response';
import type IngestServer from '@stackpress/ingest/dist/Server';
import type IngestRouter from '@stackpress/ingest/dist/Router';
import type IngestRoute from '@stackpress/ingest/dist/Route';

export type * from '@/types';

export type Response = IngestResponse<SR>;
export type Request<
  C extends UnknownNest = UnknownNest
> = IngestRequest<IM, IngestServer<C, IM, SR>>;
export type Server<
  C extends UnknownNest = UnknownNest
> = IngestServer<C, IM, SR>;
export type Router<
  C extends UnknownNest = UnknownNest
> = IngestRouter<C, IM, SR>;
export type Route<
  C extends UnknownNest = UnknownNest
> = IngestRoute<C, IM, SR>;

import {
  Adapter,
  gateway,
  handler,
  server,
  router
} from '@stackpress/ingest/dist/http';

export {
  Adapter,
  gateway,
  handler,
  server,
  router
};