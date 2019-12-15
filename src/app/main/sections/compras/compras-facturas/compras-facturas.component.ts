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
      this.ds.fetchFacturaCompra(this._series.getKey(this.form.controls.serie.value) + '', val)
      .subscribe( (fact: FacturaCompra) => {
        const provObs = this.ds.fetchProveedor(fact.id_proveedor + '');
        const metObs = this.ds.fetchMetodoPago(fact.id_metodo_pago + '');
        zip(provObs, metObs).subscribe((result: [Proveedor, MetodoPago]) => {
          this.setFacturaCompra(fact);
          this.setProveedor(result[0], false);
          this.setMetodoPago(result[1], false);
          this.setAlbaranes(fact.albaranes);
          this.uneditedFormState = this.form.getRawValue();
          this.form.markAsPristine();
        });
      }, (err) => {
        const serie = this.form.controls.serie.value;
        const id = this.form.controls.id.value;
        this.albaranes.clear();
        this.form.reset('', {emitEvent: false});
        this.form.controls.id.setValue(id, {emitEvent: false});
        this.form.controls.serie.setValue(serie, {emitEvent: false});
      });
    });
    this.form.controls.serie.valueChanges.subscribe(() => {
      this.form.controls.id.setValue('1');
    });
    this.form.controls.id_metodo_pago.valueChanges.subscribe(() => {
      this.ds.fetchMetodoPago(this.form.controls.id_metodo_pago.value)
      .subscribe((metodo: MetodoPago) => {
        this.setMetodoPago(metodo, true);
      });
    });
    this.form.controls.id_proveedor.valueChanges.subscribe(() => {
      this.ds.fetchProveedor(this.form.controls.id_proveedor.value)
      .subscribe((proveedor: Proveedor) => {
        this.setProveedor(proveedor, true);
      });
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
  private setProveedor(prov: Proveedor, markAsDirty: boolean): void {
    this.form.controls.id_proveedor.setValue(prov.id + '', {emitEvent: false});
    this.form.controls.nombre_proveedor.setValue(prov.nombre, {emitEvent: false});
    if (markAsDirty) {
      this.form.markAsDirty();
    }
  }
  private setMetodoPago(met: MetodoPago, markAsDirty: boolean): void {
    this.form.controls.id_metodo_pago.setValue(met.id + '', {emitEvent: false});
    this.form.controls.nombre_metodo_pago.setValue(met.nombre, {emitEvent: false});
    if (markAsDirty) {
      this.form.markAsDirty();
    }
  }
  private getNuevaFila(): FormGroup {
    return new FormGroup({
      id_serie: new FormControl({value: null, disabled: true}),
      id: new FormControl({value: null, disabled: true}),
      id_proveedor: new FormControl({value: null, disabled: true}),
      fecha: new FormControl({value: null, disabled: true}),
      id_albaran_proveedor: new FormControl({value: null, disabled: true}),
    });
  }
  public abrirModalAlbaranes(): void {
     if (!this.modalAlbaranes) {
      const comp = this.CFR.resolveComponentFactory(ModalSeleccionAlbaranesComponent);
      const CRI = this.modalAlbaranesContainer.createComponent(comp, 0);
      CRI.instance.eventoCerrar.subscribe(() => { this.cerrarModalAlbaranes(); });
      CRI.instance.eventoSeleccionAlbaranes.subscribe((albs: AlbaranCompra[]) => {
        const albsObs = [];
        for (let i = 0; i < albs.length; i++) {
          albsObs.push(this.ds.fetchAlbaranCompra(albs[i].id_serie, albs[i].id));
        }
        // tslint:disable-next-line: deprecation
        zip.apply(null, albsObs).subscribe((result: AlbaranCompra[]) => {
          this.setAlbaranes(result);
          this.form.markAsDirty();
        });
      });
      this.modalAlbaranes = CRI;
    }
  }
  public abrirModalFactura(): void {
    this.ds.fetchFacturaCompra(this._series.getKey(this.form.controls.serie.value), 'all')
    .subscribe(( facts: FacturaCompra[]) => {
      this.abrirModal(facts, (fact_tmp: FacturaCompra) => {
        this.ds.fetchFacturaCompra(fact_tmp.id_serie, fact_tmp.id).subscribe((fact: FacturaCompra) => {
          const metObs = this.ds.fetchMetodoPago(fact.id_metodo_pago + '');
          const provObs = this.ds.fetchProveedor(fact.id_proveedor + '');
          zip(provObs, metObs).subscribe((result: [Proveedor, MetodoPago]) => {
            this.setFacturaCompra(fact);
            this.setAlbaranes(fact.albaranes);
            this.setProveedor(result[0], false);
            this.setMetodoPago(result[1], false);
          });
        });
      });
    });
  }
  public abrirModalProveedor(): void {
    this.ds.fetchProveedor('all').subscribe(( provs: Proveedor[]) => {
      this.abrirModal(provs, (prov: Proveedor) => {
        this.setProveedor(prov, true);
      });
    });
  }
  public abrirModalMetodoPago(): void {
    this.ds.fetchMetodoPago('all').subscribe((metodos: MetodoPago[]) => {
      this.abrirModal(metodos, (metodo: MetodoPago) => {
        this.setMetodoPago(metodo, true);
      });
    });
  }
  public anadirFila(): void {
    this.albaranes.push(this.getNuevaFila());
    this.form.markAsDirty();
  }
  public eliminarFila(i: number): void {
    this.albaranes.removeAt(i);
    this.form.markAsDirty();
  }
  public cerrarModalAlbaranes() {
    this.modalAlbaranes.destroy();
    this.modalAlbaranes = null;
  }
  public deshacerCambios() {
    while (this.uneditedFormState.albaranes.length > this.albaranes.length) {
      this.albaranes.push(this.getNuevaFila());
    }
    while (this.uneditedFormState.albaranes.length < this.albaranes.length) {
      this.albaranes.removeAt(0);
    }
    super.deshacerCambios();
  }
  public anadirRegistro() {
    this.ds.fetchFacturaCompra(this._series.getKey(this.form.controls.serie.value), 'last')
    .subscribe((fact: FacturaCompra) => {
      this.albaranes.clear();
      this.form.reset('', {emitEvent: false});
      this.form.controls.serie.setValue(this._series.getValue(fact.id_serie), {emitEvent: false});
      this.form.controls.id.setValue(fact.id + 1 + '', {emitEvent: false});
    });
  }
  public eliminarRegistro() {

  }
  public guardarRegistro() {
    const factura = this.form.value;
    factura.id_serie = this._series.getKey(factura.serie);
    factura.albaranes = this.albaranes.value;
    this.ds.editarFacturaCompra(factura).subscribe(() => {
      this.uneditedFormState = this.form.getRawValue();
      this.form.markAsPristine();
    });
  }
}
