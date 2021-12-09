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
  // Default state
  public state: MonerodState = {
    autostart: false
  };
  // widgetState$: Subscription;

  constructor(private widgetStore: WidgetStateStoreService) {
  }

  ngOnInit(): void {
    console.log('MonerodController INIT');
    this.widgetStore.getMyWidgetState(this.widgetName).subscribe((state: MonerodState) => {
      console.log('controller state subscription', state);
      // this.state = state;
    });
  }

  ngOnDestroy(): void {
    // this.widgetState$.unsubscribe();
  }

  updateState() {
    this.widgetStore.updateMyWidgetState(this.state, this.widgetName);
  }

  toggleState() {
    const current = this.state.autostart;
    this.state.autostart = !current;
  }

}
