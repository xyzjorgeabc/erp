import { Component, OnInit, Output, Input, EventEmitter, ComponentFactoryResolver } from '@angular/core';
import { Columna } from '../grid/fila/fila/fila.component';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { NavegacionService } from 'src/app/services/navegacion/navegacion.service';
import { DataService, Serie, FacturaCompra, AlbaranCompra } from 'src/app/services/data/data.service';
import { BiMap } from '../utils/ultis';

@Component({
  selector: 'app-modal-seleccion-albaranes',
  templateUrl: './modal-seleccion-albaranes.component.html',
  styleUrls: ['./modal-seleccion-albaranes.component.css']
})
export class ModalSeleccionAlbaranesComponent implements OnInit {
  public columnas: Array<Columna> = [{nombre: 'Serie', tipo: 'number'}, {nombre: 'ID Albarán', tipo: 'text'},
  {nombre: 'Fecha', tipo: 'date', deshabilitado: true},
  {nombre: 'Importe total', tipo: 'number'}];
  public _series: BiMap<number, string>;
  public form: FormGroup;
  public albaranes: FormArray;
  @Output()
  eventoCerrar = new EventEmitter<void>();
  @Output()
  eventoSeleccionAlbaranes = new EventEmitter<AlbaranCompra[]>();
  constructor(private ds: DataService) {
    this._series = new BiMap();
    this.albaranes = new FormArray([]);
    this.form = new FormGroup({
      serie: new FormControl(),
      fecha_desde: new FormControl(),
      fecha_hasta: new FormControl(),
      albaranes: this.albaranes
    });
    this.ds.fetchSerie('all').subscribe((series: Serie[]) => {
      for ( let i = 0; i < series.length; i++) {
        this._series.set( series[i].id, series[i].nombre );
      }
      this.form.controls.serie.setValue(this._series.getValue(1));
    });
    this.form.controls.serie.valueChanges.subscribe(this.buscarFacturas.bind(this));
    this.form.controls.fecha_desde.valueChanges.subscribe(this.buscarFacturas.bind(this));
    this.form.controls.fecha_hasta.valueChanges.subscribe(this.buscarFacturas.bind(this));
  }
  private setLista(albs: AlbaranCompra[]): void {
    this.albaranes.clear();
    for (let i = 0; i < albs.length; i++) {
      this.albaranes.push(new FormGroup({
        id_serie: new FormControl({value: albs[i].id_serie, disabled: true}),
        id: new FormControl({value: albs[i].id, disabled: true}),
        id_proveedor: new FormControl({value: albs[i].id_proveedor, disabled: true}),
        fecha: new FormControl({value: albs[i].fecha, disabled: true}),
        id_albaran_proveedor: new FormControl({value: albs[i].id_albaran_proveedor, disabled: true}),
        seleccionado: new FormControl(false)
      }));
    }
  }
  private buscarFacturas(): void {
    if (!(
      this.form.controls.fecha_desde.value &&
      this.form.controls.fecha_hasta.value &&
      this.form.controls.serie.value)) {
        return void 0;
      }

    this.ds.buscarAlbaranesCompra(
      this.form.controls.fecha_desde.value,
      this.form.controls.fecha_hasta.value,
      this._series.getKey(this.form.controls.serie.value)).subscribe((result: AlbaranCompra[]) => {
        this.setLista(result);
      });
  }
  public anadir(): void {
    const selAlbs = this.albaranes.getRawValue()
    .filter(function(val) { return val.seleccionado; });
    this.eventoSeleccionAlbaranes.emit(selAlbs);
    this.cerrar();
  }
  ngOnInit() {

  }
  public cerrar(): void {
    this.eventoCerrar.emit();
  }
}
