import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Widget } from '../enums/enum';
import { WidgetState, WidgetStateStoreService } from '../services/widget-state-store/widget-state-store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public widgetUIState: WidgetState = { [Widget.TIMER_STORE]: { foo: 'bar '}};

  constructor(private router: Router, private widgetStore: WidgetStateStoreService) { }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.widgetStore.updateMyWidgetState(this.widgetUIState);
    // this.widg
    // this.widgetStore.getMyWidgetState(Widget.TIMER_STORE).subscribe(data => {
    //   console.log('next widget state', data);
    // });
  }
}
