import { Component, OnInit, ComponentFactoryResolver, ViewChild, ComponentRef, ViewContainerRef } from '@angular/core';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { ModalSeleccionAlbaranesVentaComponent } from '../../../utilidades/modal-seleccion-albaranes-venta/modal-seleccion-albaranes-venta.component';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Cliente, FacturaVenta, MetodoPago, DataService, AlbaranVenta, Serie } from 'src/app/services/data/data.service';
import { ComponenteEditor, CompEditable } from '../../mantenimiento/mantenimiento-comp';
import { BiMap } from 'src/app/main/utilidades/utils/ultis';
import { zip } from 'rxjs';

@Component({
  selector: 'app-ventas-facturas',
  templateUrl: './ventas-facturas.component.html',
  styleUrls: ['./ventas-facturas.component.css', '../../seccion.css']
})
export class VentasFacturasComponent extends ComponenteEditor<FacturaVenta | Cliente | MetodoPago> implements OnInit, CompEditable {

  @ViewChild('modal', { read: ViewContainerRef, static: true })
  private modalAlbaranesContainer: ViewContainerRef;
  private modalAlbaranes: ComponentRef<ModalSeleccionAlbaranesVentaComponent>;
  protected uneditedFormState: FacturaVenta;
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
      id_cliente: new FormControl(),
      nombre_cliente: new FormControl({value: null, disabled: true}),
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
      this.ds.fetchFacturaVenta(this._series.getKey(this.form.controls.serie.value) + '', val).subscribe( (fact: FacturaVenta) => {
        const cliObs = this.ds.fetchCliente(fact.id_cliente + '');
        const metObs = this.ds.fetchMetodoPago(fact.id_metodo_pago + '');
        zip(cliObs, metObs).subscribe((result: [Cliente, MetodoPago]) => {
        this.setFacturaVenta(fact);
        this.setCliente(result[0] as Cliente, false);
        this.setMetodoPago(result[1] as MetodoPago, false);
        this.setAlbaranes(fact.albaranes);
        });
      });
    });

  }
  ngOnInit() {
    this.ns.navegacion.next(['Venta', 'Facturas']);
  }
  public abrirModal(): void {
    if (!this.modalAlbaranes) {
      const comp = this.CFR.resolveComponentFactory(ModalSeleccionAlbaranesVentaComponent);
      const CRI = this.modalAlbaranesContainer.createComponent(comp, 0);
      CRI.instance.eventoCerrar.subscribe(() => { this.cerrarModal(); });
      CRI.instance.eventoSeleccionAlbaranes.subscribe((albs: AlbaranVenta[]) => {
        const albsObs = [];
        for (let i = 0; i < albs.length; i++) {
          albsObs.push(this.ds.fetchAlbaranVenta(albs[i].id_serie, albs[i].id));
        }
        // tslint:disable-next-line: deprecation
        zip.apply(null, albsObs).subscribe((result: AlbaranVenta[]) => {
          this.setAlbaranes(result);
        });
      });
      this.modalAlbaranes = CRI;
    }
  }
  private setAlbaranes(albs: AlbaranVenta[]): void {
    const filtered_albs = albs.filter((alb: AlbaranVenta) => {
     return !this.albaranes.getRawValue().some((el) => {
      return (el.id === alb.id) && (el.id_serie === alb.id_serie);
     });
    });
    for (let i = 0; i < filtered_albs.length; i++) {
      this.albaranes.push(new FormGroup({
        id_serie: new FormControl({value: filtered_albs[i].id_serie, disabled: true}),
        id: new FormControl({value: filtered_albs[i].id, disabled: true}),
        id_cliente: new FormControl({value: filtered_albs[i].id_cliente, disabled: true}),
        fecha: new FormControl({value: filtered_albs[i].fecha, disabled: true}),
      }));
    }
  }
  private getNuevaFila(): FormGroup {
    return new FormGroup({
      id_serie: new FormControl({value: null, disabled: true}),
      id: new FormControl({value: null, disabled: true}),
      id_cliente: new FormControl({value: null, disabled: true}),
      fecha: new FormControl({value: null, disabled: true}),
      Descuento: new FormControl({value: null, disabled: true})
    });
  }
  private setFacturaVenta(fact: FacturaVenta): void {
    this.form.controls.id.setValue(fact.id, {emitEvent: false});
    this.form.controls.descuento_general.setValue(fact.descuento_general, {emitEvent: false});
    this.form.controls.fecha.setValue(fact.fecha, {emitEvent: false});
    this.setAlbaranes(fact.albaranes);
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
