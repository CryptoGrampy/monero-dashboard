import ElectronStore from 'electron-store';
import { WidgetStateStore, WidgetState } from './enums';


export class WidgetStoreService {
  private readonly store = new ElectronStore<WidgetStateStore>();

  // Retrieves filepath from electron-store
  public getWidgetStateStore(): WidgetStateStore {
    return this.store.get('widget-store');
  }


  public setWidgetStateStore(updatedState: WidgetState): void {
    const storeName = Object.keys(updatedState)[0];
    return this.store.set(`widget-store.${storeName}`, updatedState[storeName]);
  }
}
