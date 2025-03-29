import type Server from "@stackpress/ingest/Server";

export default function routes(server: Server) {
  const root = server.config.path('admin.root', '/admin');
          server.import.all(
            `${root}/profile/create`, 
            () => import('./pages/create')
          );
          server.import.all(
            `${root}/profile/detail/:id`, 
            () => import('./pages/detail')
          );
          server.import.all(
            `${root}/profile/export`, 
            () => import('./pages/export')
          );
          server.import.all(
            `${root}/profile/import`, 
            () => import('./pages/import')
          );
          server.import.all(
            `${root}/profile/remove/:id`, 
            () => import('./pages/remove')
          );
          server.import.all(
            `${root}/profile/restore/:id`, 
            () => import('./pages/restore')
          );
          server.import.all(
            `${root}/profile/search`, 
            () => import('./pages/search')
          );
          server.import.all(
            `${root}/profile/update/:id`, 
            () => import('./pages/update')
          );

          const module = server.config.path('client.module', '.client');
          server.view.all(
            `${root}/profile/create`, 
            `${module}/Profile/admin/views/create`,
            -100
          );
          server.view.all(
            `${root}/profile/detail/:id`, 
            `${module}/Profile/admin/views/detail`,
            -100
          );
          server.view.all(
            `${root}/profile/remove/:id`, 
            `${module}/Profile/admin/views/remove`,
            -100
          );
          server.view.all(
            `${root}/profile/restore/:id`, 
            `${module}/Profile/admin/views/restore`,
            -100
          );
          server.view.all(
            `${root}/profile/search`, 
            `${module}/Profile/admin/views/search`,
            -100
          );
          server.view.all(
            `${root}/profile/update/:id`, 
            `${module}/Profile/admin/views/update`,
            -100
          );
}
