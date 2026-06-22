//modules
import { server } from '@stackpress/ingest/Server';

//client
import build from './build.js';
import dev from './dev.js';
import packageDesktop from './package.js';

//Desktop config lifecycle event used by plugins to contribute config patches.
export const desktopConfigEvent = 'desktop:config';

//Desktop menu lifecycle event used by plugins to contribute native menu items.
export const desktopMenuEvent = 'desktop:menu';

//Desktop ready event reserved for app code that needs post-start hooks.
export const desktopReadyEvent = 'desktop:ready';

//Desktop updater event reserved for future update checks.
export const desktopUpdateCheckEvent = 'desktop:update-check';

//Desktop updater event reserved for future available-update notifications.
export const desktopUpdateAvailableEvent = 'desktop:update-available';

//Desktop updater event reserved for future downloaded-update notifications.
export const desktopUpdateDownloadedEvent = 'desktop:update-downloaded';

/**
 * Create an event emitter with desktop terminal events registered.
 */
export default function desktopEvents() {
  //use a local emitter so packages can import desktop events as a bundle
  const emitter = server();
  emitter.on(/^desktop:build$/, build);
  emitter.on(/^desktop:dev$/, dev);
  emitter.on(/^desktop:package$/, packageDesktop);
  return emitter;
};

export { build, dev, packageDesktop as package };
