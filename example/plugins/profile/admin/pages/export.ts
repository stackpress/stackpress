import type Request from "@stackpress/ingest/Request";
import type Response from "@stackpress/ingest/Response";
import type Server from "@stackpress/ingest/Server";
import exportPage from "stackpress/admin/pages/export";
import config from "../../config";

export default function AdminAddressExportPage(
  req: Request,
  res: Response,
  ctx: Server,
) {
  return exportPage(config)(req, res, ctx);
}
