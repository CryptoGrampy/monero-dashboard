import { Component, NgZone, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MonerodControllerService } from '../../../services/monerod-controller/monerod-controller.service';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.scss']
})
export class LotteryComponent implements OnInit {
  public status$;

  constructor(private readonly monerodService: MonerodControllerService, private readonly ngZone: NgZone) { }

  ngOnInit(): void {
    this.status$ = this.monerodService.getMoneroMiningStatus().subscribe(data => {
      this.ngZone.run(() => {
        console.log(data);
      });
    });
  }

  startMining() {
    this.monerodService.startSoloMining();
  }

  stopMining() {
    this.monerodService.stopSoloMining();
  }
}
