import type Request from "@stackpress/ingest/Request";
import type Response from "@stackpress/ingest/Response";
import type Server from "@stackpress/ingest/Server";
import importPage from "stackpress/admin/pages/import";
import config from "../../config";

export default function AdminAddressImportPage(
  req: Request,
  res: Response,
  ctx: Server,
) {
  return importPage(config)(req, res, ctx);
}
