import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
  public test;

  testEmitter$ = new BehaviorSubject<number>(0);

  constructor(private readonly monerodService: MonerodControllerService, private changeRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscription$ = this.monerodService.getMoneroStatus().subscribe(data => {
      console.log('dat', data);
      this.test = data.adjustedTimestamp;

      console.log('test', this.test);
      this.testEmitter$.next(data.adjustedTimestamp);
      this.changeRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
