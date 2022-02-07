/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { dialog } from 'electron';
const monerojs = require('monero-javascript');
import { BehaviorSubject, defer, delay, Observable, repeat, share, tap } from 'rxjs';
import ElectronStore from 'electron-store';
import { from } from 'rxjs';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs';
import { takeUntil } from 'rxjs';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs';
import { map } from 'rxjs';
import { distinctUntilChanged } from 'rxjs';
import { Subject } from 'rxjs';

export interface MoneroMiningState {
  isActive?: boolean;
  speed?: number;
  numThreads?: number;
  address?: string;
  isBackground?: boolean;
}

// Return object from monero-javascript getInfo().state
// Consider moving to shared types.ts where front/backend can import
export interface MoneroDaemonState {
  adjustedTimestamp: number;
  numAltBlocks: number;
  blockSizeLimit: number;
  blockSizeMedian: number;
  blockWeightLimit: number;
  blockWeightMedian: number;
  isBusySyncing: boolean;
  databaseSize: number;
  freeSpace: any;
  numOfflinePeers: number;
  height: number;
  heightWithoutBootstrap: number;
  numIncomingConnections: number;
  networkType: number;
  isOffline: boolean;
  numOutgoingConnections: number;
  numRpcConnections: number;
  startTimestamp: number;
  isSynchronized: boolean;
  target: number;
  targetHeight: number;
  topBlockHash: string;
  numTxs: number;
  numTxsPool: number;
  updateAvailable: boolean;
  version: string;
  wasBootstrapEverUsed: boolean;
  numOnlinePeers: number;
  cumulativeDifficulty: any;
  difficulty: any;
}

enum MonerodStatus {
  ONLINE = 'Monero Node: Online',
  STARTING = 'Monero Node: Starting Up... Please Hold',
  SYNCING = 'Monero Node: Syncing',
  STOPPING = 'Monero Node: Shutting Down',
  OFFLINE = 'Monero Node: Offline',
  ERROR = 'Monero Node: Not Detected',
}

// Store user's Monerod settings via electron-store.
// https://paircoders.com/2020/07/04/add-and-update-values-in-behaviorsubject-angular/
interface MonerodStore {
  monerodStore: {
    filepath?: string;
    monerodFilepath?: boolean;
    monerodConfig?: string[];
    monerodConfigFilepath?: string;
  };
}

// TODO: Add linter/organize/review public private methods in class
// TODO: Implement this as a singleton
export class MonerodManager {
  public daemon: any;
  private readonly monerodStatusSubject: BehaviorSubject<MonerodStatus> = new BehaviorSubject(MonerodStatus.OFFLINE);
  private readonly store = new ElectronStore<MonerodStore>();
  private readonly monerodLatestDataSubject: BehaviorSubject<MoneroDaemonState> = new BehaviorSubject({ isOffline: true } as MoneroDaemonState);
  private readonly monerodMinerLatestDataSubject: Subject<MoneroMiningState> = new Subject();

  // private getDaemonInfoRequest$?: Subscription

  private getInfoInterval?: NodeJS.Timer;

  // TODO: Monerod startup stuff - config should be user editable and get saved to store
  // TODO: Consider RPC-only connections to remote Monerod
  // TODO: Use best possible default config for granny
  private readonly config = [
    this.getMonerodFilepath(),
    '--no-igd',
    '--no-zmq',
    '--p2p-bind-port', '18080',
    '--p2p-bind-ip', '0.0.0.0',
    '--rpc-bind-port', '18081',
    '--rpc-bind-ip', '127.0.0.1',
    '--disable-dns-checkpoints',
    '--confirm-external-bind',
    '--enable-dns-blocklist',
    '--prune-blockchain',
    '--out-peers', '32',
    '--in-peers', '100',
    '--limit-rate-up', '1048576',
    '--limit-rate-down', '1048576',
    '--db-sync-mode', 'safe:sync'
  ];

  public get monerodLatestData$(): Observable<MoneroDaemonState> {
    return this.monerodLatestDataSubject.asObservable();
  }

  public get monerodStatus$(): Observable<MonerodStatus> {
    return this.monerodStatusSubject.asObservable();
  }

  public get monerodMiningStatus$(): Observable<MoneroMiningState> {
    return this.monerodMinerLatestDataSubject.asObservable();
  }


  public async startDaemon() {
    try {
      console.log(await this.daemon.isConnected());
    } catch (err) {
      console.log('didnt work');
    }

    /**
     * TODO: Make this work if no connex available
     * TODO: Restart daemon when config changes (subscribe to config changes with rxjs)
     *
     * Running Daemon locally with monero-javascript- this was recently added
     * https://github.com/monero-ecosystem/monero-javascript/blob/fcc00324538975817d4524b9a337e95a9b68f441/src/test/TestMoneroDaemonRpc.js#L58
     */
    //
    if (this.monerodStatusSubject.value === MonerodStatus.OFFLINE) {
      this.monerodStatusSubject.next(MonerodStatus.OFFLINE);

      try {
        console.log('Starting Daemon');
        this.daemon = await monerojs.connectToDaemonRpc(this.config);

        this.pollDaemonGetInfo();
        this.pollDaemonGetIsConnected();
      } catch (err) {
        console.log('start daemon error', err);
      }
    }
  }

