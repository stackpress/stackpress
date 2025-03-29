import type Request from "@stackpress/ingest/Request";
import type Response from "@stackpress/ingest/Response";
import type Server from "@stackpress/ingest/Server";
import restorePage from "stackpress/admin/pages/restore";
import config from "../../config";

export default function AdminProfileRestorePage(req: Request, res: Response, ctx: Server) {
  return restorePage(config)(req, res, ctx);
}
