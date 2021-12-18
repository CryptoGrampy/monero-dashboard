/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Observable, pluck, tap, BehaviorSubject } from 'rxjs';
import { NodeApiList, Widget, WidgetStateStore } from '../../../../app/enums';
import { ElectronService } from '../../core/services/electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetStateStoreService {
  private dataState$: Observable<WidgetStateStore>;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly EMPTY_DATA_STATE = {} as WidgetStateStore;

  private _dataStateSubject: BehaviorSubject<WidgetStateStore> = new BehaviorSubject(this.EMPTY_DATA_STATE);

  constructor(private electronService: ElectronService) {
    this.dataState$ = this._dataStateSubject.asObservable();
    this.loadData();
  }

  public updateMyWidgetState(state: unknown, widgetName: Widget) {
    const storeState = {};
    console.log('name', widgetName);
    storeState[widgetName] = state;
    console.log('storeState', storeState);
    this.electronService.saveData(NodeApiList.WIDGET_STORE, storeState).then(() => {
      this.loadData();
    });
  }

  public getMyWidgetState(widgetName: Widget) {
    // TODO: Add distinctUntilChanged
    return this.dataState$
      .pipe(
        tap((val: WidgetStateStore) => console.log(val)),
        pluck(widgetName)
      );
  }


  private loadData() {
    this.electronService.loadData(NodeApiList.WIDGET_STORE).then((state: WidgetStateStore) => {
      if (state) {
        this._dataStateSubject.next(state);
      }
    });
  }

}


