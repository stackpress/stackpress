//Preload source options describe the explicit renderer capabilities exposed by
// the desktop shell.
export type ElectronPreloadSourceOptions = {
  nativeCapabilities?: string[];
};

/**
 * Create the Electron preload source exposed to the renderer.
 */
export function createElectronPreloadSource(
  options: ElectronPreloadSourceOptions = {}
) {
  //dedupe capability names so renderer metadata is stable and minimal
  const nativeCapabilities = [ ...new Set(options.nativeCapabilities || []) ];

  //expose only frozen capability metadata, never direct native APIs
  return `const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('stackpressDesktop', Object.freeze({
  nativeCapabilities: Object.freeze(${JSON.stringify(nativeCapabilities)})
}));
`;
}
