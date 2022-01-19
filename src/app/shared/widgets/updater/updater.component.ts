import { ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MonerodControllerService } from '../../../services/monerod-controller/monerod-controller.service';

@Component({
  selector: 'app-updater',
  templateUrl: './updater.component.html',
  styleUrls: ['./updater.component.scss'],
})
export class UpdaterComponent implements OnInit, OnDestroy {
  public updateAvailable: boolean;
  public isOnline = false;
  public version: string;

  private subscription$: Subscription;

  constructor(
    private readonly monerodService: MonerodControllerService
  ) { }

  ngOnInit(): void {
    this.subscription$ = this.monerodService.getMoneroStatus().subscribe(statusChange => {
      this.updateAvailable = statusChange.updateAvailable;
      this.version = statusChange.version;
      this.isOnline = !statusChange.isOffline;
      console.log(statusChange.isOffline);
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public update(): void {
    this.monerodService.update();
  }
}
