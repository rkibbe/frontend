import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { CalltofinishComponent } from './calltofinish.component';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpRequest } from '@angular/common/http';
import { environment } from '@env/environment';

const initialState = { lead: fromStore.initialState };

describe('CalltofinishComponent', () => {
  let component: CalltofinishComponent;
  let fixture: ComponentFixture<CalltofinishComponent>;
  let httpTestingController: HttpTestingController;
  const time = {
    'workingDays': [{ 'day': 'Monday', 'isIncluded': true },
    { 'day': 'Tuesday', 'isIncluded': true }, { 'day': 'Wednesday', 'isIncluded': true },
    { 'day': 'Thursday', 'isIncluded': true }, { 'day': 'Friday', 'isIncluded': true },
    { 'day': 'Saturday', 'isIncluded': false },
    { 'day': 'Sunday', 'isIncluded': false }], 'workingHours':
      { 'startTime': '08:30', 'endTime': '19:30' }
  };
  beforeEach(() => {
    const storeStub = {
      select: leadSelector => ({ pipe: () => ({ subscribe: () => ({}) }) })
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CalltofinishComponent],
      providers: [{ provide: Store, useValue: storeStub },
      provideMockStore({ initialState })
      ]
    });
    fixture = TestBed.createComponent(CalltofinishComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.get(HttpTestingController);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const storeStub: Store<any> = fixture.debugElement.injector.get(Store);
      spyOn(component, 'getUtilTime').and.callThrough();
      spyOn(component, 'getESTTime').and.callThrough();
      spyOn(component, 'compareTime').and.callThrough();
      spyOn(storeStub, 'select').and.callThrough();
      component.ngOnInit();
      expect(component.getUtilTime).toHaveBeenCalled();
      // expect(component.getESTTime).toHaveBeenCalled();
      // expect(component.compareTime).toHaveBeenCalled();
      expect(storeStub.select).toHaveBeenCalled();
      const req = httpTestingController.expectOne(
        (request: HttpRequest<any>) => request.url === `${environment.nodeserver}util/time`
      );
      expect(req.request.method).toEqual('GET');
    });
  });
  describe('getUtilTime', () => {
    it('makes expected calls', async(() => {
      component.getUtilTime().subscribe(res => {
        expect(res).not.toBeNull();
      });
      const req = httpTestingController.expectOne(
        (request: HttpRequest<any>) => request.url === `${environment.nodeserver}util/time`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(time);
      //httpTestingController.verify();
    }));
  });
});
