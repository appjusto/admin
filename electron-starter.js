 const path = require('path');
 const url = require('url');
 const { app, BrowserWindow, shell, ipcMain, protocol } = require('electron');
//  const { autoUpdater } = require('electron-updater');
//  const log = require('electron-log');
 
 let mainWindow = null;
 
 ipcMain.on('ipc-example', async (event, arg) => {
   const msgTemplate = (pingPong) => `IPC test: ${pingPong}`;
   console.log(msgTemplate(arg));
   event.reply('ipc-example', msgTemplate('pong'));
 });
 
 if (process.env.NODE_ENV === 'production') {
   const sourceMapSupport = require('source-map-support');
   sourceMapSupport.install();
 }
 
 const isDebug =
   process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
 
 if (isDebug) {
   require('electron-debug')();
 }
 
 const installExtensions = async () => {
   const installer = require('electron-devtools-installer');
   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
   const extensions = ['REACT_DEVELOPER_TOOLS'];
 
   return installer
     .default(
       extensions.map((name) => installer[name]),
       forceDownload
     )
     .catch(console.log);
 };
 
 const createWindow = async () => {
   if (isDebug) {
     await installExtensions();
   }
 
   const RESOURCES_PATH = app.isPackaged
     ? path.join(process.resourcesPath, 'assets')
     : path.join(__dirname, 'build/static');
 
   const getAssetPath = (...paths) => {
     return path.join(RESOURCES_PATH, ...paths);
   };
 
   mainWindow = new BrowserWindow({
     show: false,
     width: 1024,
     height: 728,
     icon: getAssetPath('logo192.png'),
     webPreferences: {
    //    nodeIntegration: true,
    //    contextIsolation: false,
       preload: path.join(__dirname, 'desktop/preload.js')
     },
   });
   
  //  mainWindow.loadFile('./build/index.html');
  // //  const baseURL = url.format({
  // //     pathname: path.join(__dirname, './build/index.html'),
  // //     protocol: 'file:',
  // //     slashes: true
  // // });
    const baseURL = isDebug ? 'http://localhost:3000' : url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
  });
  mainWindow.loadURL(baseURL);
 
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });
 
   mainWindow.on('closed', () => {
     mainWindow = null;
   });
 
//    const menuBuilder = new MenuBuilder(mainWindow);
//    menuBuilder.buildMenu();
 
   // Open urls in the user's browser
   mainWindow.webContents.setWindowOpenHandler((edata) => {
     shell.openExternal(edata.url);
     return { action: 'deny' };
   });
 
   // Remove this if your app does not use auto updates
   // eslint-disable-next-line
//    new AppUpdater();
 };

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/build/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}
 
 /**
  * Add event listeners...
  */
 
 app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
 });
 
 app
   .whenReady()
   .then(() => {
      setupLocalFilesNormalizerProxy();
      createWindow();
      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) createWindow();
      });
   })
   .catch(console.log);
 