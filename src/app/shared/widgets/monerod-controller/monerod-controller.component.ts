import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Widget } from '../../../../../app/enums';
import { MonerodControllerService } from '../../../services/monerod-controller/monerod-controller.service';
import { TrayControllerService } from '../../../services/tray-controller/tray-controller.service';
import { WidgetStateStoreService } from '../../../services/widget-state-store/widget-state-store.service';


interface MonerodState {
  autostart?: boolean;
}

@Component({
  selector: 'app-monerod-controller',
  templateUrl: './monerod-controller.component.html',
  styleUrls: ['./monerod-controller.component.scss']
})
export class MonerodControllerComponent implements OnInit {
  public widgetName = Widget.MONEROD_CONTROLLER;
  public currentState: MonerodState;

  private defaultState: MonerodState = {
    autostart: false
  };

  constructor(
    private readonly widgetStore: WidgetStateStoreService,
    private readonly monerodService: MonerodControllerService,
    private readonly trayService: TrayControllerService) {
    this.currentState = this.defaultState;
  }

  ngOnInit(): void {
    console.log('MonerodController INIT');
    this.widgetStore.getMyWidgetState(this.widgetName).subscribe((state: MonerodState) => {
      console.log('controller state subscription', state);
      if (state) {
        this.currentState = state;
      }
    });
  }

  startMonerod() {
    this.monerodService.start();
  }

  stopMonerod() {
    this.monerodService.stop();
  }

  autostartMonerod() {
    this.trayService.autostart();
  }

  stopAutostartMonerod() {
    this.trayService.stopAutostart();
  }

  updateState() {
    this.widgetStore.updateMyWidgetState(this.currentState, this.widgetName);
  }

  toggleState() {
    const current = this.currentState.autostart;
    this.currentState.autostart = !current;
  }

}
