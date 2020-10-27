import { Injectable, NgZone } from '@angular/core';
import { } from 'googlemaps';
import { Observable, Subscriber } from 'rxjs';
import { Address } from '@app/store/models/lead.model';
import { CitiesListService } from './cities-list.service';
import { environment } from '@env/environment';
/// <reference types="@types/googlemaps" />

type AutocompleteService = google.maps.places.AutocompleteService;
type Geocoder = google.maps.Geocoder;
type AutocompletePrediction = google.maps.places.AutocompletePrediction;
type PlacesServiceStatus = google.maps.places.PlacesServiceStatus;

@Injectable({
    providedIn: 'root'
})
export class GooglePredictionService {
    DEFAULT_LATITUDE = environment.lattitude;
    DEFAULT_LONGITUDE = environment.longitude;

    private _autoCompleteService: AutocompleteService;
    private get autoCompleteService(): AutocompleteService {
        if (!this._autoCompleteService) {
            this._autoCompleteService = new google.maps.places.AutocompleteService();
        }
        return this._autoCompleteService;
    }

    private _geocoder: Geocoder;
    private get geocoder(): Geocoder {
        if (!this._geocoder) {
            this._geocoder = new google.maps.Geocoder();
        }
        return this._geocoder;
    }

    autoCompletePrimaryAdd;
    private longitude: number;
    private latitude: number;

    constructor(private _ngZone: NgZone, private citiesService: CitiesListService) {
    }

    public getGooglePlacePredictions(search: string): Observable<GoogleAddressPrediction[]> {
        return new Observable(observer => {
            this.autoCompleteService.getPlacePredictions(
                {
                    input: search,
                    location: new google.maps.LatLng(this.latitude, this.longitude),
                    radius: 1405,
                    types: ['address'],
                    componentRestrictions: {
                        country: 'us'
                    }
                },
                (predictions: AutocompletePrediction[], status: PlacesServiceStatus) =>
                    this._ngZone.run(() => {
                        if (
                            status === google.maps.places.PlacesServiceStatus.OK ||
                            status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS
                        ) {
                            observer.next(this.mapAutocompleteResponseToSimpliedInterface(predictions));
                            observer.complete();
                        } else {
                            observer.error({
                                predictions,
                                status
                            });
                        }
                    })
            );
        });
    }

    private mapAutocompleteResponseToSimpliedInterface(
        predictions: AutocompletePrediction[]
    ): GoogleAddressPrediction[] {
        if (predictions) {
            return predictions.map(prediction => ({
                placeId: prediction.place_id,
                formattedAddress: prediction.description,
                mainText: prediction.structured_formatting.main_text || '',
                secondaryText: prediction.structured_formatting.secondary_text || '',
                matchedSubstrings: prediction.matched_substrings || [],
                terms: prediction.terms || []
            }));
        }

        return [];
    }

