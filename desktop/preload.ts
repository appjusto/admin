import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Channels, IpcArgs } from './types';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args?: IpcArgs[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: IpcArgs[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: IpcArgs[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: IpcArgs[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector: string, text: string) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency]!)
    }
  })