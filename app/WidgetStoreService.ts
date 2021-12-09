import ElectronStore from "electron-store";
import { WidgetState, WidgetStateStore } from "../src/app/services/widget-state-store/widget-state-store.service";


export class WidgetStoreService {
  private readonly store = new ElectronStore<WidgetStateStore>()

  constructor() {
    this.store.set('widget-store.donation-store', 'oof')
  }

  // Retrieves filepath from electron-store
  public getWidgetStateStore(): WidgetStateStore {
    return this.store.get('widget-store')
  }


  public setWidgetStateStore(updatedState: WidgetState): void {
    const storeName = Object.keys(updatedState)[0]
    return this.store.set(`widget-store.${storeName}`, updatedState[storeName])
  }
}
