import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Columna } from '../grid/fila/fila/fila.component';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-modal-seleccion-albaranes',
  templateUrl: './modal-seleccion-albaranes.component.html',
  styleUrls: ['./modal-seleccion-albaranes.component.css']
})
export class ModalSeleccionAlbaranesComponent implements OnInit {
  public columnas: Array<Columna> = [{nombre: 'Serie', tipo: 'number'}, {nombre: 'ID Albarán', tipo: 'text'},
  {nombre: 'Fecha', tipo: 'date', deshabilitado: true},
  {nombre: 'Importe total', tipo: 'number'}];
  public form: FormGroup;
  @Output()
  eventoCerrar = new EventEmitter<void>();
  constructor() {

    this.form = new FormGroup({
      fecha_desde: new FormControl(),
      fecha_hasta: new FormControl()
    });

  }

  ngOnInit() {

  }
  cerrar(): void {
    this.eventoCerrar.emit();
  }
}
