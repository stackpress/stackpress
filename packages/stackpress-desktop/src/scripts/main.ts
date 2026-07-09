//client
import MenuRegistry from '../MenuRegistry.js';
import type {
  DesktopCompiledMenuGroup,
  DesktopMenuContribution,
  NormalizedDesktopConfig
} from '../types.js';

//Electron main source options carry the local runtime URL, optional preload
// path, and compiled menu groups into generated source.
export type ElectronMainSourceOptions = {
  url: string;
  preload?: string;
  menu?: DesktopCompiledMenuGroup[];
  desktopEventEvents?: string[];
  desktopEventToken?: string;
};

//Generated menu item model is serializable so it can be embedded directly in
// the Electron main process source string.
type ElectronMainMenuItem = {
  id?: string;
  label?: string;
  role?: string;
  enabled?: boolean;
  event?: string;
  submenu?: ElectronMainMenuItem[];
};

//Generated menu group model mirrors Electron's label/submenu template shape.
type ElectronMainMenuGroup = {
  label: string;
  submenu: ElectronMainMenuItem[];
};

/**
 * Convert one desktop menu contribution into a serializable main source model.
 */
function createMenuItemModel(
  item: DesktopMenuContribution
): ElectronMainMenuItem {
  //copy only serializable fields because functions are rebuilt in generated
  // Electron source.
  return {
    id: item.id,
    label: item.label,
    role: item.role,
    enabled: item.enabled ?? true,
    event: item.event,
    submenu: item.submenu?.map(createMenuItemModel)
  };
}

/**
 * Convert compiled menu groups into serializable Electron menu groups.
 */
function createMenuModel(
  groups: DesktopCompiledMenuGroup[] = []
): ElectronMainMenuGroup[] {
  //map registry menu keys to display labels before embedding generated JSON
  return groups.map(group => ({
    label: MenuRegistry.labelForMenu(group.menu),
    submenu: group.items.map(createMenuItemModel)
  }));
}

/**
 * Create the Electron main process source for a desktop dev runtime.
 */
export function createElectronMainSource(
  config: NormalizedDesktopConfig,
  options: ElectronMainSourceOptions
) {
  //prepare serialized values before interpolating the generated source
  const menu = createMenuModel(options.menu);
  const desktopEventEvents = options.desktopEventEvents || [];
  const desktopEventToken = options.desktopEventToken || '';
  const externalNavigation = config.security.externalNavigation;

  //the returned source owns Electron window creation, menu dispatch, external
  // navigation policy, and devtools policy for the desktop shell.
  return `import { app, BrowserWindow, Menu, shell } from 'electron';

const startUrl = ${JSON.stringify(options.url)};
const preload = ${JSON.stringify(options.preload || null)};
const menu = ${JSON.stringify(menu, null, 2)};
const desktopEventEvents = ${JSON.stringify(desktopEventEvents, null, 2)};
const desktopEventToken = ${JSON.stringify(desktopEventToken)};
const desktopEventAllowlist = new Set(desktopEventEvents);
const externalNavigation = ${JSON.stringify(externalNavigation)};

function desktopEventUrl(event) {
  const url = new URL('/__stackpress_desktop_event', startUrl);
  url.searchParams.set('event', event);
  return url.toString();
}

function dispatchDesktopEvent(event) {
  if (!desktopEventToken || !desktopEventAllowlist.has(event)) {
    return;
  }
  fetch(desktopEventUrl(event), {
    method: 'POST',
    headers: {
      'X-Stackpress-Desktop-Event-Token': desktopEventToken
    }
  }).catch(error => {
    console.error('Desktop menu event failed:', error);
  });
}

function isExternalNavigation(target) {
  try {
    return new URL(target).origin !== new URL(startUrl).origin;
  } catch {
    return true;
  }
}

function handleExternalNavigation(target) {
  if (!isExternalNavigation(target)) {
    return false;
  }
  if (externalNavigation === 'open-external') {
    shell.openExternal(target);
  }
  return true;
}

function toMenuItemTemplate(item) {
  const template = {
    id: item.id,
    label: item.label,
    role: item.role,
    enabled: item.enabled,
    submenu: item.submenu?.map(toMenuItemTemplate)
  };
  if (item.event) {
    template.click = () => dispatchDesktopEvent(item.event);
  }
  return template;
}

app.whenReady().then(() => {
  if (menu.length) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu.map(group => ({
      label: group.label,
      submenu: group.submenu.map(toMenuItemTemplate)
    }))));
  }
  const window = new BrowserWindow({
    width: ${config.window.width},
    height: ${config.window.height},
    minWidth: ${config.window.minWidth},
    minHeight: ${config.window.minHeight},
    title: ${JSON.stringify(config.window.title)},
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      ...(preload ? { preload } : {})
    }
  });
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (handleExternalNavigation(url)) {
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
  window.webContents.on('will-navigate', (event, url) => {
    if (handleExternalNavigation(url)) {
      event.preventDefault();
    }
  });
  if (!${JSON.stringify(config.security.allowDevTools)}) {
    window.webContents.on('devtools-opened', () => {
      window.webContents.closeDevTools();
    });
  }
  window.loadURL(startUrl);
});

app.on('window-all-closed', () => app.quit());
`;
}
