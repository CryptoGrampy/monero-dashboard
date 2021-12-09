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
  selector: 'app-monerod-timer',
  templateUrl: './monerod-timer.component.html',
  styleUrls: ['./monerod-timer.component.scss']
})
export class MonerodTimerComponent implements OnInit {
  public widgetName = Widget.MONEROD_TIMER;
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
      console.log('timer data subscription', data);
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
