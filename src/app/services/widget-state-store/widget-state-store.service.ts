/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Observable, reduce } from 'rxjs';
import { tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ElectronService } from '../../core/services';
import { NodeApiList, Widget } from '../../enums/enum';

export type WidgetState = {
  [key in Widget]?: Record<string, unknown>;
};

// https://stackoverflow.com/questions/62082215/typescript-map-all-enum-values-as-key
export type WidgetStateStore = Record<Widget, Record<string, unknown>>;

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

  public updateMyWidgetState(state: WidgetState) {
    this.electronService.saveData(NodeApiList.WIDGET_STORE, state).then(() => {
      this.loadData();
    });
  }

  public getMyWidgetState(widgetName: Widget) {
    // TODO: Add distinctUntilChanged
    console.log('getting state');
    console.log(this._dataStateSubject.getValue()['timer-store']);
    // return this.dataState$
    //   .pipe(
    //     tap((val: WidgetStateStore) => console.log(val)),
    //     reduce((acc, val) => {
    //       console.log('val', val);
    //     })
    //   );
  }


  private loadData() {
    this.electronService.loadData(NodeApiList.WIDGET_STORE).then((state: WidgetStateStore) => {
      console.log('hey', state);
      if (state) {
        console.log('state', state);
        this._dataStateSubject.next(state);
      }
    });
  }

}


