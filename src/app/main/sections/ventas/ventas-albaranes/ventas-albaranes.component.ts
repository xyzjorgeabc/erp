import { Component, OnInit } from '@angular/core';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-ventas-albaranes',
  templateUrl: './ventas-albaranes.component.html',
  styleUrls: ['./ventas-albaranes.component.css', '../../seccion.css']
})
export class VentasAlbaranesComponent implements OnInit {
  columnas = [{nombre: 'ID', tipo: 'number'},
  {nombre: 'Nombre articulo', tipo: 'text', deshabilitado: true},
  {nombre: 'IVA', tipo: 'number', deshabilitado: true},
  {nombre: 'Master', tipo: 'number', deshabilitado: true},
  {nombre: 'cantidad', tipo: 'number'},
  {nombre: 'Precio coste', tipo: 'number'},
  {nombre: 'Descuento', tipo: 'number', deshabilitado: true},
  {nombre: 'Importe', tipo: 'number', deshabilitado: true}];
  titulo = 'Edición de albaranes de venta';
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
      id_metodo_pago: new FormControl(),
      nombre_metodo_pago: new FormControl({value: null, disabled: true}),
      descuento_general: new FormControl(),
      registros: this.registros
    });
    this.anadirFila();
  }
  ngOnInit() {
    this.ns.navegacion.next(['Venta', 'Albaranes']);
  }
  anadirFila(): void {
    this.registros.push(new FormGroup({
      id: new FormControl(),
      nombre: new FormControl(),
      iva: new FormControl(),
      master: new FormControl(),
      cantidad: new FormControl(),
      precio_coste: new FormControl(),
      descuento: new FormControl(),
      importe: new FormControl()
    }));
  }
  eliminarFila(): void {

  }
  guardar(): void {
    console.log(this.form.value);
  }
}
