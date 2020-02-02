import { Component, OnInit, ComponentFactoryResolver, ViewChild, ComponentRef, ViewContainerRef } from '@angular/core';
import { zip, Subscription } from 'rxjs';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { ModalSeleccionAlbaranesComponent } from '../../../utilidades/modal-seleccion-albaranes/modal-seleccion-albaranes.component';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { DataService, Serie, MetodoPago, FacturaCompra, Proveedor, AlbaranCompra } from 'src/app/services/data/data.service';
import { BiMap } from 'src/app/main/utilidades/utils/ultis';
import { CompEditable, ComponenteEditor } from '../../mantenimiento/mantenimiento-comp';
import { ValidatorService } from 'src/app/services/validator/validator.service';

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
      id: new FormControl('', {updateOn: 'change', validators: ValidatorService.isUInt.bind(null, 'id factura')}),
      id_proveedor: new FormControl('', {updateOn: 'change', validators: ValidatorService.isUInt.bind(null, 'id proveedor')}),
      nombre_proveedor: new FormControl({value: null, disabled: true}),
      id_factura_proveedor: new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'id factura proveedor')}),
      id_metodo_pago: new FormControl('', {updateOn: 'change', validators: ValidatorService.isUInt.bind(null, 'id metodo pago')}),
      nombre_metodo_pago: new FormControl({value: null, disabled: true}),
      descuento_general: new FormControl('', {updateOn: 'change', validators: ValidatorService.isNumber.bind(null, 'descuento general factura')}),
      fecha: new FormControl(null, {updateOn: 'change', validators: ValidatorService.isDate.bind(null, 'fecha factura')}),
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
      if (this.form.controls.id.invalid) {
        return void 0;
      }
      this.ds.fetchFacturaCompra(this._series.getKey(this.form.controls.serie.value) + '', val)
      .subscribe( (fact: FacturaCompra) => {
        const provObs = this.ds.fetchProveedor(fact.id_proveedor + '');
        const metObs = this.ds.fetchMetodoPago(fact.id_metodo_pago + '');
        zip(provObs, metObs).subscribe((result: [Proveedor, MetodoPago]) => {
          this.setFacturaCompra(fact);
          this.setProveedor(result[0], false);
          this.setMetodoPago(result[1], false);
          this.uneditedFormState = this.form.getRawValue();
          this.form.markAsPristine();
        });
      }, (err) => {
        const serie = this.form.controls.serie.value;
        const id = this.form.controls.id.value;
        this.albaranes = new FormArray([]);
        this.form.setControl('albaranes', this.albaranes);
        this.form.reset('', {emitEvent: false});
        this.form.reset('', {emitEvent: false});
        this.form.controls.id.setValue(id, {emitEvent: false});
        this.form.controls.serie.setValue(serie, {emitEvent: false});
      });
    });
    this.form.controls.serie.valueChanges.subscribe(() => {
      this.form.controls.id.setValue('1');
    });
    this.form.controls.id_metodo_pago.valueChanges.subscribe(() => {
      if (this.form.controls.id_metodo_pago.invalid) {
        return void 0;
      }
      this.ds.fetchMetodoPago(this.form.controls.id_metodo_pago.value)
      .subscribe((metodo: MetodoPago) => {
        this.setMetodoPago(metodo, true);
      });
    });
    this.form.controls.id_proveedor.valueChanges.subscribe(() => {
      if (this.form.controls.id_proveedor.invalid) {
        return void 0;
      }
      this.ds.fetchProveedor(this.form.controls.id_proveedor.value)
      .subscribe((proveedor: Proveedor) => {
        this.setProveedor(proveedor, true);
      });
    });

  }
  ngOnInit() {
    this.ns.navegacion.next(['Compra', 'Facturas']);
    this.form.valueChanges.subscribe(this.updateErrors.bind(this));
  }
  private setFacturaCompra(fact: FacturaCompra): void {
    this.form.controls.id_factura_proveedor.setValue(fact.id_factura_proveedor, {emitEvent: false});
    this.form.controls.descuento_general.setValue(fact.descuento_general, {emitEvent: false});
    this.form.controls.fecha.setValue(fact.fecha, {emitEvent: false});
    this.setAlbaranes(fact.albaranes);
  }
  private setAlbaranes(albs: AlbaranCompra[]): void {
    const filtered_albs = albs.filter((alb: AlbaranCompra) => {
     return !this.albaranes.getRawValue().some((el) => {
      return (el.id === alb.id) && (el.id_serie === alb.id_serie);
     });
    });
    this.albaranes = new FormArray([]);
    this.form.setControl('albaranes', this.albaranes);

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
    this.albaranes = new FormArray([]);
    this.form.setControl('albaranes', this.albaranes);

    while (this.uneditedFormState.albaranes.length > this.albaranes.length) {
      this.albaranes.push(this.getNuevaFila());
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
    this.ds.deleteFacturaCompra(this._series.getKey(this.form.controls.serie.value + ''), this.form.controls.id.value).subscribe(() => {
      const tempid = this.form.value.id;
      const tempid_serie = this.form.value.serie;
      this.form.reset('', {emitEvent: false});
      this.form.controls.id.setValue(tempid, {emitEvent: false});
      this.form.controls.serie.setValue(tempid_serie, {emitEvent: false});
      this.uneditedFormState = null;
    }, function(err) {
      alert('El registro está siendo usado por otro registro.');
    });
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
  public descargarRegistro() {

    const nombre = 'factura_compra_' + this.form.controls.serie.value + '_' + this.form.controls.id.value;

    this.ds.descargarDocFacturaCompra(this._series.getKey(this.form.controls.serie.value), +this.form.controls.id.value).subscribe((pdf: string) => {
      this.descargarPDF(pdf, nombre);
    });
  }
}
