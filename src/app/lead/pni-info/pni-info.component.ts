import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ErrorActions from '@app/store/actions/error.actions';
import { PostLeadAction, SavePNIData } from '@app/store/actions/lead.actions';
import * as LoaderActions from '@app/store/actions/loader.actions';
import { Lead } from '@app/store/models/lead.model';
import { leadSelector } from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { TypeListService } from '@services/type-list.service';
import { Subscription, zip } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'verti-pni-info',
    templateUrl: './pni-info.component.html'
})
export class PniInfoComponent implements OnInit, AfterViewInit, OnDestroy {
    maritalStatusForm: FormGroup;
    id: any;

    maritalStatusForm$: Subscription;
    leadSub: Subscription;
    loaderSubscription: Subscription;

    maritalStatusOptions: any;
    loaderStopped: boolean;
    maritalStatusObj: any;
    options;
    constructor(
        private fb: FormBuilder,
        private store: Store<any>,
        private navService: NavigationService,
        private dataLayerService: DataLayerService,
        private typeListService: TypeListService
    ) {}

    ngOnInit() {
        this.maritalStatusForm = this.fb.group({
            maritalStatusCode: ['', Validators.required]
        });

        this.store.dispatch(new LoaderActions.StartLoaderAction());
        zip(this.store.select(leadSelector), this.typeListService.getMaritalStatusOptions())
            .pipe(take(1))
            .subscribe(
                ([lead, options]) => {
                    this.store.dispatch(new LoaderActions.StopLoaderAction());
                    this.maritalStatusForm.patchValue(lead);
                    this.options = options;
                    this.onMaritalStatusChange({ selected: { maritalStatusCode: lead.maritalStatusCode } });
                },
                _err => {
                    const customError = {
                        code: 600,
                        message: 'Service Failure/down'
                    };
                    this.store.dispatch(new ErrorActions.SetErrorAction(customError));
                    this.store.dispatch(new LoaderActions.StopLoaderAction());
                    this.navService.gotoRouteByName('systemfailure');
                }
            );
    }

    ngAfterViewInit() {
        this.navService.upDateMarketingData();
    }

    onMaritalStatusChange(formData) {
        this.maritalStatusObj = formData.selected;
        this.maritalStatusObj.maritalStatusValue = this.getMaritalStatusValue(formData);
    }
    saveAndNavigate() {
        this.dataLayerService.pushToDataLayer({
            marital_status: this.maritalStatusObj.maritalStatusValue
        });
        this.store.dispatch(new SavePNIData(this.maritalStatusObj));
        this.loaderStopped = false;
        this.leadSub = this.store
            .select(leadSelector)
            .pipe(take(1))
            .subscribe((leadData: Lead) => {
                this.store.dispatch(new PostLeadAction(leadData));
            });

        this.loaderSubscription = this.store
            .select(state => state.loader.isLoading)
            .subscribe(loading => {
                if (!loading && !this.loaderStopped) {
                    if (this.leadSub) {
                        this.leadSub.unsubscribe();
                    }

                    this.loaderStopped = true;
                    this.navService.navigate();
                }
            });
    }
    getMaritalStatusValue(data): string {
        if (data && this.options) {
            const maritalStatusArr = this.options.filter(
                item => item.code.trim() === data.selected.maritalStatusCode.trim()
            );
            return maritalStatusArr && maritalStatusArr.length ? maritalStatusArr[0].name : '';
        }

        return '';
    }

    ngOnDestroy() {
        if (this.maritalStatusForm$) {
            this.maritalStatusForm$.unsubscribe();
        }

        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }

        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
    }
}
