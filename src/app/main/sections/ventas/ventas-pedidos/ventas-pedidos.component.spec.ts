import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasPedidosComponent } from './ventas-pedidos.component';

describe('VentasPedidosComponent', () => {
  let component: VentasPedidosComponent;
  let fixture: ComponentFixture<VentasPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
