import type Request from "@stackpress/ingest/Request";
import type Response from "@stackpress/ingest/Response";
import type Server from "@stackpress/ingest/Server";
import updatePage from "stackpress/admin/pages/update";
import config from "../../config";

export default function AdminProfileUpdatePage(
  req: Request,
  res: Response,
  ctx: Server,
) {
  return updatePage(config)(req, res, ctx);
}
