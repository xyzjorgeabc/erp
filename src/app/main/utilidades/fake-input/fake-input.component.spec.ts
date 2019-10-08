import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeInputComponent } from './fake-input.component';

describe('FakeInputComponent', () => {
  let component: FakeInputComponent;
  let fixture: ComponentFixture<FakeInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FakeInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
