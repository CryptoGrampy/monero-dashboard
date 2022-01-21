import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonerodTimerComponent, RadioComponent } from './widgets';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonerodControllerComponent } from './widgets/monerod-controller/monerod-controller.component';
import {MatButtonModule} from '@angular/material/button';
import { MonerodStatusBasicComponent } from './widgets/monerod-status-basic/monerod-status-basic.component';
import { MonerochanSlideshowComponent } from './widgets/monerochan-slideshow/monerochan-slideshow.component';
import { KtdGridModule } from '@katoid/angular-grid-layout';
import { UpdaterComponent } from './widgets/updater/updater.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { DonationComponent } from './widgets/donation/donation.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    MonerodTimerComponent,
    DashboardComponent,
    MonerodControllerComponent,
    MonerodStatusBasicComponent,
    MonerochanSlideshowComponent,
    RadioComponent,
    UpdaterComponent,
    DonationComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    KtdGridModule,
    FormsModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressBarModule,
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
