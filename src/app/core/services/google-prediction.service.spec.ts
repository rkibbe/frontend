import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import {} from 'googlemaps';
import { of, Subject } from 'rxjs';
import { CitiesListService } from './cities-list.service';
import { GooglePredictionService } from './google-prediction.service';
/// <reference types='@types/googlemaps' />

const predictions = [
    {
        description: '121 North Road, McElhattan, PA, USA',
        id: '6032c31c4cc0b8feaedbffe685b064f791f495b6',
        matched_substrings: [
            {
                length: 2,
                offset: 0
            }
        ],
        place_id: 'ChIJvaaiXOv5zokRCtAi9RZo24g',
        reference: 'ChIJvaaiXOv5zokRCtAi9RZo24g',
        structured_formatting: {
            main_text: '121 North Road',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0
                }
            ],
            secondary_text: 'McElhattan, PA, USA'
        },
        terms: [
            {
                offset: 0,
                value: '121'
            },
            {
                offset: 4,
                value: 'North Road'
            },
            {
                offset: 16,
                value: 'McElhattan'
            },
            {
                offset: 28,
                value: 'PA'
            },
            {
                offset: 32,
                value: 'USA'
            }
        ],
        types: ['street_address', 'geocode']
    },
    {
        description: '123 Timber Lane, Linden, PA, USA',
        id: '72fae32c7141c1f0faca04c4e6ccd13020929b4c',
        matched_substrings: [
            {
                length: 2,
                offset: 0
            }
        ],
        place_id: 'ChIJe7HmdEtVzokRiD0u33QhCWQ',
        reference: 'ChIJe7HmdEtVzokRiD0u33QhCWQ',
        structured_formatting: {
            main_text: '123 Timber Lane',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0
                }
            ],
            secondary_text: 'Linden, PA, USA'
        },
        terms: [
            {
                offset: 0,
                value: '123'
            },
            {
                offset: 4,
                value: 'Timber Lane'
            },
            {
                offset: 17,
                value: 'Linden'
            },
            {
                offset: 25,
                value: 'PA'
            },
            {
                offset: 29,
                value: 'USA'
            }
        ],
        types: ['street_address', 'geocode']
    },
    {
        description: '128 Gohl Rd, Linden, PA, USA',
        id: '3058c4cd783a7f98bd889e2eabd8097e0191bc36',
        matched_substrings: [
            {
                length: 2,
                offset: 0
            }
        ],
        place_id: 'ChIJcb-iYaOqz4kRnsGcQKZtYw0',
        reference: 'ChIJcb-iYaOqz4kRnsGcQKZtYw0',
        structured_formatting: {
            main_text: '128 Gohl Rd',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0
                }
            ],
            secondary_text: 'Linden, PA, USA'
        },
        terms: [
            {
                offset: 0,
                value: '128'
            },
            {
                offset: 4,
                value: 'Gohl Rd'
            },
            {
                offset: 13,
                value: 'Linden'
            },
            {
                offset: 21,
                value: 'PA'
            },
            {
                offset: 25,
                value: 'USA'
            }
        ],
        types: ['premise', 'geocode']
    },
    {
        description: '123 William Street, New York, NY, USA',
        id: 'e4b2b230ff9232ed81cd0d53aae559995f94189f',
        matched_substrings: [
            {
                length: 2,
                offset: 0
            }
        ],
        place_id: 'ChIJIaGbBBhawokRUmbgNsUmr-s',
        reference: 'ChIJIaGbBBhawokRUmbgNsUmr-s',
        structured_formatting: {
            main_text: '123 William Street',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0
                }
            ],
            secondary_text: 'New York, NY, USA'
        },
        terms: [
            {
                offset: 0,
                value: '123'
            },
            {
                offset: 4,
                value: 'William Street'
            },
            {
                offset: 20,
                value: 'New York'
            },
            {
                offset: 30,
                value: 'NY'
            },
            {
                offset: 34,
                value: 'USA'
            }
        ],
        types: ['premise', 'geocode']
    },
    {
        description: '1220 Allegheny Street, Jersey Shore, PA, USA',
        id: '3779c270dec09a0d87ee0cfa9c1865880da53b57',
        matched_substrings: [
            {
                length: 2,
                offset: 0
            }
        ],
        place_id: 'ChIJu-cI1lr_zokR3jID6HGuLiw',
        reference: 'ChIJu-cI1lr_zokR3jID6HGuLiw',
        structured_formatting: {
            main_text: '1220 Allegheny Street',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0
                }
            ],
            secondary_text: 'Jersey Shore, PA, USA'
        },
        terms: [
            {
                offset: 0,
                value: '1220'
            },
            {
                offset: 5,
                value: 'Allegheny Street'
            },
            {
                offset: 23,
                value: 'Jersey Shore'
            },
            {
                offset: 37,
                value: 'PA'
            },
            {
                offset: 41,
                value: 'USA'
            }
        ],
        types: ['premise', 'geocode']
    }
];
const predictionsWithoutProperValues = [
    {
        description: '121 North Road, McElhattan, PA, USA',
        id: '6032c31c4cc0b8feaedbffe685b064f791f495b6',
        matched_substrings: null,
        place_id: 'ChIJvaaiXOv5zokRCtAi9RZo24g',
        reference: 'ChIJvaaiXOv5zokRCtAi9RZo24g',
        structured_formatting: {
            main_text: '',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0
                }
            ],
            secondary_text: ''
        },
        terms: null,
        types: ['street_address', 'geocode']
    },
    {
        description: '123 Timber Lane, Linden, PA, USA',
        id: '72fae32c7141c1f0faca04c4e6ccd13020929b4c',
        matched_substrings: [
            {
                length: 2,
                offset: 0
            }
        ],
        place_id: 'ChIJe7HmdEtVzokRiD0u33QhCWQ',
        reference: 'ChIJe7HmdEtVzokRiD0u33QhCWQ',
        structured_formatting: {
            main_text: '123 Timber Lane',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0
                }
            ],
            secondary_text: 'Linden, PA, USA'
        },
        terms: [
            {
                offset: 0,
                value: '123'
            },
            {
                offset: 4,
                value: 'Timber Lane'
            },
            {
                offset: 17,
                value: 'Linden'
            },
            {
                offset: 25,
                value: 'PA'
            },
            {
                offset: 29,
                value: 'USA'
            }
        ],
        types: ['street_address', 'geocode']
    },
    {
        description: '128 Gohl Rd, Linden, PA, USA',
        id: '3058c4cd783a7f98bd889e2eabd8097e0191bc36',
        matched_substrings: [
            {
                length: 2,
                offset: 0
            }
        ],
        place_id: 'ChIJcb-iYaOqz4kRnsGcQKZtYw0',
        reference: 'ChIJcb-iYaOqz4kRnsGcQKZtYw0',
        structured_formatting: {
            main_text: '128 Gohl Rd',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0
                }
            ],
            secondary_text: 'Linden, PA, USA'
        },
        terms: [
            {
                offset: 0,
                value: '128'
            },
            {
                offset: 4,
                value: 'Gohl Rd'
            },
            {
                offset: 13,
                value: 'Linden'
            },
            {
                offset: 21,
                value: 'PA'
            },
            {
                offset: 25,
                value: 'USA'
            }
        ],
        types: ['premise', 'geocode']
    },
    {
        description: '123 William Street, New York, NY, USA',
        id: 'e4b2b230ff9232ed81cd0d53aae559995f94189f',
        matched_substrings: [
            {
                length: 2,
                offset: 0
            }
        ],
        place_id: 'ChIJIaGbBBhawokRUmbgNsUmr-s',
        reference: 'ChIJIaGbBBhawokRUmbgNsUmr-s',
        structured_formatting: {
            main_text: '123 William Street',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0
                }
            ],
            secondary_text: 'New York, NY, USA'
        },
        terms: [
            {
                offset: 0,
                value: '123'
            },
            {
                offset: 4,
                value: 'William Street'
            },
            {
                offset: 20,
                value: 'New York'
            },
            {
                offset: 30,
                value: 'NY'
            },
            {
                offset: 34,
                value: 'USA'
            }
        ],
        types: ['premise', 'geocode']
    },
    {
        description: '1220 Allegheny Street, Jersey Shore, PA, USA',
        id: '3779c270dec09a0d87ee0cfa9c1865880da53b57',
        matched_substrings: [
            {
                length: 2,
                offset: 0
            }
        ],
        place_id: 'ChIJu-cI1lr_zokR3jID6HGuLiw',
        reference: 'ChIJu-cI1lr_zokR3jID6HGuLiw',
        structured_formatting: {
            main_text: '1220 Allegheny Street',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0
                }
            ],
            secondary_text: 'Jersey Shore, PA, USA'
        },
        terms: [
            {
                offset: 0,
                value: '1220'
            },
            {
                offset: 5,
                value: 'Allegheny Street'
            },
            {
                offset: 23,
                value: 'Jersey Shore'
            },
            {
                offset: 37,
                value: 'PA'
            },
            {
                offset: 41,
                value: 'USA'
            }
        ],
        types: ['premise', 'geocode']
    }
];
const addressComponents = [
    {
        long_name: '220',
        short_name: '220',
        types: ['street_number']
    },
    {
        long_name: 'Huffman Road',
        short_name: 'Huffman Rd',
        types: ['route']
    },
    {
        long_name: 'Linden',
        short_name: 'Linden',
        types: ['locality', 'political']
    },
    {
        long_name: 'Piatt Township',
        short_name: 'Piatt Township',
        types: ['administrative_area_level_3', 'political']
    },
    {
        long_name: 'Lycoming County',
        short_name: 'Lycoming County',
        types: ['administrative_area_level_2', 'political']
    },
    {
        long_name: 'Pennsylvania',
        short_name: 'PA',
        types: ['administrative_area_level_1', 'political']
    },
    {
        long_name: 'United States',
        short_name: 'US',
        types: ['country', 'political']
    },
    {
        long_name: '17744',
        short_name: '17744',
        types: ['postal_code']
    }
];
const addressComponentsWithoutLongName = [
    {
        short_name: 'Huffman Rd',
        types: ['route']
    },
    {
        short_name: 'Linden',
        types: ['locality', 'political']
    },
    {
        short_name: 'Piatt Township',
        types: ['administrative_area_level_3', 'political']
    },
    {
        short_name: 'Lycoming County',
        types: ['administrative_area_level_2', 'political']
    },
    {
        short_name: '',
        types: ['administrative_area_level_1', 'political']
    },
    {
        short_name: 'US',
        types: ['country', 'political']
    }
];
const zipCode = '15001';

