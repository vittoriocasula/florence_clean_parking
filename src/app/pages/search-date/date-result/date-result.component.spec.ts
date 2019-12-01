import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateResultComponent } from './date-result.component';

describe('DateResultComponent', () => {
  let component: DateResultComponent;
  let fixture: ComponentFixture<DateResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateResultComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
