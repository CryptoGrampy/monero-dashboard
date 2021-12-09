import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monerod-status-basic',
  templateUrl: './monerod-status-basic.component.html',
  styleUrls: ['./monerod-status-basic.component.scss']
})
export class MonerodStatusBasicComponent implements OnInit {
  monerodStatus = {
    online: true,
    p2pConnections: 4,
    rpcConnections: 6,
    syncPercentage: 20,
    status: 'isSyncing'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
