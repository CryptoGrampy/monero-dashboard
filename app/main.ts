import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { MonerodService } from './MonerodService';
import { TrayService } from './TrayService';
import { IpcInvokeEnum, NodeApiList, MonerodControllerCommands, TrayControllerCommands, NodeStreamList  } from './enums';
import { WidgetStoreService } from './WidgetStoreService';
import { Subscription } from 'rxjs';

let win: BrowserWindow = null;
const moneroService = new MonerodService();
let monerodLatestData$: Subscription;
const widgetStateStoreService = new WidgetStoreService();

const args = process.argv.slice(1);
  const serve = args.some(val => val === '--serve');

const bootstrap = async () => {
  if (moneroService.getMonerodFilepath() === undefined) {
    moneroService.askMonerodFilePath();
  }

  const trayManager = new TrayService(moneroService);

  if (trayManager.getAutostart() === true && moneroService.getMonerodFilepath() !== undefined) {
    moneroService.startDaemon();
  }

  // Save Data
  ipcMain.handle(IpcInvokeEnum.SAVE_DATA, async (event, storeKey: NodeApiList, data) => {
    switch (storeKey) {
      case NodeApiList.WIDGET_STORE:
        widgetStateStoreService.setWidgetStateStore(data);
        break;

      case NodeApiList.TRAY_CONTROLLER:
        if (data === TrayControllerCommands.AUTOSTART) {
          trayManager.setAutostart(true);
        } else if (data === TrayControllerCommands.STOP_AUTOSTART) {
          trayManager.setAutostart(false);
        }
        break;
      case NodeApiList.MONEROD_CONTROLLER:
        if (data === MonerodControllerCommands.START) {
          await moneroService.startDaemon();
        } else if (data === MonerodControllerCommands.STOP) {
          await moneroService.stopDaemon();
        } else if (data === MonerodControllerCommands.UPDATE) {
          await moneroService.updateDaemon();
        } else if (data === MonerodControllerCommands.ASK_MONEROD_CONFIG) {
          await moneroService.askMonerodConfigFilePath();
        }
        break;
      default:
        break;
    }
  });

  // Load Data
  ipcMain.handle(IpcInvokeEnum.LOAD_DATA, async (event, storeKey: NodeApiList) => {
    let returnData = null;
    switch (storeKey) {
      case NodeApiList.WIDGET_STORE:
        returnData = widgetStateStoreService.getWidgetStateStore();
        break;

      case NodeApiList.MONEROD_STATUS:
        break;

      default:
        break;
    }
    return returnData;
  });
};

const cleanup = () => {
  if (monerodLatestData$) {
    monerodLatestData$.unsubscribe();
  }
};

ipcMain.on('cleanup', () => {
  cleanup();
});

ipcMain.on(String(NodeStreamList.MONEROD_STATUS), (event, arg) => {
  monerodLatestData$ = moneroService.monerodLatestData$.subscribe(data => {
    event.reply(NodeStreamList.MONEROD_STATUS, data);
  });
});

function createWindow(): BrowserWindow {
  bootstrap();

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });

  if (serve) {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window.
  // More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    cleanup();
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
