import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaBaseComponent } from './textarea-base.component';

describe('TextareaBaseComponent', () => {
  let component: TextareaBaseComponent;
  let fixture: ComponentFixture<TextareaBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextareaBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
