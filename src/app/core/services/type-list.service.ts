import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, of, zip } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';

export abstract class TypeListService {
    abstract getMaritalStatusOptions(): Observable<TypeListOption[]>;
    abstract getLicenseTypelistOptions(): Observable<LicenseTypelistOptions>;
    abstract getRelationshipOptions(): Observable<TypeListOption[]>;
    abstract getDiscountTypes(): Observable<TypeListOption[]>;
    abstract getYearsInsuredExtOptions(): Observable<TypeListOption[]>;
    abstract getPriorPolicyLimitsExtOptions(): Observable<TypeListOption[]>;
    abstract getLastActiveInsuranceExtOptions(): Observable<TypeListOption[]>;
    abstract getAntiTheftOptions(): Observable<TypeListOption[]>;
}
enum TypeList {
    License = 'license',
    Relationship = 'relationship',
    Discounts = 'discounts',
    YearsInsuredExt = 'yearsInsuredExt',
    PriorPolicyLimitsExt = 'priorPolicyLimitsExt',
    // LapsePeriodExt = 'lapsePeriodExt'
    LastActiveInsuranceExt = 'lastActiveInsuranceExt',
    AntiTheft = 'AntiTheft'
}

@Injectable()
export class TypeListServiceImpl extends TypeListService {
    readonly typelistUrl = environment.nodeserver + 'products/typeList';

    readonly MAX_CACHE_TIME = 1000 * 60 * 5;

    readonly cache: Cache = {
        [TypeList.License]: {},
        [TypeList.Relationship]: {},
        [TypeList.Discounts]: {},
        [TypeList.YearsInsuredExt]: {},
        [TypeList.PriorPolicyLimitsExt]: {},
        // [TypeList.LapsePeriodExt]: {}
        [TypeList.LastActiveInsuranceExt]: {},
        [TypeList.AntiTheft]: {}
    };

    constructor(private httpClient: HttpClient) {
        super();
    }

    // ======================= MaritalStatus ======================= //

    public getMaritalStatusOptions(): Observable<TypeListOption[]> {
        return this.httpClient
            .get<TypeListOption[]>(this.typelistUrl, {
                params: this.getTypelistParams('MaritalStatus')
            })
            .pipe(catchError(err => this.getTypelistFallBack(err, 'assets/data/marital_status.json')));
    }
    // ======================= AntiTheft ======================= //

    public getAntiTheftOptions(): Observable<TypeListOption[]> {
        return this.requestTypeList(TypeList.AntiTheft, 'AntiTheft', 'assets/data/years-insured.json');
    }

    // ======================= InsuranceCoverage ======================= //

    public getYearsInsuredExtOptions(): Observable<TypeListOption[]> {
        return this.requestTypeList(TypeList.YearsInsuredExt, 'YearsInsuredExt', 'assets/data/years-insured.json');
    }
    public getPriorPolicyLimitsExtOptions(): Observable<TypeListOption[]> {
        return this.requestTypeList(
            TypeList.PriorPolicyLimitsExt,
            'PriorPolicyLimitsExt',
            'assets/data/priorpolicy-limits.json'
        );
    }
    public getLastActiveInsuranceExtOptions(): Observable<TypeListOption[]> {
        return this.requestTypeList(
            TypeList.LastActiveInsuranceExt,
            'LastActiveInsuranceExt',
            'assets/data/lapse-period.json'
        );
    }

    // ======================= LICENSE ======================= //

    public getLicenseTypelistOptions(): Observable<LicenseTypelistOptions> {
        const listNameToTypeName: { [key in keyof LicenseTypelistOptions]: string } = {
            stateList: 'Jurisdiction',
            statusList: 'DriverStatusExt',
            yearList: 'YearsLicensedExt'
        };
        const listNameToFallbackUrl: { [key in keyof LicenseTypelistOptions]: string } = {
            stateList: 'assets/data/us-states.json',
            statusList: 'assets/data/license-status.json',
            yearList: 'assets/data/license-years.json'
        };

        return this.requestTypeList(TypeList.License, listNameToTypeName, listNameToFallbackUrl) as Observable<
            LicenseTypelistOptions
        >;
    }

    // ======================= RELATIONSHIP ======================= //

    public getRelationshipOptions(): Observable<TypeListOption[]> {
        return this.requestTypeList(TypeList.Relationship, 'Relationship', 'assets/data/relationships.json');
    }
    // ======================= DISCOUNT ======================= //

    public getDiscountTypes(): Observable<TypeListOption[]> {
        return this.requestTypeList(TypeList.Discounts, 'DiscountDisplayListExt', 'assets/data/discounts.json');
    }

    // ======================= COMMON ======================= //

    private getTypelistParams(...typeLists: string[]): HttpParams {
        let params = '';
        for (const typeList of typeLists) {
            if (params) {
                params += '+';
            }
            params += typeList;
        }

        return new HttpParams().set('typeList', params.replace(/\+/gi, '%2B'));
    }

