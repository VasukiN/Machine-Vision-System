import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCheckComponent } from './add-new-check.component';

describe('AddNewCheckComponent', () => {
  let component: AddNewCheckComponent;
  let fixture: ComponentFixture<AddNewCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
