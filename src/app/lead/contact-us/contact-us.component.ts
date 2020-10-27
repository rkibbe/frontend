import { Component, OnInit, OnDestroy } from '@angular/core';
import { Lead } from '@app/store/models/lead.model';
import {  take } from 'rxjs/operators';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppSettingsService } from '@services/app-settings.service';
import { AppSettings } from '@shared/settings/app-settings';
import { VERTI_CONTACT_NUMBERS } from '@app/core/constants';
@Component({
  selector: 'verti-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {
  imgSource: string;
  title: string;
  private _firstName: string;
  appSettings: AppSettings;
  contactNumber: string;
  set firstName(firstName: string) {
    this._firstName = firstName || '';
    this.title = 'Sorry, ' + this._firstName + ' we need to talk this through.';
  }

  get firstName(): string {
    return this._firstName;
  }

  leadSub: Subscription;
  constructor(
    private store: Store<any>,
    private appSettingService: AppSettingsService
  ) {
    this.imgSource = './assets/img/Fill_1.svg';
    this.firstName = '';
    this.appSettingService.getSettings().subscribe(appSettings => {
      this.appSettings = appSettings;
    });
  }
  ngOnInit() {
    this.leadSub = this.store
      .select(fromStore.leadSelector)
      .pipe(take(1))
      .subscribe((leadData: Lead) => {
        this.firstName = leadData.firstName;
      });
    this.contactNumber = VERTI_CONTACT_NUMBERS.CONTACTUS;
  }
  ngOnDestroy() {
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
  }
}



