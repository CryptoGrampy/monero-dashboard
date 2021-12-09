import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { MonerodTimerComponent } from './widgets';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MonerodControllerComponent } from './widgets/monerod-controller/monerod-controller.component';
import { MonerodStatusBasicComponent } from './widgets/monerod-status-basic/monerod-status-basic.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    MonerodTimerComponent,
    DashboardComponent,
    MonerodControllerComponent,
    MonerodStatusBasicComponent
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
