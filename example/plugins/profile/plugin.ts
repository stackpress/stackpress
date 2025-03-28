//stackpress
import type { Server } from 'stackpress/server';

export default function plugin(server: Server) {
  server.on('route', async _ => {
    server.all('/profile/create', () => import('./pages/create'));
    server.all('/profile/detail/:id', () => import('./pages/detail'));
    server.all('/profile/remove/:id', () => import('./pages/remove'));
    server.all('/profile/restore/:id', () => import('./pages/restore'));
    server.all('/profile/search', () => import('./pages/search'));
    server.all('/profile/update/:id', () => import('./pages/update'));

    server.all('/profile/create', '@/plugins/profile/views/create', -100);
    server.all('/profile/detail/:id', '@/plugins/profile/views/detail', -100);
    server.all('/profile/remove/:id', '@/plugins/profile/views/remove', -100);
    server.all('/profile/restore/:id', '@/plugins/profile/views/restore', -100);
    server.all('/profile/search', '@/plugins/profile/views/search', -100);
    server.all('/profile/update/:id', '@/plugins/profile/views/update', -100);

    server.all('/form', '@/plugins/profile/views/form', -100);
  });
};