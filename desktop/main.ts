import { app, BrowserWindow } from 'electron';
import * as path from 'path';

const isDev = process.env.NODE_ENV === 'development';

const isDebug = isDev || process.env.DEBUG_PROD === 'true';

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

async function createWindow() {
  if (isDebug) {
    // DevTools
    await installExtensions();
  }

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'logo.png'),
    webPreferences: {
      // contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  console.log("NODE_ENV", process.env.NODE_ENV)
  // const baseURL = isDev ? 'http://localhost:3000' : url.format({
  //     pathname: path.join(__dirname, '../index.html'),
  //     protocol: 'file:',
  //     slashes: true
  // });
  // const baseURL = isDev ? 'http://localhost:3000' : `file://${__dirname}/../index.html`;
  const baseURL = isDev ? 'http://localhost:3000' : `https://dev.admin.appjusto.com.br`;
  mainWindow.loadURL(baseURL);
  // if (app.isPackaged) {
  //   // 'build/index.html'
  //   mainWindow.loadURL(`file://${__dirname}/../index.html`);
  // } else {
  //   mainWindow.loadURL('http://localhost:3000');
  //   }
  if(isDebug) {
    mainWindow.webContents.openDevTools();
  }
    // mainWindow.webContents.openDevTools();
}


app.whenReady().then(() => {
  // // DevTools
  // if(isDebug) {
  //   installExtension(REACT_DEVELOPER_TOOLS)
  //     .then((name) => console.log(`Added Extension:  ${name}`))
  //     .catch((err) => console.log('An error occurred: ', err));
  // }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});