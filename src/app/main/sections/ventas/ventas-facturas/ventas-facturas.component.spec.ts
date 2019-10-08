import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasFacturasComponent } from './ventas-facturas.component';

describe('VentasFacturasComponent', () => {
  let component: VentasFacturasComponent;
  let fixture: ComponentFixture<VentasFacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
