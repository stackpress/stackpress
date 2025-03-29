import type Request from "@stackpress/ingest/Request";
import type Response from "@stackpress/ingest/Response";
import type Server from "@stackpress/ingest/Server";
import removePage from "stackpress/admin/pages/remove";
import config from "../../config";

export default function AdminProfileRemovePage(req: Request, res: Response, ctx: Server) {
  return removePage(config)(req, res, ctx);
}
