import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs';
import { Widget } from '../../../../../app/enums';
import { MonerodControllerService } from '../../../services/monerod-controller/monerod-controller.service';
import { WidgetStateStoreService } from '../../../services/widget-state-store/widget-state-store.service';

interface TimerState {
  startTime?: string;
  stopTime?: string;
  active?: boolean;
}

@Component({
  selector: 'app-monerod-timer',
  templateUrl: './monerod-timer.component.html',
  styleUrls: ['./monerod-timer.component.scss']
})
export class MonerodTimerComponent implements OnInit, OnDestroy {
  public widgetName = Widget.MONEROD_TIMER;

  // Subscribe to form changes to update store
  public timerForm = this.fb.group({
    startTime: [''],
    stopTime: [''],
    active: [false]
  });

  public stateSubject = new BehaviorSubject<Partial<TimerState>>({
    startTime: '',
    stopTime: '',
    active: false
  });

  // TODO consider removing these and simplifying the vars tracking UI state
  private startTimeArr = [];
  private stopTimeArr = [];

  private storeSubscription$: Subscription;
  private timer: NodeJS.Timer;

  constructor(
    private readonly monerodControl: MonerodControllerService,
    private widgetStore: WidgetStateStoreService,
    private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    // TODO move this startup logic to a start / stop method toggled by widget wrapper checkbox

    this.storeSubscription$ = this.widgetStore.getMyWidgetState(this.widgetName)
      .subscribe((data: TimerState) => {
        if (data) {
          this.stateSubject.next(data);
          this.timerForm.patchValue(data);

          if (data.startTime) {
            this.startTimeArr = data.startTime.split(':');
          }

          if (data.stopTime) {
            this.stopTimeArr = data.stopTime.split(':');
          }

          if (data.active === true) {
            this.startTimer();
          } else {
            this.stopTimer();
          }
        }
      });

    this.timerForm.valueChanges.subscribe(() => {
      this.updateState();
    });
  }

  ngOnDestroy(): void {
    this.storeSubscription$.unsubscribe();
    this.stateSubject.unsubscribe();
  }

  updateState() {
    this.widgetStore.updateMyWidgetState(this.timerForm.value, this.widgetName);
  }

  // When timer enabled, check every 58 seconds to see if current time matches start/stop times
  private startTimer(): void {
    this.timer = setInterval(() => {
      this.checkTime();
    }, 1000 * 58);
  };

  private stopTimer(): void {
    clearInterval(this.timer);
  }

  private checkTime(): void {
    const currentDate = new Date(1980, 1, 1,  new Date().getHours(), new Date().getMinutes());
    const startDate = new Date(1980, 1, 1, this.startTimeArr[0], this.startTimeArr[1]);
    const stopDate = new Date(1980, 1, 1, this.stopTimeArr[0], this.stopTimeArr[1]);

    if (currentDate.getTime() === startDate.getTime()) {
      this.monerodControl.start();
    } else if (currentDate.getTime() === stopDate.getTime()) {
      this.monerodControl.stop();
    }
  }
}