  public async stopDaemon() {
    // TODO: Move stop tasks to a cleanup method?
    if (this.monerodStatusSubject.value === MonerodStatus.ONLINE) {

      this.monerodStatusSubject.next(MonerodStatus.STOPPING);

      if (this.getInfoInterval) {
        clearInterval(this.getInfoInterval);
      }

      this.daemon.stopProcess().then((res) => {
        console.log('stopped', res);
      });
    }
  }

  // TODO: Add Restart.  call stopDaemon, wait for stopped, call start Daemon
  public async restartDaemon() { }

  // TODO: Does this actually work?
  public async updateDaemon() {
    try {
      await this.daemon.downloadUpdate();
    } catch (err) {
      console.log(err);
    }
  }

  // Generates ElectronJS prompt to ask user to specify monerod file location
  public async askMonerodFilePath() {
    const filePath = await dialog.showOpenDialog({ properties: ['openFile'], message: 'Please find and select your Monerod file', title: 'Please find and select your Monerod file' });

    if (!filePath.canceled) {
      this.store.set('monerodStore.monerodFilepath', String(filePath.filePaths[0]));
    }
  }

  // Generates ElectronJS prompt to ask user to specify monerod config file location
  public async askMonerodConfigFilePath() {
    const filePath = await dialog.showOpenDialog({ properties: ['openFile'], message: 'Please find and select your Monerod Config file', title: 'Please find and select your Monerod Config file' });

    if (!filePath.canceled) {
      this.store.set('monerodStore.monerodConfigFilepath', String(filePath.filePaths[0]));
    }
  }

  public async startSoloMining() {
    const address = '4A29yQbw6Lk6jCf1PdBBGa9FpEWd1mRmXTC7ZHpQHi9B2KdQedwcVUJCBWJL1EcqoTWuuLfsLCbLCDo2cywnt6jXVpgdDSQ';
    const numThreads = 4;
    const isBackground = false;
    const ignoreBattery = true;
    await this.daemon.startMining(address, numThreads, isBackground, ignoreBattery);

    this.pollMiningStatus();
  }

  public async stopSoloMining() {
    await this.daemon.stopMining();

    // this.miningStatusSubscription$.unsubscribe();

  }
  // Retrieves Monerod filepath from electron-store
  public getMonerodFilepath(): string {
    return this.store.get('monerodStore.monerodFilepath');
  }

  // Retrieves Monerod filepath from electron-store
  public getMonerodConfigFilepath(): string {
    return this.store.get('monerodStore.monerodConfigFilepath');
  }

  private pollMiningStatus() {
    const status = interval(10000).pipe(
      switchMap(
        (async () => await this.daemon.getMiningStatus()),
      ),
      distinctUntilChanged(),
      map(data => data.state),
      takeWhile(data => data.isActive === true),
    ).subscribe({
      error: (() => {
        console.log('pollMiningStatus subscription error');
        // TODO if user turns off monerod while mining, subscription completes.  perhaps handle this better
      }),
      next: data => {
        console.log('polling', data);
        this.monerodMinerLatestDataSubject.next(data);
      },
      complete: () => console.log('complete')
    });
  }

  private pollDaemonGetInfo() {
    // Using rxjs here to allow for unsubscribing / canceling outstanding requests before stopping Daemon
    // TODO: replace TS any type
    // TODO: FIXME - research using promise with rxjs 'from'
    // this.getDaemonInfoRequest$ = timer(0, 10000).pipe(concatMapTo(from(this.daemon.getInfo()))).subscribe((data: any) => {
    //     console.log(data.state.numTxsPool)
    //     this.monerodLatestDataSubject.next(data.state as MoneroDaemonState)
    // })

    // Partial Update State
    // https://paircoders.com/2020/07/04/add-and-update-values-in-behaviorsubject-angular/

    this.getInfoInterval = setInterval(async () => {
      try {
        const data = await this.daemon.getInfo();

        this.monerodLatestDataSubject.next(data.state as MoneroDaemonState);
      } catch (err) {
        console.log(err);
      }

    }, 20000);
  }

  private pollDaemonGetIsConnected() {
    interval(10000).pipe(
      switchMap(
        (async () => await this.daemon.isConnected()),
      ),
      distinctUntilChanged(),
      tap(status => {
        if (status === true) {
          this.monerodStatusSubject.next(MonerodStatus.ONLINE);
        } else {
          this.monerodStatusSubject.next(MonerodStatus.OFFLINE);
          this.monerodLatestDataSubject.next({ ...this.monerodLatestDataSubject.value, ...{ isOffline: true } });
          console.log('offline');
        }
      }),
      takeWhile(status => status !== false)
    ).subscribe({
      error: (err) => console.log('isConnected subscription error', err),
      complete: () => {
        this.monerodStatusSubject.next(MonerodStatus.OFFLINE);
        this.monerodLatestDataSubject.next({ ...this.monerodLatestDataSubject.value, ...{ isOffline: true } });
        console.log('poll daemon completed');
      }
    });
  }
}

// TODO move monerod ipc event listeners here
