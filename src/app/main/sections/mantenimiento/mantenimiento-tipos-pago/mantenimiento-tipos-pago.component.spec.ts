import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoTiposPagoComponent } from './mantenimiento-tipos-pago.component';

describe('MantenimientoTiposPagoComponent', () => {
  let component: MantenimientoTiposPagoComponent;
  let fixture: ComponentFixture<MantenimientoTiposPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoTiposPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoTiposPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
