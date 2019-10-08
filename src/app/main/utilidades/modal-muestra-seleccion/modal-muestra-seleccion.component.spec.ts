import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMuestraSeleccionComponent } from './modal-muestra-seleccion.component';

describe('ModalMuestraSeleccionComponent', () => {
  let component: ModalMuestraSeleccionComponent;
  let fixture: ComponentFixture<ModalMuestraSeleccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMuestraSeleccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMuestraSeleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
