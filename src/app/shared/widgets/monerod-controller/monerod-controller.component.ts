import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Widget } from '../../../enums/enum';
import { WidgetStateStoreService } from '../../../services/widget-state-store/widget-state-store.service';


interface MonerodState {
  autostart?: boolean;
}

@Component({
  selector: 'app-monerod-controller',
  templateUrl: './monerod-controller.component.html',
  styleUrls: ['./monerod-controller.component.scss']
})
export class MonerodControllerComponent implements OnInit, OnDestroy {
  public widgetName = Widget.MONEROD_CONTROLLER;
  public currentState: MonerodState;

  private defaultState: MonerodState = {
    autostart: false
  };

  constructor(private widgetStore: WidgetStateStoreService) {
    this.currentState = this.defaultState;
  }

  ngOnInit(): void {
    console.log('MonerodController INIT');
    this.widgetStore.getMyWidgetState(this.widgetName).subscribe((state: MonerodState) => {
      console.log('controller state subscription', state);
      this.currentState = state;
    });
  }

  ngOnDestroy(): void {
    // this.widgetState$.unsubscribe();
  }

  updateState() {
    this.widgetStore.updateMyWidgetState(this.currentState, this.widgetName);
  }

  toggleState() {
    const current = this.currentState.autostart;
    this.currentState.autostart = !current;
  }

}
