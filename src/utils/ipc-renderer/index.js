/**
 *
 *
 * @export
 * @param {string} channel
 * @param {any[]} args
 * @return {Promise<any>}
 * @example
 * rendererInvoke("example.channel")
 * .then(response => {})
 * .catch(err => {})
 */
export function rendererInvoke(channel, ...args) {
  return window.electron.ipcRenderer.invoke(channel, args);
}

/**
 *
 * @returns {Electron.IpcRenderer} IpcRenderer
 */
export function handleIpcRenderer() {
  return window.electron.ipcRenderer;
}

/**
 *
 * @param {AxiosRequestConfig<any>} config
 *
 * @return {Promise<any>}
 */
export function rendererInvokeRequest(config) {
  return rendererInvoke("request", config);
}
