import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { VehicleAddService } from '@services/vehicle-add-service';
import { ContactpaComponent } from './contact-pa.component';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { TranslateModule } from '@ngx-translate/core';
describe('ContactpaComponent', () => {
  let component: ContactpaComponent;
  let fixture: ComponentFixture<ContactpaComponent>;
  beforeEach(() => {
    const formBuilderStub = {};
    const routerStub = {};
    const activatedRouteStub = {};
    const storeStub = {};
    const navigationServiceStub = {};
    const vehicleAddServiceStub = {};
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ContactpaComponent, PageImageTitleComponent],
      providers: [
        { provide: FormBuilder, useValue: formBuilderStub },
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Store, useValue: storeStub },
        { provide: NavigationService, useValue: navigationServiceStub },
        { provide: VehicleAddService, useValue: vehicleAddServiceStub }
      ],
      imports:[TranslateModule.forRoot()]
    });
    fixture = TestBed.createComponent(ContactpaComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
