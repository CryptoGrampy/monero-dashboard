import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Widget } from '../../../enums/enum';
import { WidgetStateStoreService } from '../../../services/widget-state-store/widget-state-store.service';

interface TimerState {
  on?: string;
  off?: string;
  active?: boolean;
}

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  public widgetName = Widget.TIMER_STORE;
  public timerState: TimerState = {
    on: null,
    off: null,
    active: false
  };

  constructor(private router: Router, private widgetStore: WidgetStateStoreService) {
  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.widgetStore.getMyWidgetState(this.widgetName).subscribe((data: TimerState) => {
      this.timerState = data;
    });
  }

  updateState() {
    this.widgetStore.updateMyWidgetState(this.timerState, this.widgetName);
  }

  toggleState() {
    const current = this.timerState.active;
    this.timerState.active = !current;
  }

}
