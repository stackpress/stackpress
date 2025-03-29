import type Request from "@stackpress/ingest/Request";
import type Response from "@stackpress/ingest/Response";
import type Server from "@stackpress/ingest/Server";
import searchPage from "stackpress/admin/pages/search";
import config from "../../config";

export default function AdminAddressSearchPage(
  req: Request,
  res: Response,
  ctx: Server,
) {
  return searchPage(config)(req, res, ctx);
}
