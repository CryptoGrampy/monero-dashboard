import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
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

  private storeSubscription$: Subscription;
  private timer: NodeJS.Timer;

  constructor(
    private readonly monerodControl: MonerodControllerService,
    private widgetStore: WidgetStateStoreService,
    private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.storeSubscription$ = this.widgetStore.getMyWidgetState(this.widgetName)
      .pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((data: TimerState) => {
        if (data) {
          this.stateSubject.next(data);
          this.timerForm.patchValue(data);
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
    console.log('updating widget state');
    this.widgetStore.updateMyWidgetState(this.timerForm.value, this.widgetName);
  }

  private startTimer(): void {
    this.timer = setInterval(() => {

    }, 1000 * 50);
  };

  private checkTime(): void {
    const currentTime = new Date();

//   const t = new Date()
//  const s = t.getHours() + ':' + t.getMinutes()
//  currentTime.now = s
//  if (s === currentTimer.onTime) {
//    console.log('Turning on Monerod')
//    monerodSwitch(true)
//  } else if (s === currentTimer.offTime) {
//    console.log('Turning off Monerod')
//    monerodSwitch(false)
//  }
// }, 55*1000)
}
}
