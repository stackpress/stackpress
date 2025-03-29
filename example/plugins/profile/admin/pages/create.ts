import type Request from "@stackpress/ingest/Request";
import type Response from "@stackpress/ingest/Response";
import type Server from "@stackpress/ingest/Server";
import createPage from "stackpress/admin/pages/create";
import config from "../../config";

export default function AdminAddressCreatePage(
  req: Request,
  res: Response,
  ctx: Server,
) {
  return createPage(config)(req, res, ctx);
}
