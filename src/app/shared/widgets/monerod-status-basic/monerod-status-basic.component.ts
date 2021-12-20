import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs';
import { Subscription } from 'rxjs';
import { MoneroDaemonState } from '../../../../../app/MonerodService';
import { MonerodControllerService } from '../../../services/monerod-controller/monerod-controller.service';

@Component({
  selector: 'app-monerod-status-basic',
  templateUrl: './monerod-status-basic.component.html',
  styleUrls: ['./monerod-status-basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonerodStatusBasicComponent implements OnInit, OnDestroy {
  public subscription$: Subscription;

  testEmitter$ = new BehaviorSubject<Partial<MoneroDaemonState>>({
    adjustedTimestamp: 123
  });

  constructor(private readonly monerodService: MonerodControllerService, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.subscription$ = this.monerodService.getMoneroStatus().subscribe(data => {
      /**
       * TODO: for some reason rxjs async observable is happening outside ngzone.
       * the data is being subscribed to correctly, but the template is not updating with a regular
       * this.dataHolder = incomingSubscriptionData, so had to do this hacky thing :)
       */
      this.ngZone.run(() => {
        this.testEmitter$.next(data);
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
