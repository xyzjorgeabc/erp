import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavegacionService {
  public navegacion: Subject<Array<String>>;
  private seccion: Array<String>;
  constructor() {
    this.navegacion = new Subject();
    this.navegacion.subscribe((camino: Array<String>) => { this.seccion = camino; });
  }
  get seccionActiva() {
    return this.seccion;
  }
}
