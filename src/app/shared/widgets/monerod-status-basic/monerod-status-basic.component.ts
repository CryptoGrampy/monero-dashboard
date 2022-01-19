import { ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs';
import { MoneroDaemonState } from '../../../../../app/MonerodService';
import { calcBytesToGigabytes, calcMonerodSyncPercentage } from '../../../../../app/utils';
import { MonerodControllerService } from '../../../services/monerod-controller/monerod-controller.service';

@Component({
  selector: 'app-monerod-status-basic',
  templateUrl: './monerod-status-basic.component.html',
  styleUrls: ['./monerod-status-basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonerodStatusBasicComponent implements OnInit, OnDestroy {
  public defaultState = {
    adjustedTimestamp: undefined,
    numAltBlocks: undefined,
    blockSizeLimit: undefined,
    blockSizeMedian: undefined,
    blockWeightLimit: undefined,
    blockWeightMedian: undefined,
    isBusySyncing: undefined,
    databaseSize: undefined,
    freeSpace: undefined,
    numOfflinePeers: undefined,
    height: undefined,
    heightWithoutBootstrap: undefined,
    numIncomingConnections: undefined,
    networkType: undefined,
    isOffline: true,
    numOutgoingConnections: undefined,
    numRpcConnections: undefined,
    startTimestamp: undefined,
    isSynchronized: undefined,
    target: undefined,
    targetHeight: undefined,
    topBlockHash: undefined,
    numTxs: undefined,
    numTxsPool: undefined,
    updateAvailable: undefined,
    version: undefined,
    wasBootstrapEverUsed: undefined,
    numOnlinePeers: undefined,
    cumulativeDifficulty: undefined,
    difficulty: undefined
  };

  public subscription$: Subscription;

  public testEmitter$ = new BehaviorSubject<Partial<MoneroDaemonState>>(this.defaultState);

  public syncPercentage = null;
  public storageRemaining = null;
  public monerodStorageUsed = null;

  constructor(
    private readonly monerodService: MonerodControllerService,
    private ngZone: NgZone) {}

  ngOnInit(): void {
    this.subscription$ = this.monerodService.getMoneroStatus().subscribe(data => {
      /**
       * TODO: for some reason rxjs async observable is happening outside ngzone.
       * the data is being subscribed to corexpressionrectly, but the template is not updating with a regular
       * this.dataHolder = incomingSubscriptionData, so had to do this hacky thing :)
       */
      this.ngZone.run(() => {
        this.testEmitter$.next(data);
      });
    });

    this.testEmitter$.subscribe(data => {
      if (data.height && data.targetHeight) {
        this.syncPercentage = calcMonerodSyncPercentage(data.height, data.targetHeight).toFixed(2);
      }

      if (data.databaseSize) {
        this.monerodStorageUsed = calcBytesToGigabytes(data.databaseSize).toFixed(2);
      };
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