    private requestTypeList(
        type: TypeList,
        listNameToTypeName: { [key: string]: string },
        listNameToFallbackUrl?: { [key: string]: string }
    ): Observable<TypeListOptions>;
    private requestTypeList(type: TypeList, typeNames: string, fallbackUrl?: string): Observable<TypeListOption[]>;

    private requestTypeList(
        type: TypeList,
        typeNames: string | { [key: string]: string },
        fallbackUrl?: string | { [key: string]: string }
    ): Observable<TypeListOption[] | TypeListOptions> {
        let obs: Observable<TypeListOption[] | TypeListOptions> = this.getCacheValue(type);
        const singleType = typeof typeNames === 'string';

        if (!obs) {
            const params = singleType
                ? this.getTypelistParams(typeNames as string)
                : this.getTypelistParams(...Object.keys(typeNames).map(key => typeNames[key]));

            obs = this.httpClient.get<TypeListResponseItem[]>(this.typelistUrl, { params }).pipe(
                retry(2),
                map((res: TypeListResponseItem[]) =>
                    singleType
                        ? this.mapResponseToTypeList(res)
                        : this.mapResponseToTypeLists(res, typeNames as { [key: string]: string })
                ),
                tap(options => this.setCacheValue(type, options)),
                fallbackUrl
                    ? catchError(err =>
                          singleType
                              ? this.getTypelistFallBack(err, fallbackUrl as string)
                              : this.getTypelistsFallBack(err, fallbackUrl as { [key: string]: string })
                      )
                    : (obs$: Observable<TypeListOption[] | TypeListOptions>) => obs$
            );
        }

        return obs;
    }

    private mapResponseToTypeList(res: TypeListResponseItem[]): TypeListOption[] {
        if (res && res.length && res[0].typeKeys) {
            return res[0].typeKeys;
        }
        throw new Error('Unable to parse response to type list');
    }

    private mapResponseToTypeLists(
        res: TypeListResponseItem[],
        listNameToTypeName: { [key: string]: string }
    ): TypeListOptions {
        const listNames = Object.keys(listNameToTypeName);
        const retObj = {};

        for (const listName of listNames) {
            const typeName = listNameToTypeName[listName];
            const resItem = res.find(option => option.name === typeName);
            if (resItem) {
                retObj[listName] = resItem.typeKeys;
                continue;
            }
            throw new Error('Unable to parse response to type list');
        }

        return retObj;
    }

    private getTypelistFallBack(err: Error, url: string): Observable<TypeListOption[]> {
        // TODO handle error, maybe log
        return this.httpClient.get<TypeListOption[]>(url);
    }

    private getTypelistsFallBack(
        err: Error,
        listNameToFallbackUrl: { [key: string]: string }
    ): Observable<TypeListOptions> {
        // TODO handle error, maybe log
        const listNames = Object.keys(listNameToFallbackUrl);
        const fallbackUrls = listNames.map(name => listNameToFallbackUrl[name]);
        const fallbackObs = fallbackUrls.map(url => this.httpClient.get(url));

        return zip(...fallbackObs).pipe(
            map((lists: Array<TypeListOption[]>) => {
                const retObj: TypeListOptions = {};
                for (let i = 0; i < lists.length; ++i) {
                    retObj[listNames[i]] = lists[i];
                }

                return retObj;
            })
        );
    }

    // ======================= CACHE ======================= //

    private resetCacheTimer(type: TypeList): void {
        if (this.cache[type].timer) {
            clearTimeout(this.cache[type].timer);
        }

        this.cache[type].timer = setTimeout(_ => (this.cache[type].value = undefined), this.MAX_CACHE_TIME);
    }

    private getCacheValue(type: TypeList): Observable<TypeListOption[] | TypeListOptions> | undefined {
        if (typeof this.cache[type].value !== 'undefined') {
            this.resetCacheTimer(type);
            return of(this.cache[type].value);
        }

        return undefined;
    }

    private setCacheValue(type: TypeList, val: TypeListOption[] | TypeListOptions): void {
        this.cache[type].value = val;
        this.resetCacheTimer(type);
    }
}

type Cache = { [key in TypeList]: CacheItem };

interface CacheItem {
    value?: TypeListOption[] | TypeListOptions;
    timer?: NodeJS.Timer;
}

interface TypeListResponseItem {
    name: string;
    typeKeys: TypeListOption[];
}

export interface TypeListOptions {
    [key: string]: TypeListOption[];
}
export interface LicenseTypelistOptions extends TypeListOptions {
    stateList: TypeListOption[];
    statusList: TypeListOption[];
    yearList: TypeListOption[];
}

export interface TypeListOption {
    code: string;
    description: string;
}
