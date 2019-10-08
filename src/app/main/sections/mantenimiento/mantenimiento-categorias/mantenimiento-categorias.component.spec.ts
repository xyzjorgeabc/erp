import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoCategoriasComponent } from './mantenimiento-categorias.component';

describe('MantenimientoCategoriasComponent', () => {
  let component: MantenimientoCategoriasComponent;
  let fixture: ComponentFixture<MantenimientoCategoriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoCategoriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
