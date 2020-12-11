import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterNewDeviceComponent } from './register-new-device.component';

describe('RegisterNewDeviceComponent', () => {
  let component: RegisterNewDeviceComponent;
  let fixture: ComponentFixture<RegisterNewDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterNewDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterNewDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
