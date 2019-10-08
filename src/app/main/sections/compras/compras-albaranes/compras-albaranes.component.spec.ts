import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasAlbaranesComponent } from './compras-albaranes.component';

describe('ComprasAlbaranesComponent', () => {
  let component: ComprasAlbaranesComponent;
  let fixture: ComponentFixture<ComprasAlbaranesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasAlbaranesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasAlbaranesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
