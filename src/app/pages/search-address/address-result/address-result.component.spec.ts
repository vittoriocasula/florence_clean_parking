import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressResultComponent } from './address-result.component';

describe('AddressResultComponent', () => {
  let component: AddressResultComponent;
  let fixture: ComponentFixture<AddressResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressResultComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
