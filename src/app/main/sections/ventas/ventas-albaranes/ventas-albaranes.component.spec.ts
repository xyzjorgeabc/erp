import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasAlbaranesComponent } from './ventas-albaranes.component';

describe('VentasAlbaranesComponent', () => {
  let component: VentasAlbaranesComponent;
  let fixture: ComponentFixture<VentasAlbaranesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasAlbaranesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasAlbaranesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
