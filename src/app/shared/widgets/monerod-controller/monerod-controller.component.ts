import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
export class MonerodControllerComponent implements OnInit, OnDestroy {
  public widgetName = Widget.MONEROD_CONTROLLER;
  public currentState: MonerodState;

  // Subscribe to form changes to update store
  public monerodForm = this.fb.group({
    autostart: [false],
    customConfig: [false]
  });

  private widgetStoreSubscription: Subscription;

  private defaultState: MonerodState = {
    autostart: false
  };

  // TODO: There is a bug when autostart is checked and when the app is started for the first time
  constructor(
    private readonly widgetStore: WidgetStateStoreService,
    private readonly monerodService: MonerodControllerService,
    private readonly fb: FormBuilder,
    private readonly trayService: TrayControllerService) {
    this.currentState = this.defaultState;
  }

  ngOnInit(): void {
    this.widgetStoreSubscription = this.widgetStore.getMyWidgetState(this.widgetName)
    .subscribe((state: MonerodState) => {
      if (state) {
        this.monerodForm.patchValue(state);

        if (state.autostart === true) {
          this.trayService.autostart();
        } else {
          this.trayService.stopAutostart();
        }
      }
    });

    this.monerodForm.valueChanges.subscribe(() => {
      this.widgetStore.updateMyWidgetState(this.monerodForm.value, this.widgetName);
    });
  }

  ngOnDestroy(): void {
    this.widgetStoreSubscription.unsubscribe();
  }

  start() {
    this.monerodService.start();
  }

  stop() {
    this.monerodService.stop();
  }

  onSetCustomMonerodFilepath(event) {
    if (event.target.checked) {
      this.monerodService.askMonerodFilepath();
    }
  }
}
