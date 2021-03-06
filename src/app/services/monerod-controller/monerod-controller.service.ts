/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BehaviorSubject as Subject, Observable } from 'rxjs';
import { NodeApiList, MonerodControllerCommands, NodeStreamList } from '../../../../app/enums';
import { MoneroDaemonState } from '../../../../app/monerod-manager';
import { ElectronService } from '../../core/services/electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class MonerodControllerService {
  private moneroStatus$: BehaviorSubject<Partial<MoneroDaemonState>> = new BehaviorSubject({isOffline: true});

  constructor(private readonly electronService: ElectronService) {
    this.initMonerodDataStream();
  }

  getMoneroStatus(): Observable<Partial<MoneroDaemonState>> {
    return this.moneroStatus$.asObservable();
  }

  start() {
    this.electronService.saveData(NodeApiList.MONEROD_CONTROLLER, MonerodControllerCommands.START).then((data) => {
      console.log('Monerod Controller Start Data', data);
    });
  }

  stop() {
    this.electronService.saveData(NodeApiList.MONEROD_CONTROLLER, MonerodControllerCommands.STOP).then((data) => {
      console.log('Monerod Controller Stop Data', data);
    });
  }

  update() {
    this.electronService.saveData(NodeApiList.MONEROD_CONTROLLER, MonerodControllerCommands.UPDATE).then((data => {
      console.log('Monerod Controller Update Data', data);
    }));
  }

  askMonerodFilepath() {
    this.electronService.saveData(NodeApiList.MONEROD_CONTROLLER, MonerodControllerCommands.ASK_MONEROD_CONFIG).then(data => {
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