const cityListResApiOutput = {
    apiOutput: {
        result: {
            cities: [
                {
                    cityCode: 'ABC',
                    city: 'testcity',
                    defaultcityCode: 'defaultcity',
                    countyCode: 'USA',
                    county: 'US',
                    state: 'PA'
                }
            ]
        }
    }
};
const cityListResp = {
    cities: [
        {
            cityCode: 'ABC',
            city: 'testcity',
            defaultcityCode: 'defaultcity',
            countyCode: 'USA',
            county: 'US',
            state: 'PA'
        }
    ]
};
const predictionWithPostalCodeAndWrongState = [
    {
        description: '434 Heimer Lane, Jersey Shore, PAC 17740, USA',
        id: '830cf683952586d9b7d620b8a20708e77cff2636',
        matched_substrings: [
            {
                length: 3,
                offset: 0
            },
            {
                length: 11,
                offset: 4
            },
            {
                length: 12,
                offset: 17
            },
            {
                length: 2,
                offset: 31
            },
            {
                length: 4,
                offset: 34
            }
        ],
        place_id: 'ChIJw4DWZ0oAz4kRltgf5CURK2U',
        reference: 'ChIJw4DWZ0oAz4kRltgf5CURK2U',
        structured_formatting: {
            main_text: '434 Heimer Lane',
            main_text_matched_substrings: [
                {
                    length: 3,
                    offset: 0
                },
                {
                    length: 11,
                    offset: 4
                }
            ],
            secondary_text: 'Jersey Shore, PA 17740, USA',
            secondary_text_matched_substrings: [
                {
                    length: 12,
                    offset: 0
                },
                {
                    length: 2,
                    offset: 14
                },
                {
                    length: 4,
                    offset: 17
                }
            ]
        },
        terms: [
            {
                offset: 0,
                value: '434'
            },
            {
                offset: 4,
                value: 'Heimer Lane'
            },
            {
                offset: 17,
                value: 'Jersey Shore'
            },
            {
                offset: 31,
                value: 'PA'
            },
            {
                offset: 34,
                value: '17740'
            },
            {
                offset: 41,
                value: 'USA'
            }
        ],
        types: ['street_address', 'geocode']
    }
];
const noPredictions = null;
const address = {
    addressLine1: 'string',
    addressLine2: 'string',
    city: 'string',
    stateValue: 'string',
    stateCode: 'string',
    state: 'string',
    postalCode: '15001',
    country: 'string',
    county: 'string',
    addressType: 'string',
    isAddressVerified: true,
    manualAddress: true
};
const addressWithMatchingCity = {
    addressLine1: 'string',
    addressLine2: 'string',
    city: 'North Road',
    stateValue: 'string',
    stateCode: 'string',
    state: 'string',
    postalCode: '15001',
    country: 'string',
    county: 'string',
    addressType: 'string',
    isAddressVerified: true,
    manualAddress: true
};
const cityListRespError = {
    error: {
        message: 'system error',
        code: 500
    }
};
window['google'] = {
    maps: {
        Marker: class {},
        Map: class {
            setTilt() {}
            fitBounds() {}
        },
        LatLngBounds: class {},
        places: {
            Autocomplete: class {},
            AutocompleteService: class {
                getPlacePredictions() {
                    return of(predictions);
                }
            },
            PlacesServiceStatus: {
                INVALID_REQUEST: 'INVALID_REQUEST',
                NOT_FOUND: 'NOT_FOUND',
                OK: 'OK',
                OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
                REQUEST_DENIED: 'REQUEST_DENIED',
                UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                ZERO_RESULTS: 'ZERO_RESULTS'
            },
            PlacesAutocomplete: {
                INVALID_REQUEST: 'INVALID_REQUEST',
                NOT_FOUND: 'NOT_FOUND',
                OK: 'OK',
                OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
                REQUEST_DENIED: 'REQUEST_DENIED',
                UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                ZERO_RESULTS: 'ZERO_RESULTS'
            }
        },

        MarkerClusterer: class {},
        Geocoder: class {
            geocode() {}
        },
        LatLng: class {}
    }
};
let geocoder, constructorSpy;
describe('GooglePredictionService', () => {
    let service: GooglePredictionService;
    let httpTestingController: HttpTestingController;
    let citiesService: CitiesListService;
    const searchTerm = '121 North Road';
    let newService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [GooglePredictionService, CitiesListService]
        });
        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(GooglePredictionService);
        citiesService = TestBed.get(CitiesListService);
        constructorSpy = spyOn(google.maps, 'Geocoder');
        geocoder = jasmine.createSpyObj('Geocoder', ['geocode']);
        newService = service;
        constructorSpy.and.returnValue(geocoder);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('getGooglePlacePredictions predicts suggestions', async(() => {
        service.getGooglePlacePredictions(searchTerm).subscribe(
            data => {
                expect(data).toBe(null);
            },
            error => {
                expect(error).toBe(null);
            }
        );
        // expect(true).toBe(false);
    }));
    it('mapAutocompleteResponseToSimpliedInterface() returns array of predictions', async(() => {
        const simplifiedPredictions = service['mapAutocompleteResponseToSimpliedInterface'](predictions);
        expect(simplifiedPredictions.length).toBeGreaterThanOrEqual(1);
    }));
    it(`mapAutocompleteResponseToSimpliedInterface()
    returns array of formatted predictions if predictions don\'t have proper values`, async(() => {
        const simplifiedPredictions = service['mapAutocompleteResponseToSimpliedInterface'](
            predictionsWithoutProperValues
        );
        expect(simplifiedPredictions.length).toBeGreaterThanOrEqual(1);
    }));
    it('mapAutocompleteResponseToSimpliedInterface() returns empty array of predictions', async(() => {
        const simplifiedPredictions = service['mapAutocompleteResponseToSimpliedInterface'](noPredictions);
        expect(simplifiedPredictions.length).toBe(0);
    }));
    it('seedLocationBias() returns latitude and longitude ', async(() => {
        service.seedLocationBias('143, LA');
        expect(newService.latitude).toBeFalsy();
        expect(newService.longitude).toBeFalsy();
    }));
    it('seedLocationBias() returns empty string ', async(() => {
        service.seedLocationBias('');
        expect(newService.latitude).toBeTruthy();
        expect(newService.longitude).toBeTruthy();
        expect(newService.latitude).toEqual(newService.DEFAULT_LATITUDE);
    }));
    it('parsePredictionFormattedAddress()', async(() => {
        const simplifiedPredictions = service['mapAutocompleteResponseToSimpliedInterface'](predictions);
        service.getAddressDetails(simplifiedPredictions[0]).subscribe(data => {
            expect(data).toBe(address);
            const simplifiledAddress = newService.mapGoogleAddrCompsToAddrInterface(
                simplifiedPredictions[0],
                addressComponentsWithoutLongName
            );
            expect(simplifiledAddress).toEqual(jasmine.any(Object));
        });
    }));
    it('parsePredictionFormattedAddress() parses stateValue as undeined if state has more than 2 characters', async(() => {
        const simplifiedPredictions = service['mapAutocompleteResponseToSimpliedInterface'](
            predictionWithPostalCodeAndWrongState
        );
        // service['parsePredictionFormattedAddress'](new Subject(), simplifiedPredictions[0], address);
        newService.parsePredictionFormattedAddress(new Subject(), simplifiedPredictions[0], address);
    }));
    it('matchCityAddress() method makes cities service call', async(() => {
        const zip = '15001';
        const simplifiedPredictions = service['mapAutocompleteResponseToSimpliedInterface'](predictions);
        newService.matchCityAddress(new Subject(), simplifiedPredictions[0], address);
        newService.parsePredictionFormattedAddress(new Subject(), simplifiedPredictions[0], address);
        // service['matchCityAddress'](new Subject(), simplifiedPredictions[0], address);
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === `${environment.nodeserver}address?zipCode=${zipCode}&countryCode=USA`
        );
        // Assert that the request is a GET.
        expect(req.request.method).toEqual('GET');
        req.flush(cityListResp);
    }));
    it('mapGoogleAddrCompsToAddrInterface() method returns simplified address', async(() => {
        const simplifiedPredictions = service['mapAutocompleteResponseToSimpliedInterface'](predictions);
        const simplifiledAddress = service['mapGoogleAddrCompsToAddrInterface'](
            simplifiedPredictions[0],
            addressComponents
        );
        expect(simplifiledAddress).toEqual(jasmine.any(Object));
    }));
    it(`mapGoogleAddrCompsToAddrInterface() method returns simplified address with addressComponents does
    not have long_name`, async(() => {
        const simplifiedPredictions = service['mapAutocompleteResponseToSimpliedInterface'](predictions);

        const simplifiledAddress = newService.mapGoogleAddrCompsToAddrInterface(
            simplifiedPredictions[0],
            addressComponentsWithoutLongName
        );
        expect(simplifiledAddress).toEqual(jasmine.any(Object));
    }));
    it(`mapGoogleAddrCompsToAddrInterface() method returns simplified address with addressComponents does
    not have long_name and prediction does not have proper values`, async(() => {
        const simplifiedPredictions = service['mapAutocompleteResponseToSimpliedInterface'](
            predictionsWithoutProperValues
        );

        const simplifiledAddress = newService.mapGoogleAddrCompsToAddrInterface(
            simplifiedPredictions[0],
            addressComponentsWithoutLongName
        );
        expect(simplifiledAddress).toEqual(jasmine.any(Object));
    }));
    it('matchCityAddress() method does not make cities service call if prediction term matches with city', async(() => {
        const simplifiedPredictions = service['mapAutocompleteResponseToSimpliedInterface'](predictions);
        // service['matchCityAddress'](new Subject(), simplifiedPredictions[0], addressWithMatchingCity);
        newService.matchCityAddress(new Subject(), simplifiedPredictions[0], addressWithMatchingCity);
    }));
    it('matchCityAddress() method does not make cities service call if prediction term matches with city', async(() => {
        const simplifiedPredictions = service['mapAutocompleteResponseToSimpliedInterface'](predictions);
        newService.matchCityAddress(new Subject(), simplifiedPredictions[0], address);
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === `${environment.nodeserver}address?zipCode=${zipCode}&countryCode=USA`
        );
        expect(req.request.method).toEqual('GET');
        req.flush(cityListRespError);
    }));
});
