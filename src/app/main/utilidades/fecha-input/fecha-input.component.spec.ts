import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FechaInputComponent } from './fecha-input.component';

describe('FechaInputComponent', () => {
  let component: FechaInputComponent;
  let fixture: ComponentFixture<FechaInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FechaInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FechaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
