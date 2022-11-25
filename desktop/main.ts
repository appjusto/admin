import { app, BrowserWindow, ipcMain, IpcMainEvent, session } from 'electron';
import * as path from 'path';
import { IpcArgs } from './types';

const isDev = process.env.NODE_ENV === 'development';

const isDebug = isDev || process.env.DEBUG_PROD === 'true';

let baseURL = 'http://localhost:3000';

let mainWindow: BrowserWindow | null = null;

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

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // contextIsolation: true,
      // nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  console.log('NODE_ENV', process.env.NODE_ENV);
  // const baseURL = isDev ? 'http://localhost:3000' : url.format({
  //     pathname: path.join(__dirname, '../index.html'),
  //     protocol: 'file:',
  //     slashes: true
  // });
  // const baseURL = isDev ? 'http://localhost:3000' : `file://${__dirname}/../index.html`;
  if (!isDev) baseURL = 'https://admin.appjusto.com.br';
  mainWindow.loadURL(baseURL);
  // if (app.isPackaged) {
  //   // 'build/index.html'
  //   mainWindow.loadURL(`file://${__dirname}/../index.html`);
  // } else {
  //   mainWindow.loadURL('http://localhost:3000');
  //   }
  if (isDebug) {
    mainWindow.webContents.openDevTools();
  }
}

ipcMain.on('mainWindow-show', (_event: IpcMainEvent, args?: IpcArgs[]) => {
  console.log('Main Focus Call!', `${args}`);
  if (mainWindow) mainWindow.show();
  else console.log('mainWindow not found.');
});

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          `script-src 'self' ${baseURL} 'unsafe-inline' blob:
            https://connect.facebook.net
            https://*.freshchat.com
            https://*.freshworksapi.com
            https://*.googletagmanager.com
          `,
        ],
      },
    });
  });
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
