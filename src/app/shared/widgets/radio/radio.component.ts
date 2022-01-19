import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs';
import { Widget } from '../../../../../app/enums';
import { WidgetStateStoreService } from '../../../services/widget-state-store/widget-state-store.service';

interface RadioState {
  selectedStation: string;
}

interface RadioStation {
  displayName: string;
  url: string;
  streamSrc: string;
}

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit, OnDestroy {
  public widgetName = Widget.RADIO;
  public currentSelection: RadioStation;

  radioStations = [
    {
      name: 'xmrRadio',
      displayName: 'XMR.radio',
      url: 'https://xmr.radio',
      streamSrc: 'https://ais-edge08-live365-dal02.cdnstream.com/a64305'
    },
    {
      name: 'monerochanMoe',
      displayName: 'Monerochan.moe',
      url: 'https://monerochan.moe',
      streamSrc: 'https://nrf1.newradio.it:9522/stream'
    },
  ];

  public radioForm = this.fb.group({
    selectedStation: [],
  });

  private widgetStoreSubscription: Subscription;

  constructor(
    private readonly widgetStore: WidgetStateStoreService,
    private readonly fb: FormBuilder,
  ) { }


  ngOnInit(): void {
    this.widgetStoreSubscription = this.widgetStore.getMyWidgetState(this.widgetName)
    .pipe(
      // TODO Remove these distinctuntilchanged calls in all component
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    )
    .subscribe((state) => {
      if (state) {
        this.radioForm.patchValue(state);
        this.currentSelection = this.radioStations.find(station => station.name === state.selectedStation);
      }
    });

    this.radioForm.valueChanges.subscribe(change => {
      this.widgetStore.updateMyWidgetState(change, this.widgetName);
    });
  }

  ngOnDestroy(): void {
    this.widgetStoreSubscription.unsubscribe();
  }
}
