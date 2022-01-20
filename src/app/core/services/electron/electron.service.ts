/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { fromEvent } from 'rxjs';
import { NodeApiList, NodeStreamList } from '../../../../../app/enums';

enum IpcInvokeEnum {
  SAVE_DATA = 'save-data',
  LOAD_DATA = 'load-data'
}

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  fs: typeof fs;
  ipcRenderer: typeof ipcRenderer;

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');

      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }

    this.cleanup();
  }

  public get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  public loadData(dataType: NodeApiList) {
    return this.ipcRenderer.invoke(IpcInvokeEnum.LOAD_DATA, dataType);
  }

  public saveData(dataType: NodeApiList, data: any) {
    return this.ipcRenderer.invoke(IpcInvokeEnum.SAVE_DATA, dataType, data);
  }

  // TODO: I believe the ipcRenderer return event is outside ngZone:
  // https://stackoverflow.com/questions/67685191/using-angular-async-pipe-and-onpush-change-detection-from-3rd-party-libraries
  // https://stackoverflow.com/questions/59549823/create-rxjs-of-observable-from-electron-ipcmain-on-response
  public async getBackendDataStream(streamRequest: NodeStreamList) {
    await this.ipcRenderer.send(String(streamRequest));

    console.log('stream request', streamRequest);
    return fromEvent(this.ipcRenderer, String(streamRequest), (event, payload) => payload);
  }

  // TODO: Add cleanup as enum
  // This needs to be run to prevent buildup of node-side subscriptions when user refreshes page :/
  private cleanup() {
    this.ipcRenderer.send('cleanup');
  }
}
