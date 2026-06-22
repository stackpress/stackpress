//client
import build from './build.js';
import dev from './dev.js';
import packageDesktop from './package.js';

//Command event name for starting desktop dev mode.
export const desktopDevCommand = 'desktop:dev';

//Command event name for generating desktop build artifacts.
export const desktopBuildCommand = 'desktop:build';

//Command event name for packaging generated desktop artifacts.
export const desktopPackageCommand = 'desktop:package';

export { build, dev, packageDesktop as package };
