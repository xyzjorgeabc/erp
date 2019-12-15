import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { BiMap } from 'src/app/main/utilidades/utils/ultis';
import { DataService, MetodoPago, Cliente, AlbaranVenta, Serie, Articulo, MuestraAlbaranVenta, RegistroAlbaranVenta } from 'src/app/services/data/data.service';
import { ComponenteEditor, CompEditable } from '../../mantenimiento/mantenimiento-comp';
import { restarPorc, getPorc } from 'src/app/services/calc/calc';
import { zip, Subscription } from 'rxjs';

@Component({
  selector: 'app-ventas-albaranes',
  templateUrl: './ventas-albaranes.component.html',
  styleUrls: ['./ventas-albaranes.component.css', '../../seccion.css']
})
export class VentasAlbaranesComponent extends ComponenteEditor< AlbaranVenta | MuestraAlbaranVenta | Cliente | MetodoPago > implements OnInit, CompEditable {
  public _series: BiMap<number, string>;
  public form: FormGroup;
  public calculoTotal: FormGroup;
  public registros: FormArray;
  protected uneditedFormState: AlbaranVenta;
  private subscripcionRegs: Subscription;
  constructor(private ns: NavegacionService, private ds: DataService, protected CFR: ComponentFactoryResolver) {
    super();
    this._series = new BiMap();
    this.registros = new FormArray([]);
    this.form = new FormGroup({
      serie: new FormControl(),
      id: new FormControl(),
      id_cliente: new FormControl(),
      nombre_cliente: new FormControl({value: null, disabled: true}),
      id_metodo_pago: new FormControl(),
      nombre_metodo_pago: new FormControl({value: null, disabled: true}),
      fecha: new FormControl(),
      descuento_general: new FormControl(),
      registros: this.registros
    });
    this.calculoTotal = new FormGroup({
      total_base: new FormControl({value: null, disabled: true}),
      total_iva: new FormControl({value: null, disabled: true}),
      total_importe: new FormControl({value: null, disabled: true})
    });

    this.subscripcionRegs = this.registros.valueChanges.subscribe(this.calcSetTotales.bind(this));
    this.form.controls.descuento_general.valueChanges.subscribe(this.calcSetTotales.bind(this));

    this.form.controls.id.valueChanges.subscribe(() => {
      this.ds.fetchAlbaranVenta(this._series.getKey(this.form.controls.serie.value), this.form.controls.id.value + '')
      .subscribe( (alb: AlbaranVenta) => {
        const cliObs = this.ds.fetchCliente(alb.id_cliente + '');
        const metodoPagoObs = this.ds.fetchMetodoPago(alb.id_metodo_pago + '');
        zip(cliObs, metodoPagoObs).subscribe((arr) => {
          this.setAlbaranVenta(alb);
          this.setCliente(arr[0] as Cliente, false);
          this.setMetodoPago(arr[1] as MetodoPago, false);
          this.uneditedFormState = this.form.getRawValue();
          this.form.markAsPristine();
        });
      }, (err) => {
        const serie = this.form.controls.serie.value;
        const id = this.form.controls.id.value;
        this.registros.clear();
        this.form.reset('', {emitEvent: false});
        this.form.controls.id.setValue(id, {emitEvent: false});
        this.form.controls.serie.setValue(serie, {emitEvent: false});
      } );
    });
    this.form.controls.id_cliente.valueChanges.subscribe( (id: string) => {
      this.ds.fetchCliente(id).subscribe((cli: Cliente) => {
        this.setCliente(cli, true);
      });
    });
    this.form.controls.id_metodo_pago.valueChanges.subscribe((id: string) => {
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
    this.ns.navegacion.next(['Venta', 'Albaranes']);
  }
  private getNuevaFila(): FormGroup {

    const regForm = new FormGroup({
      id_articulo: new FormControl(null, {updateOn: 'blur'}),
      nombre_registro: new FormControl(null, {updateOn: 'blur'}),
      iva: new FormControl(null, {updateOn: 'blur'}),
      cantidad_master: new FormControl(null, {updateOn: 'blur'}),
      precio_coste: new FormControl(null, {updateOn: 'blur'}),
      descuento: new FormControl(null, {updateOn: 'blur'}),
      cantidad: new FormControl(null, {updateOn: 'blur'}),
      importe: new FormControl({value: null, disabled: true}, {updateOn: 'change'})
    }, {updateOn: 'blur'});

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
  public anadirFila(): void {
    this.registros.push(this.getNuevaFila());
    this.form.markAsDirty();
  }
  public eliminarFila(): void {
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
  private setAlbaranVenta(alb: AlbaranVenta): void {
    this.form.controls.serie.setValue(this._series.getValue(alb.id_serie), {emitEvent: false});
    this.form.controls.id.setValue(alb.id, {emitEvent: false});
    this.form.controls.descuento_general.setValue(alb.descuento_general, {emitEvent: false});
    this.form.controls.fecha.setValue(alb.fecha, {emitEvent: false});
    this.setRegistros(alb.registros);
  }
  private setRegistros(regs: RegistroAlbaranVenta[]): void {

    this.subscripcionRegs.unsubscribe();
    this.registros.clear();
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
  private setMetodoPago(met: MetodoPago, markAsDirty: boolean): void {
    this.form.controls.id_metodo_pago.setValue(met.id, {emitEvent: false});
    this.form.controls.nombre_metodo_pago.setValue(met.nombre, {emitEvent: false});
    if (markAsDirty) {
      this.form.markAsDirty();
    }
  }
  private setCliente(cli: Cliente, markAsDirty: boolean): void {
   this.form.controls.id_cliente.setValue(cli.id, {emitEvent: false});
   this.form.controls.nombre_cliente.setValue(cli.nombre_comercial, {emitEvent: false});
    if (markAsDirty) {
      this.form.markAsDirty();
    }
  }
  public abrirModalAlbaran(): void {
    this.ds.fetchListaAlbaranVenta(this._series.getKey(this.form.controls.serie.value) + '')
      .subscribe((albaranes: MuestraAlbaranVenta[]) => {
      this.abrirModal(albaranes, (alb: AlbaranVenta) => {
        this.setAlbaranVenta(alb);
      });
    });
  }
  public abrirModalCliente(): void {
    this.ds.fetchCliente('all').subscribe((clientes: Cliente[]) => {
      this.abrirModal(clientes, (cli: Cliente) => {
        this.setCliente(cli, true);
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
  public eliminarRegistro(): void {

  }
  public guardarRegistro(): void {
    const albaran = this.form.value;
    albaran.id_serie = this._series.getKey(albaran.serie);
    this.uneditedFormState = this.form.getRawValue();
    this.form.markAsPristine();
    this.ds.editarAlbaranVenta(albaran).subscribe(() => {
    });
  }
  public anadirRegistro(): void {
    this.ds.fetchAlbaranVenta( this._series.getKey(this.form.controls.serie.value + '') , 'last')
    .subscribe((alb: AlbaranVenta) => {
      this.form.reset('', {emitEvent: false});
      this.form.controls.serie.setValue(this._series.getValue(alb.id_serie), {emitEvent: false});
      this.form.controls.id.setValue(alb.id + 1 + '', {emitEvent: false});
    });
  }
  public deshacerCambios(): void {
    while (this.uneditedFormState.registros.length > this.registros.length) {
      this.registros.push(this.getNuevaFila());
    }
    while (this.uneditedFormState.registros.length < this.registros.length) {
      this.registros.removeAt(0);
    }
    super.deshacerCambios();
    this.calcSetTotales();
  }
}
