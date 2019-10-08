import { Component, OnInit, ComponentFactoryResolver, ViewChild, ComponentRef, ViewContainerRef } from '@angular/core';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { ModalSeleccionAlbaranesComponent } from '../../../utilidades/modal-seleccion-albaranes/modal-seleccion-albaranes.component';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { DataService, Serie } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-compras-facturas',
  templateUrl: './compras-facturas.component.html',
  styleUrls: ['./compras-facturas.component.css', '../../seccion.css']
})
export class ComprasFacturasComponent implements OnInit {
  public _series: Serie[];
  @ViewChild('modal', { read: ViewContainerRef, static: true })
  private modalContainer: ViewContainerRef;
  private modal: ComponentRef<ModalSeleccionAlbaranesComponent>;
  public form: FormGroup;
  public albaranes: FormArray;
  constructor(private ns: NavegacionService,
              private ds: DataService,
              private CFR: ComponentFactoryResolver) {
    // peticion de series
    this.albaranes = new FormArray([]);
    this.form = new FormGroup({
      id: new FormControl(),
      id_proveedor: new FormControl(),
      nombre_proveedor: new FormControl({value: null, disabled: true}),
      id_factura_proveedor: new FormControl(),
      id_metodo_pago: new FormControl(),
      nombre_metodo_pago: new FormControl({value: null, disabled: true}),
      descuento_general: new FormControl(),
      fecha: new FormControl(),
      albaranes: this.albaranes
    });
  }
  ngOnInit() {
    this.ns.navegacion.next(['Compra', 'Facturas']);
  }
  anadirAlbaran(): void {
    this.albaranes.push(new FormGroup({
      serie: new FormControl(),
      id: new FormControl(),
      fecha: new FormControl(),
      base_imponible:  new FormControl(),
      iva: new FormControl(),
      importe_iva: new FormControl(),
      importe_total: new FormControl()
    }));
  }
  abrirModal(): void {
     if (!this.modal) {
      const comp  = this.CFR.resolveComponentFactory(ModalSeleccionAlbaranesComponent);
      const CRI = this.modalContainer.createComponent(comp, 0);
      CRI.instance.eventoCerrar.subscribe(() => { this.cerrarModal(); });
      this.modal = CRI;
    }
  }
  eliminarAlbaran(i: number): void {
    this.albaranes.removeAt(i);
  }
  cerrarModal() {
    this.modal.destroy();
    this.modal = null;
  }
}
