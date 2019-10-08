import { Injectable, ComponentRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DescendienteDinamicoTrackerService {

  coleccion: Array<ComponentRef<any>> = [];
  constructor() {

  }
  anadir( el: ComponentRef<any>) {
    this.coleccion.push(el);
  }
  eliminar( el: {} ) {

    const ind = this.coleccion.findIndex( function(x) { return x.instance === el; });
    if (~ind) {
      this.coleccion[ind].destroy();
    }
    this.coleccion.splice(ind, 1);
  }
  get ultimo(): ComponentRef<any> {
    return this.coleccion[this.coleccion.length - 1];
  }
  get primer(): ComponentRef<any> {
    return this.coleccion[0];
  }
}
