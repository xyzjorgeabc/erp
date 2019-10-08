import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-modal-muestra-seleccion',
  templateUrl: './modal-muestra-seleccion.component.html',
  styleUrls: ['./modal-muestra-seleccion.component.css']
})
export class ModalMuestraSeleccionComponent implements OnInit, AfterViewInit, AfterViewChecked {
  public columnas: string[];
  @Input()
  public _data: object[];
  public data: object[];
  public form: FormGroup;
  @Output()
  public eventoSel: EventEmitter<Object>;
  @Output()
  public eventoCerrar: EventEmitter<void>;
  private registroSeleccionadoInd: number;
  private ultimo_orden = 1;
  private ultima_col = null;
  constructor() {
    this.eventoSel = new EventEmitter();
    this.eventoCerrar = new EventEmitter();
    this.form = new FormGroup({
      busqueda:     new FormControl('', {updateOn: 'change'}),
      col_busqueda: new FormControl('', {updateOn: 'change'})
    }, {updateOn: 'change'});
    this.form.valueChanges.subscribe(() => {
      this.buscar();
    });
  }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.colWidthSync();
  }
  ngAfterViewChecked(): void {
    this.colWidthSync();
  }
  public dinamycInit(): void {
    this.registroSeleccionadoInd = null;
    this.data = this._data;
    this.columnas = Object.keys(this.data[0]);
    this.form.controls.col_busqueda.setValue(this.columnas[0]);
  }
  buscar(): void {
    const col = this.form.value.col_busqueda;
    const busqueda = this.form.value.busqueda.toLowerCase();
    if (!busqueda) {
      this.data = this._data;
    } else {
      this.data = this._data.filter( function(val) {
        const colVal = String(val[col]).toLowerCase();
        return colVal.includes(busqueda);
      });
    }
  }
  ordenar(ev: MouseEvent): void {
    const target = (ev.target as HTMLElement);
    const col = target.nodeName === 'I' ? target.parentElement.dataset.nombre :  target.dataset.nombre;

    const ult_col = this.ultima_col;
    let orden = this.ultimo_orden;
    if (ult_col === col) {
      orden = orden ? 0 : 1;
    } else {
      orden = 0;
    }
    this.data.sort( function(a, b): number {
      if (a[col] < b[col]) {
        return orden ? 1 : -1;
      }
      if (a[col] > b[col]) {
        return orden ? -1 : 1;
      }
      return 0;
    });
    this.ultima_col = col;
    this.ultimo_orden = orden;
  }
  seleccionRegistro(ev: MouseEvent): void {
    const i = (ev.target as HTMLElement).parentElement.dataset.i;
    if (i) {
      this.registroSeleccionadoInd = +i;
    }
  }
  envioSeleccion(): void {
    if (this.data[this.registroSeleccionadoInd]) {
      this.eventoSel.next(this.data[this.registroSeleccionadoInd]);
    }
  }
  colWidthSync (): void {
    if (this.columnas) {
      this.columnas.forEach( function (colNom: string) {
        const real = document.getElementById('real_' + colNom);
        const fake = document.getElementById('fake_' + colNom);
        fake.parentElement.style.width = window.getComputedStyle(real.parentElement).width;
        fake.style.width = window.getComputedStyle(real).width;
      });

    }
  }
  scrollSync(e: Event): void {
    const realTableWrap = e.target as HTMLElement;
    const fakeTableWrap = document.getElementById('fake-t-wrap');
    fakeTableWrap.scrollLeft = realTableWrap.scrollLeft;
  }
  cerrar(): void {
    this.eventoCerrar.next();
  }
}
