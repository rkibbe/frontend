import { Component, OnInit } from '@angular/core';
import {  FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/reducers';
import { NavigationService } from '@app/core/services/navigation.service';
import { VehicleAddService } from '@app/core/services/vehicle-add-service';

@Component({
    selector: 'verti-contactpa',
    templateUrl: './contact-pa.component.html',
    styleUrls: ['./contact-pa.component.scss']
})
export class ContactpaComponent implements OnInit {
    imgSource: string;
    title: string;
    contactitle: string;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private store: Store<AppState>,
        private navService: NavigationService,
        private activatedRoute: ActivatedRoute,
        private vehicleAddService: VehicleAddService
    ) {
        this.imgSource = './assets/img/Icon_SadRacoon.svg';
        this.contactitle = 'Sorry,';
    }

    ngOnInit() {}
}
