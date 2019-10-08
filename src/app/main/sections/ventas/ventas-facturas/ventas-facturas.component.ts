import { Component, OnInit, ComponentFactoryResolver, ViewChild, ComponentRef, ViewContainerRef } from '@angular/core';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { GridComponent } from '../../../utilidades/grid/grid/grid.component';
import { ModalSeleccionAlbaranesComponent } from '../../../utilidades/modal-seleccion-albaranes/modal-seleccion-albaranes.component';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-ventas-facturas',
  templateUrl: './ventas-facturas.component.html',
  styleUrls: ['./ventas-facturas.component.css', '../../seccion.css']
})
export class VentasFacturasComponent implements OnInit {

  columnas = [{nombre: 'Serie', tipo: 'number'},
  {nombre: 'ID Albarán', tipo: 'text'},
  {nombre: 'Fecha', tipo: 'date', deshabilitado: true},
  {nombre: 'Base Imponible', tipo: 'number', deshabilitado: true},
  {nombre: 'IVA', tipo: 'number'},
  {nombre: 'Importe IVA', tipo: 'number'},
  {nombre: 'Importe total', tipo: 'number'}];
  titulo = 'Edición de facturas de compra';
  series: Array<string>;
  @ViewChild('modal', { read: ViewContainerRef, static: true })
  private modalContainer: ViewContainerRef;
  private modal: ComponentRef<ModalSeleccionAlbaranesComponent>;
  public albaranes: FormArray;
  public form: FormGroup;
  constructor(private ns: NavegacionService,
              private CFR: ComponentFactoryResolver) {
    // peticion de series
    this.series = ['12', '13', '14', '15'];
    this.albaranes = new FormArray([]);
    this.form = new FormGroup({
      id: new FormControl(),
      id_cliente: new FormControl(),
      nombre_cliente: new FormControl({value: null, disabled: true}),
      id_metodo_pago: new FormControl(),
      nombre_metodo_pago: new FormControl({value: null, disabled: true}),
      descuento_general: new FormControl(),
      fecha: new FormControl(),
      albaranes: this.albaranes
    });
  }
  ngOnInit() {
    this.ns.navegacion.next(['Venta', 'Facturas']);
  }
  anadirAlbaranes(): void {
    if (!this.modal) {
      const CR  = this.CFR.resolveComponentFactory(ModalSeleccionAlbaranesComponent);
      const CRI = this.modalContainer.createComponent(CR, 0);
      CRI.instance.eventoCerrar.subscribe(() => { this.cerrarModal(); });
      this.modal = CRI;
    }
  }
  cerrarModal() {
    this.modal.destroy();
    this.modal = undefined;
  }
}
