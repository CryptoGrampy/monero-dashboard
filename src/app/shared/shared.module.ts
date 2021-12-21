import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonerodTimerComponent } from './widgets';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonerodControllerComponent } from './widgets/monerod-controller/monerod-controller.component';
import {MatButtonModule} from '@angular/material/button';
import { MonerodStatusBasicComponent } from './widgets/monerod-status-basic/monerod-status-basic.component';
import { MonerochanSlideshowComponent } from './widgets/monerochan-slideshow/monerochan-slideshow.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    MonerodTimerComponent,
    DashboardComponent,
    MonerodControllerComponent,
    MonerodStatusBasicComponent,
    MonerochanSlideshowComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatButtonModule,
    BrowserAnimationsModule,
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    DashboardComponent
  ]
})
export class SharedModule {}
