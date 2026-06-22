import { describe, it } from 'mocha';
import { expect } from 'chai';
import { server } from '@stackpress/ingest/Server';

import desktopPlugin, {
  contributeDesktopConfig,
  contributeDesktopMenu,
  dispatchDesktopMenuEvent,
  markDesktopInitialized
} from '../src/plugin.js';
import MenuRegistry from '../src/MenuRegistry.js';
import type { DesktopPlugin } from '../src/types.js';

describe('desktop/plugin', () => {
  it('should apply desktop:config lifecycle contributions before initialization', async () => {
    const app = server();
    desktopPlugin(app);

    await app.resolve('listen');
    await app.resolve('desktop:config', {
      window: { title: 'Blog Desktop' },
      server: { open: '/articles/welcome' }
    });

    expect(app.plugin<DesktopPlugin>('desktop').config.window?.title)
      .to.equal('Blog Desktop');
    expect(app.plugin<DesktopPlugin>('desktop').config.server?.open)
      .to.equal('/articles/welcome');
  });

  it('should apply desktop:menu lifecycle contributions before compilation', async () => {
    const app = server();
    desktopPlugin(app);

    await app.resolve('listen');
    await app.resolve('desktop:menu', {
      id: 'blog:latest',
      menu: 'help',
      label: 'Latest Posts',
      event: 'blog:desktop-latest'
    });

    const registry = app.plugin<DesktopPlugin>('desktop').menu as MenuRegistry;
    const help = registry.compile().find(group => group.menu === 'help');

    expect(help?.items.map(item => item.id)).to.include('blog:latest');
  });

  it('should keep native edit roles when app menus are contributed', async () => {
    const app = server();
    desktopPlugin(app);

    await app.resolve('listen');
    await app.resolve('desktop:menu', {
      id: 'blog:latest',
      menu: 'help',
      label: 'Latest Posts',
      event: 'blog:desktop-latest'
    });

    const registry = app.plugin<DesktopPlugin>('desktop').menu as MenuRegistry;
    const edit = registry.compile().find(group => group.menu === 'edit');

    expect(edit?.items.map(item => item.role)).to.include('copy');
  });

  it('should expose direct helpers for plugin-authored contributions', async () => {
    const app = server();
    desktopPlugin(app);

    await app.resolve('listen');
    contributeDesktopConfig(app, { window: { title: 'Helper Desktop' } });
    contributeDesktopMenu(app, {
      id: 'helper:docs',
      menu: 'help',
      label: 'Helper Docs'
    });

    const registry = app.plugin<DesktopPlugin>('desktop').menu as MenuRegistry;
    const help = registry.compile().find(group => group.menu === 'help');

    expect(app.plugin<DesktopPlugin>('desktop').config.window?.title)
      .to.equal('Helper Desktop');
    expect(help?.items.map(item => item.id)).to.include('helper:docs');
  });

  it('should reject late desktop contributions clearly', async () => {
    const app = server();
    desktopPlugin(app);

    await app.resolve('listen');
    markDesktopInitialized(app);

    expect(() => contributeDesktopConfig(app, { window: { title: 'Late' } }))
      .to.throw(/desktop:config.*before desktop initialization/i);
    expect(() => contributeDesktopMenu(app, {
      id: 'late',
      menu: 'help',
      label: 'Late'
    })).to.throw(/desktop:menu.*before desktop initialization/i);
  });

  it('should dispatch app-defined desktop menu events through Stackpress', async () => {
    const app = server();
    desktopPlugin(app);

    await app.resolve('listen');
    app.on('blog:desktop-latest', ({ res }) => {
      res.results({ handled: true });
    });

    const result = await dispatchDesktopMenuEvent(app, 'blog:desktop-latest');

    expect(result.results).to.include({ handled: true });
    expect(result.code).to.equal(200);
  });
});
