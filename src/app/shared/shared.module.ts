import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { TimerComponent } from './widgets';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    TimerComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    DashboardComponent
  ]
})
export class SharedModule {}
