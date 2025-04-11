import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteBaseComponent } from './autocomplete-base.component';

describe('AutocompleteBaseComponent', () => {
  let component: AutocompleteBaseComponent;
  let fixture: ComponentFixture<AutocompleteBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutocompleteBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
