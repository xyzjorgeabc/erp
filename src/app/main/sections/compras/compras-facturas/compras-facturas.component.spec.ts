import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasFacturasComponent } from './compras-facturas.component';

describe('ComprasFacturasComponent', () => {
  let component: ComprasFacturasComponent;
  let fixture: ComponentFixture<ComprasFacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
