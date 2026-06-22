declare module 'electron' {
  //Electron app namespace used by generated main process source.
  export const app: unknown;

  //BrowserWindow constructor surface used by runtime and generated main code.
  export const BrowserWindow: new (options: Record<string, unknown>) => {
    loadURL(url: string): unknown;
    on(event: string, listener: () => void): unknown;
  };

  //Electron Menu namespace used when compiled desktop menu templates exist.
  export const Menu: unknown;

  //Electron shell namespace used for allowed external navigation.
  export const shell: unknown;

  //Electron dialog namespace reserved for future native desktop capabilities.
  export const dialog: unknown;

  //Electron IPC main namespace reserved for future explicit native bridges.
  export const ipcMain: unknown;

  //Electron native image namespace reserved for icon and tray integrations.
  export const nativeImage: unknown;
}
