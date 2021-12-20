/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NodeApiList, MonerodControllerCommands, NodeStreamList } from '../../../../app/enums';
import { MoneroDaemonState } from '../../../../app/MonerodService';
import { ElectronService } from '../../core/services/electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class MonerodControllerService {
  private moneroStatus$: BehaviorSubject<MoneroDaemonState> = new BehaviorSubject({ adjustedTimestamp: 123 } as MoneroDaemonState);

  constructor(private readonly electronService: ElectronService) {
    this.initMonerodDataStream();
  }

  getMoneroStatus(): Observable<MoneroDaemonState> {
    return this.moneroStatus$.asObservable();
}

  start() {
    this.electronService.saveData(NodeApiList.MONEROD_CONTROLLER, MonerodControllerCommands.START).then((data) => {
      console.log(data);
    });
  }

  stop() {
    this.electronService.saveData(NodeApiList.MONEROD_CONTROLLER, MonerodControllerCommands.STOP).then((data) => {
      console.log(data);
    });
  }

  // Create data subscription on init
  private initMonerodDataStream() {
    this.electronService.getBackendDataStream(NodeStreamList.MONEROD_STATUS).then(stream => {
      stream.subscribe(data => {
        if (data) {
          this.moneroStatus$.next(data);
        }
      });
    });
  }
}
