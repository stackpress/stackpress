import type Server from "@stackpress/ingest/Server";

export default function routes(server: Server) {
  const root = server.config.path("admin.root", "/admin");
  server.import.all(`${root}/address/create`, () => import("./pages/create"));
  server.import.all(
    `${root}/address/detail/:id`,
    () => import("./pages/detail"),
  );
  server.import.all(`${root}/address/export`, () => import("./pages/export"));
  server.import.all(`${root}/address/import`, () => import("./pages/import"));
  server.import.all(
    `${root}/address/remove/:id`,
    () => import("./pages/remove"),
  );
  server.import.all(
    `${root}/address/restore/:id`,
    () => import("./pages/restore"),
  );
  server.import.all(`${root}/address/search`, () => import("./pages/search"));
  server.import.all(
    `${root}/address/update/:id`,
    () => import("./pages/update"),
  );

  const module = server.config.path("client.module", ".client");
  server.view.all(
    `${root}/address/create`,
    `${module}/Address/admin/views/create`,
    -100,
  );
  server.view.all(
    `${root}/address/detail/:id`,
    `${module}/Address/admin/views/detail`,
    -100,
  );
  server.view.all(
    `${root}/address/remove/:id`,
    `${module}/Address/admin/views/remove`,
    -100,
  );
  server.view.all(
    `${root}/address/restore/:id`,
    `${module}/Address/admin/views/restore`,
    -100,
  );
  server.view.all(
    `${root}/address/search`,
    `${module}/Address/admin/views/search`,
    -100,
  );
  server.view.all(
    `${root}/address/update/:id`,
    `${module}/Address/admin/views/update`,
    -100,
  );
}
