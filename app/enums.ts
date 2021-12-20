// TODO: put these into one place
export enum IpcInvokeEnum {
  SAVE_DATA = 'save-data',
  LOAD_DATA = 'load-data'
}

export enum Widget {
  MONEROD_TIMER = 'monerod-timer',
  MONEROD_CONTROLLER = 'monerod-controller',
  DONATION = 'donation'
}

// Access keys for backend API's
export enum NodeApiList {
  WIDGET_STORE = 'widget-store',
  MONEROD_STATUS = 'monerod-status',
  MONEROD_CONTROLLER = 'monerod-controller',
  TRAY_CONTROLLER = 'tray-controller'
}

export enum MonerodControllerCommands {
  START,
  STOP
}

export enum TrayControllerCommands {
  AUTOSTART,
  STOP_AUTOSTART
}

export enum NodeStreamList {
  STREAM_CLEANUP = 'stream-cleanup',
  MONEROD_STATUS = 'monerod-status'
}

export type WidgetState = {
  [key in Widget]?: Record<string, unknown>;
};

// https://stackoverflow.com/questions/62082215/typescript-map-all-enum-values-as-key
export type WidgetStateStore = Record<Widget, Record<string, unknown>>;
