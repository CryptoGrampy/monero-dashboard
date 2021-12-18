import { Injectable } from '@angular/core';
import { NodeApiList, TrayControllerCommands } from '../../../../app/enums';
import { ElectronService } from '../../core/services/electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class TrayControllerService {

  constructor(private readonly electronService: ElectronService) { }

  autostart() {
    this.electronService.saveData(NodeApiList.TRAY_CONTROLLER, TrayControllerCommands.AUTOSTART).then((data) => {
      console.log(data);
    });
  }

  stopAutostart() {
    this.electronService.saveData(NodeApiList.TRAY_CONTROLLER, TrayControllerCommands.STOP_AUTOSTART).then((data) => {
      console.log(data);
    });
  }
}
