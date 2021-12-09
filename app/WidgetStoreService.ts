import ElectronStore from "electron-store";
import { WidgetState, WidgetStateStore } from "../src/app/services/widget-state-store/widget-state-store.service";


export class WidgetStoreService {
  private readonly store = new ElectronStore<WidgetStateStore>()

  constructor() {}

  // Retrieves filepath from electron-store
  public getWidgetStateStore(): WidgetStateStore {
    console.log('lhey')
    return this.store.get('widget-store')
  }


  public setWidgetStateStore(updatedState: WidgetState): void {
    console.log('setting widget state store', updatedState)
    // return this.store.set('widgetStateStore'+'.'+ String(updatedState.name), {...this.getWidgetStateStore(), })
  }
}
