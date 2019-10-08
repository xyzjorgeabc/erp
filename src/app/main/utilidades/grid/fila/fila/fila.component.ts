import { Component, OnInit, ViewContainerRef, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

export interface Columna {
  nombre: string;
  tipo: string;
  deshabilitado?: boolean;
}
@Component({
  selector: 'tr[app-fila]',
  templateUrl: './fila.component.html',
  styleUrls: ['./fila.component.css']
})
export class FilaComponent implements OnInit, AfterContentInit {
  public columnas: Array<Columna>;
  public tipoGrid: string;
  public nFila: number;
  public registro: FormGroup;
  @Output()
  eventoEliminar = new EventEmitter<FilaComponent>();
  constructor(public vcRef: ViewContainerRef) {
    this.registro = new FormGroup({});
  }
  ngAfterContentInit() {
  }
  ngOnInit() {
    for (let i = 0; i < this.columnas.length; i++) {
      this.registro.addControl(this.columnas[i].nombre, new FormControl());
    }
  }
  eliminar(): void {
    this.eventoEliminar.emit(this);
  }
}
