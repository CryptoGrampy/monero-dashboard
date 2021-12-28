import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
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

  // Subscribe to form changes to update store
  public monerodForm = this.fb.group({
    autostart: [false],
    customConfig: [false]
  });


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
    this.widgetStore.getMyWidgetState(this.widgetName)
    .pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    )
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

  startMonerod() {
    this.monerodService.start();
  }

  stopMonerod() {
    this.monerodService.stop();
  }

  onSetCustomMonerodFilepath(event) {
    if (event.target.checked) {
      this.monerodService.askMonerodFilepath();
    }
  }
}
