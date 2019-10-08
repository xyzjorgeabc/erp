import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoClientesComponent } from './mantenimiento-clientes.component';

describe('MantenimientoClientesComponent', () => {
  let component: MantenimientoClientesComponent;
  let fixture: ComponentFixture<MantenimientoClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
