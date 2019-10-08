import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSeleccionAlbaranesComponent } from './modal-seleccion-albaranes.component';

describe('ModalSeleccionAlbaranesComponent', () => {
  let component: ModalSeleccionAlbaranesComponent;
  let fixture: ComponentFixture<ModalSeleccionAlbaranesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSeleccionAlbaranesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSeleccionAlbaranesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
