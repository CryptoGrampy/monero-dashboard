import { Component, OnDestroy, OnInit } from '@angular/core';
import { KtdGridLayout, KtdGridLayoutItem, ktdTrackById } from '@katoid/angular-grid-layout';
import { Subscription } from 'rxjs';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';
import { Widget } from '../../../../../app/enums';
import { WidgetStateStoreService } from '../../../services/widget-state-store/widget-state-store.service';

interface DashboardState {
  activeLayout?: KtdGridLayout;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  widgets = [
    'app-monerochan-slideshow',
    'app-monerod-status-basic',
    'app-monerod-timer',
    'app-monerod-controller',
    'app-radio',
    'app-updater'
  ];

  selectVal = '';

  cols = 6;
  rowHeight = 50;
  layout: KtdGridLayout = [
    { id: 'app-monerod-controller', x: 0, y: 0, w: 3, h: 3 },
  ];
  trackById = ktdTrackById;

  private widgetName = Widget.DASHBOARD;

  private subscription$: Subscription;

  private readonly dashboardState$: BehaviorSubject<DashboardState> = new BehaviorSubject({});

  constructor(private readonly widgetStore: WidgetStateStoreService) { }


  ngOnInit(): void {
    this.subscription$ = this.widgetStore.getMyWidgetState(this.widgetName)
    .pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    )
    .subscribe((state: DashboardState) => {
      if (state) {
       this.dashboardState$.next(state);
       console.log('updated dashboard', this.dashboardState$.value);
       this.layout = state.activeLayout;
      }
    });
  }

  ngOnDestroy(): void {
      this.subscription$.unsubscribe();
  }

  getDashboardState$(): Observable<DashboardState> {
    return this.dashboardState$.asObservable();
  }

  add() {
    console.log('adding widget', this.selectVal);
     /** Adds a grid item to the layout */
    const nextId = this.selectVal;

    let inUse = false;

    this.layout.forEach(item => {
      if (item.id === nextId) {
        console.log('id already exists');
        inUse = true;
        return;
      };
    });

    if (inUse || nextId === '') {
      return;
    }

    // TODO: Use a widget registry service for pulling widget id's and pre-defined 'default' sizes
    const newLayoutItem: KtdGridLayoutItem = {
        id: nextId,
        x: 0,
        y: 0,
        w: 2,
        h: 4
    };

    // Important: Don't mutate the array, create new instance. This way notifies the Grid component that the layout has changed.
    this.layout = [
        newLayoutItem,
        ...this.layout
    ];

    this.dashboardState$.next({activeLayout: this.layout});
    this.widgetStore.updateMyWidgetState(this.dashboardState$.value, this.widgetName);
  }

  remove(id: string) {
    // Important: Don't mutate the array. Let Angular know that the layout has changed creating a new reference.
    this.layout = this.ktdArrayRemoveItem(this.layout, (item) => item.id === id);
    this.dashboardState$.next({activeLayout: this.layout});
    this.widgetStore.updateMyWidgetState(this.dashboardState$.value, this.widgetName);
  }

  onLayoutUpdated(layout: KtdGridLayout) {
    console.log('on layout updated', layout);
    this.layout = layout;
    this.dashboardState$.next({activeLayout: this.layout});
    this.widgetStore.updateMyWidgetState(this.dashboardState$.value, this.widgetName);
}

  /**
   * Removes and item from an array. Returns a new array instance (it doesn't mutate the source array).
   *
   * @param array source array to be returned without the element to remove
   * @param condition function that will return true for the item that we want to remove
   */
  private ktdArrayRemoveItem<T>(array: T[], condition: (item: T) => boolean) {
    const arrayCopy = [...array];
    const index = array.findIndex((item) => condition(item));
    if (index > -1) {
      arrayCopy.splice(index, 1);
    }
    return arrayCopy;
  }
}

/**
 * widget/dashboard service
 *
 * addToDashboard(id)
 *
 * removeFromDashboard(id)
 *
 * getActiveWidgets: Observable[]
 * getInactiveWidgets: Observable[]
 *
 * saveDashboardToStore
 * loadDashboardFromStore
 * updateDashboardLayout()
 * getDashboard: [{}]
 */

/**
 * widget definition:
 *
 * widget {
 *   name: WidgetEnum.ID,
 *   defaultDashboardSize: { H: 3, W: 5 },
 *   previewImage
 *   component<WidgetComponent>: app-monerod-status-basic
 * }
 */
