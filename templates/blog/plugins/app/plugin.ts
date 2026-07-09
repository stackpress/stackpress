//modules
import type { HttpServer } from '@stackpress/ingest';
import type { DesktopMenuContribution } from 'stackpress-desktop/types';
import { contributeDesktopMenu } from 'stackpress-desktop/plugin';
import type { Config } from '../../config/common.js';

const desktopMenu: DesktopMenuContribution = {
  id: 'blog:open-latest-posts',
  menu: 'help',
  label: 'Open Latest Posts',
  event: 'blog:desktop-open-latest-posts',
  priority: 20
};

const desktopMenuContributed = new WeakSet<object>();

export default function plugin(server: HttpServer<Config>) {
  server.on('listen', async _ => {
    //on error, show error page
    server.on('error', () => import('./pages/error.js'));
    //on response, check for errors
    server.on('response', async ({ req, res, ctx }) => {  
      if (res.error) {
        await ctx.emit('error', req, res);
      }
    });
    server.on('desktop:menu', ({ ctx }) => {
      if (desktopMenuContributed.has(ctx)) {
        return;
      }
      contributeDesktopMenu(ctx, desktopMenu);
      desktopMenuContributed.add(ctx);
    });
    server.on('blog:desktop-open-latest-posts', ({ res }) => {
      res.results({ desktopEvent: 'blog:desktop-open-latest-posts' });
    });
  });
  server.on('route', async _ => {
    server.import.get('/', () => import('./pages/home.js'));
    server.view.get('/', '@/plugins/app/views/home');

    server.import.get('/articles/:slug', () => import('./pages/article.js'));
    server.view.get('/articles/:slug', '@/plugins/app/views/article');
  });
};
