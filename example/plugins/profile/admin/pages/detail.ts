import type Request from "@stackpress/ingest/Request";
import type Response from "@stackpress/ingest/Response";
import type Server from "@stackpress/ingest/Server";
import detailPage from "stackpress/admin/pages/detail";
import config from "../../config";

export default function AdminProfileDetailPage(req: Request, res: Response, ctx: Server) {
  return detailPage(config)(req, res, ctx);
}
