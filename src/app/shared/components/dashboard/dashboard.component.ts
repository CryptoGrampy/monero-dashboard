import { Component, OnInit } from '@angular/core';
import { KtdGridLayout, KtdGridLayoutItem, ktdTrackById } from '@katoid/angular-grid-layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  widgets = [
    'app-monerochan-slideshow',
    'app-monerod-status-basic',
    'app-monerod-timer',
    'app-monerod-controller'
  ];

  selectVal = '';

  cols = 6;
  rowHeight = 50;
  layout: KtdGridLayout = [
    { id: 'app-monerochan-slideshow', x: 3, y: 3, w: 4, h: 10 },
    { id: 'app-monerod-status-basic', x: 3, y: 0, w: 3, h: 3 },
    { id: 'app-monerod-timer', x: 0, y: 3, w: 3, h: 3 },
    { id: 'app-monerod-controller', x: 3, y: 3, w: 3, h: 3 },
  ];
  trackById = ktdTrackById;

  constructor() { }

  ngOnInit(): void {
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

    const newLayoutItem: KtdGridLayoutItem = {
        id: nextId,
        x: 0,
        y: 0,
        w: 4,
        h: 4
    };

    // Important: Don't mutate the array, create new instance. This way notifies the Grid component that the layout has changed.
    this.layout = [
        newLayoutItem,
        ...this.layout
    ];

  }

  remove(id: string) {
    // Important: Don't mutate the array. Let Angular know that the layout has changed creating a new reference.
    this.layout = this.ktdArrayRemoveItem(this.layout, (item) => item.id === id);
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
