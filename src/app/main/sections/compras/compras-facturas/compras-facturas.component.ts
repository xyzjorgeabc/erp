import { Component, OnInit, ComponentFactoryResolver, ViewChild, ComponentRef, ViewContainerRef } from '@angular/core';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { ModalSeleccionAlbaranesComponent } from '../../../utilidades/modal-seleccion-albaranes/modal-seleccion-albaranes.component';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { DataService, Serie, MetodoPago, FacturaCompra, Proveedor } from 'src/app/services/data/data.service';
import { BiMap } from 'src/app/main/utilidades/utils/ultis';
import { CompEditable, ComponenteEditor } from '../../mantenimiento/mantenimiento-comp';

@Component({
  selector: 'app-compras-facturas',
  templateUrl: './compras-facturas.component.html',
  styleUrls: ['./compras-facturas.component.css', '../../seccion.css']
})
export class ComprasFacturasComponent extends ComponenteEditor<FacturaCompra | Proveedor | MetodoPago> implements OnInit, CompEditable {
  @ViewChild('modalAlbaranes', { read: ViewContainerRef, static: true })
  private modalAlbaranesContainer: ViewContainerRef;
  private modalAlbaranes: ComponentRef<ModalSeleccionAlbaranesComponent>;
  protected uneditedFormState: FacturaCompra;
  public _series: BiMap<number, string>;
  public form: FormGroup;
  public albaranes: FormArray;
  constructor(private ns: NavegacionService,
              private ds: DataService,
              protected CFR: ComponentFactoryResolver) {
    super();
    this._series = new BiMap();
    this.albaranes = new FormArray([]);
    this.form = new FormGroup({
      serie: new FormControl(),
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
    this.ds.fetchSerie('all').subscribe((series: Serie[]) => {
      for ( let i = 0; i < series.length; i++) {
        this._series.set( series[i].id, series[i].nombre );
      }
      this.form.controls.serie.setValue( series[0].nombre, {emitEvent: false });
      this.form.controls.id.setValue('1');
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
      base_imponible: new FormControl(),
      iva: new FormControl(),
      importe_iva: new FormControl(),
      importe_total: new FormControl()
    }));
  }
  abrirModal(): void {
     if (!this.modalAlbaranes) {
      const comp  = this.CFR.resolveComponentFactory(ModalSeleccionAlbaranesComponent);
      const CRI = this.modalAlbaranesContainer.createComponent(comp, 0);
      CRI.instance.eventoCerrar.subscribe(() => { this.cerrarModal(); });
      this.modalAlbaranes = CRI;
    }
  }
  eliminarAlbaran(i: number): void {
    this.albaranes.removeAt(i);
  }
  cerrarModal() {
    this.modalAlbaranes.destroy();
    this.modalAlbaranes = null;
  }
  deshacerCambios() {

  }
  anadirRegistro() {

  }
  eliminarRegistro() {

  }
  guardarRegistro() {

  }
}
