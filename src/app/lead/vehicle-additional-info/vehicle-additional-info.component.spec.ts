import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAdditionalInfoComponent } from './vehicle-additional-info.component';

describe('VehicleAdditionalInfoComponent', () => {
  let component: VehicleAdditionalInfoComponent;
  let fixture: ComponentFixture<VehicleAdditionalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleAdditionalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleAdditionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
