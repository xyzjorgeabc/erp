import { Component, OnInit, ComponentFactoryResolver, ViewChild, ComponentRef, ViewContainerRef } from '@angular/core';
import { zip, Subscription } from 'rxjs';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { ModalSeleccionAlbaranesComponent } from '../../../utilidades/modal-seleccion-albaranes/modal-seleccion-albaranes.component';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { DataService, Serie, MetodoPago, FacturaCompra, Proveedor, AlbaranCompra } from 'src/app/services/data/data.service';
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
    this.form.controls.id.valueChanges.subscribe((val) => {
      this.ds.fetchFacturaCompra(this._series.getKey(this.form.controls.serie.value) + '', val).subscribe( (fact: FacturaCompra) => {
        console.log(fact);
        const provObs = this.ds.fetchProveedor(fact.id_proveedor + '');
        const metObs = this.ds.fetchMetodoPago(fact.id_metodo_pago + '');
        zip(provObs, metObs).subscribe((result: [Proveedor, MetodoPago]) => {
        this.setFacturaCompra(fact);
        this.setProveedor(result[0]);
        this.setMetodoPago(result[1]);
        this.setAlbaranes(fact.albaranes);
        });
      });
    });
    this.form.controls.serie.valueChanges.subscribe(() => {
      this.form.controls.id.setValue('1');
    });
  }
  ngOnInit() {
    this.ns.navegacion.next(['Compra', 'Facturas']);
  }
  private setFacturaCompra(fact: FacturaCompra): void {
    this.form.controls.id_factura_proveedor.setValue(fact.id_factura_proveedor, {emitEvent: false});
    this.form.controls.descuento_general.setValue(fact.descuento_general, {emitEvent: false});
    this.form.controls.fecha.setValue(fact.fecha, {emitEvent: false});
  }
  private setAlbaranes(albs: AlbaranCompra[]): void {
    const filtered_albs = albs.filter((alb: AlbaranCompra) => {
     return !this.albaranes.getRawValue().some((el) => {
      return (el.id === alb.id) && (el.id_serie === alb.id_serie);
     });
    });
    console.log(this.albaranes.getRawValue());
    console.log(filtered_albs);
    for (let i = 0; i < filtered_albs.length; i++) {
      this.albaranes.push(new FormGroup({
        id_serie: new FormControl({value: filtered_albs[i].id_serie, disabled: true}),
        id: new FormControl({value: filtered_albs[i].id, disabled: true}),
        id_proveedor: new FormControl({value: filtered_albs[i].id_proveedor, disabled: true}),
        fecha: new FormControl({value: filtered_albs[i].fecha, disabled: true}),
        id_albaran_proveedor: new FormControl({value: filtered_albs[i].id_albaran_proveedor, disabled: true}),
      }));
    }

  }
  private setProveedor(prov: Proveedor): void {
    this.form.controls.id_proveedor.setValue(prov.id + '', {emitEvent: false});
    this.form.controls.nombre_proveedor.setValue(prov.nombre, {emitEvent: false});
  }
  private setMetodoPago(met: MetodoPago): void {
    this.form.controls.id_metodo_pago.setValue(met.id + '', {emitEvent: false});
    this.form.controls.nombre_metodo_pago.setValue(met.nombre, {emitEvent: false});
  }
  private getNuevaFila(): FormGroup {
    return new FormGroup({
      id_serie: new FormControl({value: null, disabled: true}),
      id: new FormControl({value: null, disabled: true}),
      id_proveedor: new FormControl({value: null, disabled: true}),
      fecha: new FormControl({value: null, disabled: true}),
      id_factura_proveedor: new FormControl({value: null, disabled: true}),
      Descuento: new FormControl({value: null, disabled: true})
    });
  }
  public abrirModal(): void {
     if (!this.modalAlbaranes) {
      const comp = this.CFR.resolveComponentFactory(ModalSeleccionAlbaranesComponent);
      const CRI = this.modalAlbaranesContainer.createComponent(comp, 0);
      CRI.instance.eventoCerrar.subscribe(() => { this.cerrarModal(); });
      CRI.instance.eventoSeleccionAlbaranes.subscribe((albs: AlbaranCompra[]) => {
        const albsObs = [];
        for (let i = 0; i < albs.length; i++) {
          albsObs.push(this.ds.fetchAlbaranCompra(albs[i].id_serie, albs[i].id));
        }
        // tslint:disable-next-line: deprecation
        zip.apply(null, albsObs).subscribe((result: AlbaranCompra[]) => {
          this.setAlbaranes(result);
        });
      });
      this.modalAlbaranes = CRI;
    }
  }
  public eliminarAlbaran(i: number): void {
    this.albaranes.removeAt(i);
  }
  public cerrarModal() {
    this.modalAlbaranes.destroy();
    this.modalAlbaranes = null;
  }
  public deshacerCambios() {

  }
  public anadirRegistro() {
    this.albaranes.push(this.getNuevaFila());
    this.form.markAsDirty();
  }
  public eliminarRegistro() {

  }
  public guardarRegistro() {
    const factura = this.form.value;
    factura.id_serie = this._series.getKey(factura.serie);
    factura.albaranes = this.albaranes.value;
    this.ds.editarFacturaCompra(factura).subscribe(() => {
      // mark as pristine set unedited form.
    });
  }
}
