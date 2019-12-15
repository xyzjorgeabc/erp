import { Component, OnInit } from '@angular/core';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
@Component({
  selector: 'app-ventas-pedidos',
  templateUrl: './ventas-pedidos.component.html',
  styleUrls: ['./ventas-pedidos.component.css', '../../seccion.css']
})
export class VentasPedidosComponent implements OnInit {
  columnas = [{nombre: 'ID', tipo: 'number'},
  {nombre: 'Nombre articulo', tipo: 'text', deshabilitado: true},
  {nombre: 'Master', tipo: 'number', deshabilitado: true},
  {nombre: 'Unidades', tipo: 'number'},
  {nombre: 'KG', tipo: 'number'}];
  titulo = 'Edición de pedidos de venta';
  series: Array<string>;
  public form: FormGroup;
  public registros: FormArray;
  constructor(private ns: NavegacionService) {
    // peticion de series
    this.series = ['12', '13', '14', '15'];
    this.registros = new FormArray([]);
    this.form = new FormGroup({
      id: new FormControl(),
      id_cliente: new FormControl(),
      nombre_cliente: new FormControl({value: null, disabled: true}),
      registros: this.registros
    });
    this.anadirFila();
  }
  ngOnInit() {
    this.ns.navegacion.next(['Venta', 'Pedidos']);
  }
  anadirFila(): void {
    this.registros.push(new FormGroup({
      id: new FormControl(),
      nombre: new FormControl(),
      master: new FormControl(),
      unidades: new FormControl(),
      kg: new FormControl()
    }));
  }
  eliminarFila(i: number): void {
    this.registros.removeAt(i);
  }
  guardar(): void {
  }
}
