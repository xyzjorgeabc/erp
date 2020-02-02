import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { zip, Subscription } from 'rxjs';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { DataService, AlbaranCompra, Serie, MetodoPago, Proveedor, RegistroAlbaranCompra, MuestraAlbaranCompra, Articulo, AlbaranVenta} from 'src/app/services/data/data.service';
import { CompEditable, ComponenteEditor } from '../../mantenimiento/mantenimiento-comp';
import { sumarPorc, restarPorc, getPorc, fixNoRound } from '../../../../services/calc/calc';
import { BiMap} from '../../../utilidades/utils/ultis';
import { ValidatorService } from 'src/app/services/validator/validator.service';
@Component({
  selector: 'app-compras-albaranes',
  templateUrl: './compras-albaranes.component.html',
  styleUrls: ['./compras-albaranes.component.css', '../../seccion.css']
})
export class ComprasAlbaranesComponent extends ComponenteEditor<AlbaranCompra | Proveedor | MetodoPago| MuestraAlbaranCompra> implements OnInit, CompEditable {
  public _series: BiMap<number, string>;
  public form: FormGroup;
  public calculoTotal: FormGroup;
  public registros: FormArray;
  protected uneditedFormState: AlbaranCompra;
  private subscripcionRegs: Subscription;
  constructor(private ns: NavegacionService, private ds: DataService, protected CFR: ComponentFactoryResolver) {
    super();
    this._series = new BiMap();
    this.registros = new FormArray([]);
    this.form = new FormGroup({
      serie: new FormControl(),
      id: new FormControl('', {updateOn: 'change', validators: ValidatorService.isUInt.bind(null, 'id albarán')}),
      fecha: new FormControl(null, {updateOn: 'change', validators: ValidatorService.isDate.bind(null, 'fecha albarán')}),
      id_proveedor: new FormControl('', {updateOn: 'change', validators: ValidatorService.isUInt.bind(null, 'id proveedor')}),
      nombre_proveedor: new FormControl({value: null, disabled: true}),
      id_albaran_proveedor: new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'id albarán proveedor')}),
      id_metodo_pago: new FormControl('', {updateOn: 'change', validators: ValidatorService.isUInt.bind(null, 'id metodo pago')}),
      nombre_metodo_pago: new FormControl({value: null, disabled: true}),
      descuento_general: new FormControl('', {updateOn: 'change', validators: ValidatorService.isNumber.bind(null, 'descuento general albarán')}),
      registros: this.registros
    });
    this.calculoTotal = new FormGroup({
      total_base: new FormControl({value: null, disabled: true}),
      total_iva: new FormControl({value: null, disabled: true}),
      total_importe: new FormControl({value: null, disabled: true})
    });

    this.subscripcionRegs = this.registros.valueChanges.subscribe(this.calcSetTotales.bind(this));
    this.form.controls.descuento_general.valueChanges.subscribe(this.calcSetTotales.bind(this));
    this.form.controls.id.valueChanges.subscribe((val) => {
      if (this.form.controls.id.invalid) {
        return void 0;
      }
      this.ds.fetchAlbaranCompra(this._series.getKey(this.form.controls.serie.value), val)
      .subscribe( (alb: AlbaranCompra) => {
        const provObs = this.ds.fetchProveedor(alb.id_proveedor + '');
        const metodoPagoObs = this.ds.fetchMetodoPago(alb.id_metodo_pago + '');
        zip(provObs, metodoPagoObs).subscribe((arr) => {
          this.setAlbaranCompra(alb);
          this.setProveedor(arr[0] as Proveedor, false);
          this.setMetodoPago(arr[1] as MetodoPago, false);
          this.uneditedFormState = this.form.getRawValue();
          this.form.markAsPristine();
        });
      }, (err) => {
        const serie = this.form.controls.serie.value;
        const id = this.form.controls.id.value;
        this.subscripcionRegs.unsubscribe();
        this.registros = new FormArray([]);
        this.form.setControl('registros', this.registros);
        this.form.reset('', {emitEvent: false});
        this.form.controls.id.setValue(id, {emitEvent: false});
        this.form.controls.serie.setValue(serie, {emitEvent: false});
        this.subscripcionRegs = this.registros.valueChanges.subscribe(this.calcSetTotales.bind(this));
        this.calculoTotal.reset('', {emitEvent: false});
      });
    });
    this.form.controls.id_proveedor.valueChanges.subscribe( (id: string) => {
      if (this.form.controls.id_proveedor.invalid) {
        return void 0;
      }
      this.ds.fetchProveedor(id).subscribe((prov: Proveedor) => {
        this.setProveedor(prov, true);
      });
    });
    this.form.controls.id_metodo_pago.valueChanges.subscribe((id: string) => {
      if (this.form.controls.id_metodo_pago.invalid) {
        return void 0;
      }
      this.ds.fetchMetodoPago(id).subscribe((metodo: MetodoPago) => {
        this.setMetodoPago(metodo, true);
      });
    });

    this.form.controls.serie.valueChanges.subscribe(() => {
      this.form.controls.id.setValue('1');
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
    this.ns.navegacion.next(['Compra', 'Albaranes']);
    this.form.valueChanges.subscribe(this.updateErrors.bind(this));
  }
  private calcSetTotales (): void {
    const descuento_general = this.form.controls.descuento_general.value;
    const totals = this.registros.getRawValue().reduce((mem: any, reg: any) => {
      mem.total_iva += getPorc(restarPorc(+reg.importe, descuento_general), +reg.iva);
      mem.total_base += +reg.importe;
      return mem;
    }, {total_iva: 0, total_base: 0 });

    totals.total_base = restarPorc(+totals.total_base, +this.form.controls.descuento_general.value);

    this.calculoTotal.controls.total_base.setValue(totals.total_base.toFixed(3));
    this.calculoTotal.controls.total_iva.setValue(totals.total_iva.toFixed(3));
    this.calculoTotal.controls.total_importe.setValue((totals.total_base + totals.total_iva).toFixed(3));
  }
  private getNuevaFila(): FormGroup {

    const regForm = new FormGroup({
      id_articulo: new FormControl(null, {updateOn: 'blur', validators: ValidatorService.isUInt.bind(null, 'id articulo')}),
      nombre_registro: new FormControl(null, {updateOn: 'blur', validators: ValidatorService.isString.bind(null, 'nombre articulo')}),
      iva: new FormControl(null, {updateOn: 'blur', validators: ValidatorService.isNumber.bind(null, 'iva articulo')}),
      cantidad_master: new FormControl(null, {updateOn: 'blur', validators: ValidatorService.isUInt.bind(null, 'cantidad master articulo')}),
      cantidad: new FormControl(null, {updateOn: 'blur', validators: ValidatorService.isNumber.bind(null, 'cantidad articulo')}),
      precio_coste: new FormControl(null, {updateOn: 'blur', validators: ValidatorService.isNumber.bind(null, 'precio coste articulo')}),
      descuento: new FormControl(null, {updateOn: 'blur', validators: ValidatorService.isNumber.bind(null, 'descuento articulo')}),
      importe: new FormControl({value: null, disabled: true}, {updateOn: 'change'})
    }, {updateOn: 'blur'}, );

    function setImporte (): void {
      const precio = regForm.controls.precio_coste.value;
      const cantidad = regForm.controls.cantidad.value;
      const descuento = regForm.controls.descuento.value;
      regForm.controls.importe.setValue(
        restarPorc(precio * cantidad, +descuento).toFixed(3)
      );
    }

    regForm.controls.precio_coste.valueChanges.subscribe( setImporte );
    regForm.controls.cantidad.valueChanges.subscribe( setImporte );
    regForm.controls.descuento.valueChanges.subscribe( setImporte );
    regForm.controls.cantidad_master.valueChanges.subscribe( setImporte );
    regForm.controls.id_articulo.valueChanges.subscribe((val: string) => {
      this.ds.fetchArticulo(val).subscribe( function (art: Articulo) {
        regForm.controls.id_articulo.setValue(art.id, {emitEvent: false});
        regForm.controls.nombre_registro.setValue(art.nombre, {emitEvent: false});
        regForm.controls.precio_coste.setValue(art.coste, {emitEvent: false});
        regForm.controls.cantidad_master.setValue(art.cantidad_master, {emitEvent: false});
        regForm.controls.cantidad.reset('', {emitEvent: false});
        regForm.controls.descuento.reset('', {emitEvent: false});
        regForm.controls.iva.setValue(art.iva, {emitEvent: false});
        setImporte();
      });
    });
    return regForm;
  }
  private setAlbaranCompra(alb: AlbaranCompra): void {

    this.form.controls.serie.setValue(this._series.getValue(alb.id_serie), {emitEvent: false});
    this.form.controls.id.setValue(alb.id, {emitEvent: false});
    this.form.controls.id_albaran_proveedor.setValue(alb.id_albaran_proveedor, {emitEvent: false});
    this.form.controls.descuento_general.setValue(alb.descuento_general, {emitEvent: false});
    this.form.controls.fecha.setValue(alb.fecha, {emitValue: false});
    this.setRegistros(alb.registros);
  }
  private setMetodoPago(metodo: MetodoPago, markAsDirty: boolean): void {
    this.form.controls.id_metodo_pago.setValue(metodo.id, {emitEvent: false});
    this.form.controls.nombre_metodo_pago.setValue(metodo.nombre, {emitEvent: false});
    if (markAsDirty) {
      this.form.markAsDirty();
    }
  }
  private setProveedor(prov: Proveedor, markAsDirty: boolean): void {
    this.form.controls.id_proveedor.setValue(prov.id, {emitEvent: false});
    this.form.controls.nombre_proveedor.setValue(prov.nombre, {emitEvent: false});
    if (markAsDirty) {
      this.form.markAsDirty();
    }
  }
  private setRegistros(regs: RegistroAlbaranCompra[]): void {
    this.subscripcionRegs.unsubscribe();
    this.registros = new FormArray([]);
    this.form.setControl('registros', this.registros);
    regs.forEach((reg) => {
      const regForm = this.getNuevaFila();
      regForm.controls.id_articulo.setValue(reg.id_articulo, {emitEvent: false});
      regForm.controls.nombre_registro.setValue(reg.nombre_registro, {emitEvent: false});
      regForm.controls.iva.setValue(reg.iva, {emitEvent: false});
      regForm.controls.cantidad_master.setValue(reg.cantidad_master, {emitEvent: false});
      regForm.controls.cantidad.setValue(reg.cantidad, {emitEvent: false});
      regForm.controls.precio_coste.setValue(reg.precio_coste, {emitEvent: false});
      regForm.controls.descuento.setValue(reg.descuento, {emitEvent: false});
      const importe = (restarPorc(reg.precio_coste, reg.descuento) * reg.cantidad).toFixed(3);
      regForm.controls.importe.setValue(importe , {emitEvent: false});
      this.registros.push(regForm);
    });
    this.calcSetTotales();
    this.subscripcionRegs = this.registros.valueChanges.subscribe(this.calcSetTotales.bind(this));
  }
  public abrirModalAlbaran(): void {
    const idSerie = this._series.getKey(this.form.controls.serie.value);

    this.ds.fetchListaAlbaranCompra(idSerie + '').subscribe((lista: MuestraAlbaranCompra[]) => {
      this.abrirModal(lista, (albSelect: MuestraAlbaranCompra) => {
        this.ds.fetchAlbaranCompra(idSerie, albSelect.id).subscribe((alb: AlbaranCompra) => {
          const metObs = this.ds.fetchMetodoPago(alb.id_metodo_pago + '');
          const provObs = this.ds.fetchProveedor(alb.id_proveedor + '');
          zip(provObs, metObs).subscribe((result: [Proveedor, MetodoPago]) => {
            this.setAlbaranCompra(alb);
            this.setRegistros(alb.registros);
            this.setProveedor(result[0], false);
            this.setMetodoPago(result[1], false);
          });
        });
      });
    } );
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
    this.registros.push(this.getNuevaFila());
    this.form.markAsDirty();
  }
  public eliminarFila(i: number): void {
    this.registros.removeAt(i);
    this.form.markAsDirty();
  }
  public guardarRegistro(): void {
    const albaran = this.form.value;
    albaran.id_serie = this._series.getKey(albaran.serie);
    this.uneditedFormState = this.form.getRawValue();
    this.form.markAsPristine();
    this.ds.editarAlbaranCompra(albaran).subscribe(() => {
    });
  }
  public eliminarRegistro(): void {
    const id = this.form.controls.id.value;
    const serie = this.form.controls.serie.value;
    this.ds.deleteAlbaranesCompra(this._series.getKey(this.form.controls.serie.value), this.form.controls.id.value)
    .subscribe(() => {
      this.form.reset('', {emitEvent: false});
      this.form.controls.id.setValue(id, {emitEvent: false});
      this.form.controls.serie.setValue(serie, {emitEvent: false});
      this.calculoTotal.reset('', {emitEvent: false});
      this.uneditedFormState = null;
    }, function(err) {
      alert('El registro está siendo usado por otro registro.');
    });

  }
  public anadirRegistro(): void {
    this.ds.fetchAlbaranCompra( this._series.getKey(this.form.controls.serie.value + '') , 'last')
    .subscribe((alb: AlbaranCompra) => {
      this.form.reset('', {emitEvent: false});
      this.form.controls.serie.setValue(this._series.getValue(alb.id_serie), {emitEvent: false});
      this.form.controls.id.setValue(alb.id + 1 + '', {emitEvent: false});
    });
  }
  public deshacerCambios(): void {
    this.subscripcionRegs.unsubscribe();
    this.registros = new FormArray([]);
    this.subscripcionRegs = this.registros.valueChanges.subscribe(this.calcSetTotales.bind(this));
    this.form.setControl('registros', this.registros);

    while (this.uneditedFormState.registros.length > this.registros.length) {
      this.registros.push(this.getNuevaFila());
    }
    super.deshacerCambios();
    this.calcSetTotales();
  }
  public descargarRegistro() {

    const nombre = 'albaran_compra' + this.form.controls.serie.value + '_' + this.form.controls.id.value;

    this.ds.descargarDocAlbaranCompra(this._series.getKey(this.form.controls.serie.value), +this.form.controls.id.value).subscribe((pdf: string) => {
      this.descargarPDF(pdf, nombre);
    });
  }
}
