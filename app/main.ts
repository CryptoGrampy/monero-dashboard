import { app, BrowserWindow, ipcMain, nativeImage, screen } from 'electron';
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

// Monerod status data stream return to front end
ipcMain.on(String(NodeStreamList.MONEROD_STATUS), (event, arg) => {
  monerodLatestData$ = moneroService.monerodLatestData$.subscribe(data => {
    event.reply(NodeStreamList.MONEROD_STATUS, data);
  });
});

function createWindow(): BrowserWindow {
  bootstrap();

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  const icon = nativeImage.createFromDataURL('data:image/png;base64,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');
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
    icon: icon
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
