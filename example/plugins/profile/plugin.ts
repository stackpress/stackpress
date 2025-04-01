//stackpress
import type { Server } from 'stackpress/server';

export default function plugin(server: Server) {
  server.on('route', async _ => {
    server.all('/profile/create', () => import('./admin/pages/create'));
    server.all('/profile/export', () => import('./admin/pages/export'));
    server.all('/profile/detail/:id', () => import('./admin/pages/detail'));
    server.all('/profile/remove/:id', () => import('./admin/pages/remove'));
    server.all('/profile/restore/:id', () => import('./admin/pages/restore'));
    server.all('/profile/search', () => import('./admin/pages/search'));
    server.all('/profile/update/:id', () => import('./admin/pages/update'));

    server.all('/profile/create', '@/plugins/profile/admin/views/create', -100);
    server.all('/profile/detail/:id', '@/plugins/profile/admin/views/detail', -100);
    server.all('/profile/remove/:id', '@/plugins/profile/admin/views/remove', -100);
    server.all('/profile/restore/:id', '@/plugins/profile/admin/views/restore', -100);
    server.all('/profile/search', '@/plugins/profile/admin/views/search', -100);
    server.all('/profile/update/:id', '@/plugins/profile/admin/views/update', -100);
  });
};