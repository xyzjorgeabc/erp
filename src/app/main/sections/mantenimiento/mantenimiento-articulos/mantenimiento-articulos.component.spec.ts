import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoArticulosComponent } from './mantenimiento-articulos.component';

describe('MantenimientoArticulosComponent', () => {
  let component: MantenimientoArticulosComponent;
  let fixture: ComponentFixture<MantenimientoArticulosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoArticulosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