    public getAddressDetails(prediction: GoogleAddressPrediction): Observable<Address> {
        return new Observable<Address>(observer => {
            this.geocoder.geocode({ placeId: prediction.placeId }, (results, status) => {
                this._ngZone.run(() => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        const addrComponents = results.length && results[0].address_components;
                        if (addrComponents) {
                            const address = this.mapGoogleAddrCompsToAddrInterface(prediction, addrComponents);
                            this.matchCityAddress(observer, prediction, address);
                        } else {
                            observer.error('No address components returned with OK status');
                        }
                    } else {
                        observer.error(`Google services returned with status: ${status}`);
                    }
                });
            });
        });
    }

    /**
     * Verifies passed address object has the same city as the one user saw from google prediction
     * (google returned address can sometimes be different)
     *
     * @param observer Subscriber to send and close
     * @param prediction Original google prediction
     * @param address Current address object
     */
    private matchCityAddress(
        observer: Subscriber<Address>,
        prediction: GoogleAddressPrediction,
        address: Address
    ): void {
        if (prediction.terms.some(term => term.value === address.city)) {
            observer.next(address);
            observer.complete();
        } else {
            this.citiesService.getCitiesList(address.postalCode).subscribe(
                cityResults => {
                    if (cityResults && cityResults['apiOutput'] && cityResults['apiOutput']['result']) {
                        const cities = cityResults['apiOutput']['result'];
                        const city = prediction.terms.find(term =>
                            cities.some(cityGroup => term.value.toLowerCase() === cityGroup.cityName.toLowerCase())
                        );
                        if (city) {
                            observer.next({
                                ...address,
                                city: city.value
                            });
                            observer.complete();
                        } else {
                            this.parsePredictionFormattedAddress(observer, prediction, address);
                        }
                    } else {
                        this.parsePredictionFormattedAddress(observer, prediction, address);
                    }
                },
                err => this.parsePredictionFormattedAddress(observer, prediction, address)
            );
        }
    }

    /**
     * Tries to parse city name from google prediction
     *
     * @param observer Subscriber to send and close
     * @param prediction Original google prediction
     * @param address Current address object
     */
    private parsePredictionFormattedAddress(
        observer: Subscriber<Address>,
        prediction: GoogleAddressPrediction,
        address: Address
    ): void {
        const addrArray = prediction.formattedAddress.split(',').map(str => str.trim());
        let postalCode = addrArray[addrArray.length - 2].replace(/[^0-9]/g, '');
        if (!postalCode) {
            postalCode = address.postalCode;
        }
        addrArray.pop();
        const state = addrArray[addrArray.length - 1].replace(/[0-9\s]/g, '');
        const city = addrArray[addrArray.length - 2].replace(/[0-9\s]/g, '');

        addrArray[addrArray.length - 1] = ' ' + state + ', ' + postalCode;
        let addressLine1 = addrArray.join(',');
        const addressArry = addressLine1.split(',').map(str => str.trim());
        addressLine1 = '';
        const addArrLength = addressArry.length;
        for (let i = 0; i < addArrLength - 3; ++i) {
            addressLine1 += addressArry[i];
            if (i !== addArrLength - 4) {
                addressLine1 += ', ';
            }
        }
        observer.next({
            ...address,
            addressLine1,
            addressLine2: '',
            city,
            state,
            postalCode
        });
        observer.complete();
    }

    public seedLocationBias(address?: string): void {
        if (address) {
            this.geocoder.geocode({ address }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    this.latitude = results[0].geometry.location.lat();
                    this.longitude = results[0].geometry.location.lng();
                } else {
                    // TODO handle err
                    this.latitude = this.DEFAULT_LATITUDE;
                    this.longitude = this.DEFAULT_LONGITUDE;
                }
            });
        } else {
            this.latitude = this.DEFAULT_LATITUDE;
            this.longitude = this.DEFAULT_LONGITUDE;
        }
    }

    private mapGoogleAddrCompsToAddrInterface(
        prediction: GoogleAddressPrediction,
        addrComponents: AddressComponent[]
    ): Address {
        const streetNum = addrComponents.find(comp => comp.types.includes('street_number'));
        const route = addrComponents.find(comp => comp.types.includes('route'));
        const city = addrComponents.find(comp => comp.types.includes('locality'));
        const county = addrComponents.find(comp => comp.types.includes('administrative_area_level_2'));
        const state = addrComponents.find(comp => comp.types.includes('administrative_area_level_1'));
        const country = addrComponents.find(comp => comp.types.includes('country'));
        const postalCode = addrComponents.find(comp => comp.types.includes('postal_code'));

        const routeName = this.getLongOrShortName(route, prediction.mainText);
        const cityName = this.getLongOrShortName(city, prediction.secondaryText);
        const countyName = this.getLongOrShortName(county, prediction.secondaryText);
        const countryName = this.getLongOrShortName(country, prediction.secondaryText);

        return {
            addressLine1: ((streetNum ? streetNum.long_name : '') + ' ' + routeName).trim() || undefined,
            addressLine2: undefined,
            city: cityName || undefined,
            county: countyName || undefined,
            state: (state && state.short_name) || undefined,
            country: countryName || undefined,
            postalCode: postalCode ? postalCode.long_name : undefined
        };
    }

    private getLongOrShortName(addrComp: AddressComponent, compStr: string): string {
        return (
            (addrComp &&
                compStr &&
                (compStr.includes(addrComp.long_name) ? addrComp.long_name : addrComp.short_name)) ||
            ''
        );
    }
}

export interface GoogleAddressPrediction {
    placeId: string;
    formattedAddress: string;
    mainText: string;
    secondaryText: string;
    matchedSubstrings: Array<{ length: number; offset: number }>;
    terms: Array<{ offset: number; value: string }>;
}

interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}
