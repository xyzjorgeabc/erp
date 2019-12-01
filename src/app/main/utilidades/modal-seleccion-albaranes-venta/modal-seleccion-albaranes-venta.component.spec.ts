import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSeleccionAlbaranesVentaComponent } from './modal-seleccion-albaranes-venta.component';

describe('ModalSeleccionAlbaranesVentaComponent', () => {
  let component: ModalSeleccionAlbaranesVentaComponent;
  let fixture: ComponentFixture<ModalSeleccionAlbaranesVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSeleccionAlbaranesVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSeleccionAlbaranesVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
