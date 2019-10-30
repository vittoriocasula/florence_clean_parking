import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDatePage } from './search-date.page';

describe('SearchDatePage', () => {
  let component: SearchDatePage;
  let fixture: ComponentFixture<SearchDatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
