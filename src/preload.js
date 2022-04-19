const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    // From render to main.
    send: (channel, args) => {
      ipcRenderer.send(channel, args);
    },
    // From main to render.
    on: (channel, listener) => {
      // Deliberately strip event as it includes `sender`.
      ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
    },
    // From render to main and back again.
    invoke: (channel, args) => {
      return ipcRenderer.invoke(channel, args);
    },
  },
});
