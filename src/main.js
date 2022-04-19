const path = require("path");
const { app, BrowserWindow, ipcMain, protocol, session } = require("electron");
const { runInitLocalDatabase } = require("./system/database");

require("./system/channels/index");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // create file
  session.defaultSession.protocol.registerFileProtocol(
    "static",
    (request, callback) => {
      console.log(request);

      const fileUrl = request.url.replace("static://", "");
      const filePath = path.join(
        app.getAppPath(),
        ".webpack/renderer",
        fileUrl
      );
      callback(filePath);
    }
  );

  // start generate default seeders
  runInitLocalDatabase();

  // Create the browser window.
  let mainWindowConfig = {
    width: 800,
    height: 600,
    // autoHideMenuBar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  };
  const mainWindow = new BrowserWindow(mainWindowConfig);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("restart", () => {
  app.relaunch();
  app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
