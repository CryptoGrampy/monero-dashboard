import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Widget } from '../../../../../app/enums';
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
  public currentState: TimerState;

  private defaultState: TimerState = {
    on: null,
    off: null,
    active: false
  };

  constructor(private router: Router, private widgetStore: WidgetStateStoreService) {
    this.currentState = this.defaultState;
  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.widgetStore.getMyWidgetState(this.widgetName).subscribe((data: TimerState) => {
      console.log('timer data subscription', data);
      if (data) {
        this.currentState = data;
      }
    });
  }

  // TODO: Add ngOnDestroy and remove all subscriptions

  updateState() {
    this.widgetStore.updateMyWidgetState(this.currentState, this.widgetName);
  }

  toggleState() {
    const current = this.currentState.active;
    this.currentState.active = !current;
  }
}
