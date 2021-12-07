/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Observable, reduce } from 'rxjs';
import { tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ElectronService } from '..';
import { WidgetEnum } from '../widget-enum';

export interface WidgetState {
    name: WidgetEnum;
    state: Record<string, unknown>;
};

export type WidgetStateStore = WidgetState[];

@Injectable({
  providedIn: 'root'
})
export class WidgetStoreService {
  private dataState$: Observable<WidgetStateStore>;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly EMPTY_DATA_STATE = {} as WidgetStateStore;

  private _dataStateSubject: BehaviorSubject<WidgetStateStore> = new BehaviorSubject(this.EMPTY_DATA_STATE);

  constructor(private electronService: ElectronService) {
    this.dataState$ = this._dataStateSubject.asObservable();
    this.loadData();
  }

  public updateMyWidgetState(state: WidgetState) {
    this.electronService.saveData(WidgetEnum.WIDGET_STORE, state).then(() => {
      this.loadData();
    });
  }

  public getMyWidgetState(widgetName: WidgetEnum) {
    // TODO: Add distinctUntilChanged
    return this.dataState$
      .pipe(
        tap((val: WidgetStateStore) => console.log(val)),
        reduce((acc, val) => {
          console.log('val', val);
        })
      );
  }

  private loadData() {
    this.electronService.loadData(WidgetEnum.WIDGET_STORE).then((state: WidgetStateStore) => {
      if (state) {
        this._dataStateSubject.next(state);
      }
    });
  }

}


