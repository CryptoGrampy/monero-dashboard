import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WidgetEnum, WidgetState, WidgetStoreService } from '../core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public widgetState: WidgetState = {
    name: WidgetEnum.TIMER_STORE,
    state: {
      foo:'bar'
    }
  };

  constructor(private router: Router, private widgetStore: WidgetStoreService) { }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.widgetStore.updateMyWidgetState(this.widgetState);
    this.widgetStore.getMyWidgetState(WidgetEnum.TIMER_STORE).subscribe(data => {
      console.log('hey');
      console.log(data);
    });
  }
}
