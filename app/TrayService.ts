/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Menu, MenuItem, nativeImage, Tray } from 'electron';
import ElectronStore from 'electron-store';
import { distinctUntilChanged, Observable, Subject } from 'rxjs';
import { MonerodService } from './MonerodService';
import { calcMonerodSyncPercentage } from './utils';

enum StatusLabels {
  ONLINE = 'Monero Node: Online',
  OFFLINE = 'Monero Node: Offline',
  SYNCING = 'Monero Node: Syncing',
  ERROR = 'Monero Node: Not Detected',
  STARTING = 'Starting Up... Please Hold',
  STOPPED = 'Monero Node Stopped'
}

// Data needed in Tray.. probably be moved into Tray class
export interface TrayData {
  isBusySyncing?: boolean;
  databaseSize?: number;
  isOffline?: boolean;
  updateAvailable?: boolean;
  isSynchronized?: boolean;
  numOutgoingConnections?: number;
  numIncomingConnections?: number;
  numRpcConnections?: number;
  syncPercentage?: number;
}

export interface TrayStore {
  trayStore: {
    autostart?: boolean;
  };
}

const isOfflineData: TrayData = {
  isBusySyncing: false,
  isOffline: true,
  isSynchronized: false,
  numOutgoingConnections: 0,
  numIncomingConnections: 0,
  numRpcConnections: 0,
  syncPercentage: undefined
};

interface TrayStateData {
  autostart?: boolean;
  isBusySyncing?: boolean;
  databaseSize?: number;
  isOffline?: boolean;
  updateAvailable?: boolean;
  isSynchronized?: boolean;
  numOutgoingConnections?: number;
  numIncomingConnections?: number;
  numRpcConnections?: number;
  syncPercentage?: number;
}

export class TrayService {
  // eslint-disable-next-line max-len
  private readonly TRAY_ICON = nativeImage.createFromDataURL('data:image/png;base64,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');
  private readonly tray = new Tray(this.TRAY_ICON);
  private readonly trayDataSubject: Subject<TrayData> = new Subject();
  private readonly store = new ElectronStore<TrayStore>();

  private trayState: TrayStateData = {
    ...isOfflineData, ...{autostart: this.getAutostart()}
  };

  constructor(private readonly monerodInstance: MonerodService) {

    // Subscribe to Monerod state change. TODO: See if RxJS has better method for this
    this.monerodInstance.monerodLatestData$.pipe(distinctUntilChanged())
      .subscribe((state) => {
        const updatedState = {
          isBusySyncing: state.isBusySyncing,
          databaseSize: state.databaseSize,
          isOffline: state.isOffline,
          updateAvailable: state.updateAvailable,
          isSynchronized: state.isSynchronized,
          numOutgoingConnections: state.numOutgoingConnections,
          numIncomingConnections: state.numIncomingConnections,
          numRpcConnections: state.numRpcConnections,
          syncPercentage: calcMonerodSyncPercentage(state.height, state.targetHeight)
        };
        this.updateTrayState(updatedState);
        this.generateTray();
      });

      this.generateTray();
  }

  // Retrieves autostart boolean from electron-store
  public getAutostart(): boolean {
    return this.store.get('trayStore.autostart');
  }

  public setAutostart(val: boolean): void {
    this.store.set('trayStore.autostart', val);

    this.updateTrayState({ autostart: this.getAutostart() });
    this.generateTray();
    }

  private updateStatus(trayData: TrayStateData): string {
    if (!trayData.isOffline && !trayData.isBusySyncing) {
      return StatusLabels.ONLINE;
    } else if (trayData.isOffline) {
      return StatusLabels.OFFLINE;
    } else if (trayData.isBusySyncing) {
      return StatusLabels.SYNCING;
    } else {
      return StatusLabels.ERROR;
    }
  }

  private generateTray(): void {
    this.tray.setContextMenu(Menu.buildFromTemplate([
      { id: 'status', label: this.updateStatus(this.trayState), type: 'normal', enabled: false },
      { id: 'sync', label: `Sync: ${this.trayState.syncPercentage && !this.trayState.isOffline ? this.trayState.syncPercentage : 'Unknown Sync '}%`, type: 'normal', enabled: false },
      // { id: 'freeSpace', label: `Free Storage Remaining: 0%`, type: 'normal', enabled: false },
      { id: 'connections', label: !this.trayState.isOffline ? `Connections: Out: ${this.trayState.numOutgoingConnections} P2P: ${this.trayState.numIncomingConnections} RPC: ${this.trayState.numRpcConnections}`: '', type: 'normal', enabled: false },
      // { label: 'Sep1', type: 'separator' },
      // { label: 'Dashboard', type: 'normal' },
      { label: 'Sep2', type: 'separator' },
      { label: 'Set Monerod location', type: 'normal', click: () => this.monerodInstance.askMonerodFilePath() },
      { label: 'Start Node', type: 'normal', click: () => this.monerodInstance.startDaemon() },
      { label: 'Stop Node', type: 'normal', click: () => this.onStopDaemon()},
      // { label: 'Restart Node', type: 'normal' },
      { id: 'autostart', label: 'Autostart on Boot', type: 'checkbox', checked: this.trayState.autostart, click: (ref: MenuItem) => this.setAutostart(ref.checked)},
      // { label: 'Sep3', type: 'separator' },
      // { label: 'Settings', type: 'normal' },
      { label: 'Sep4', type: 'separator' },
      { label: 'Quit', type: 'normal', role: 'quit' }
    ]));
  }

  private async onStopDaemon(): Promise<void> {
    await this.monerodInstance.stopDaemon();
    this.updateTrayState(isOfflineData);
    this.generateTray();
  }

  private updateTrayState(updatedState: TrayStateData) {
    this.trayState = { ...this.trayState, ...updatedState};
  }

}
