import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-selector-fecha',
  templateUrl: './selector-fecha.component.html',
  styleUrls: ['./selector-fecha.component.css']
})
export class SelectorFechaComponent implements OnInit, AfterViewInit {

  public dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  public diasCorto = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
  public meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public mesesCorto = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  mostrandoMes: number;
  mostrandoAno: number;
  seleccionando: string;
  @Output()
  fechaSel: EventEmitter<any>;
  @ViewChildren('dia')
  td: QueryList<ElementRef>;
  constructor() {
    this.fechaSel = new EventEmitter<string>();
    const d = new Date();
    this.mostrandoMes = d.getMonth();
    this.mostrandoAno = d.getFullYear();
  }
  ngAfterViewInit(): void {
    this.rellenarTablaDias();
  }
  ngOnInit(): void {

  }
  private diasMes(mes: number, ano: number): number {
    return new Date(ano, mes + 1, 0).getDate();
  }
  private nombreDia(dia: number, mes: number, ano: number): string {
    return this.diasCorto[this.numeroDiaSemana(dia, mes, ano) - 1];
  }
  private numeroDiaSemana(dia: number, mes: number, ano: number): number {
    return new Date(ano, mes, dia).getDay();
  }
  private rellenarTablaDias(): void {
    const mes = this.mostrandoMes;
    const ano = this.mostrandoAno;
    const nDias = this.diasMes(mes, ano);
    let diaPrincipioMes = this.numeroDiaSemana(1, mes, ano) - 1;
    diaPrincipioMes = diaPrincipioMes >= 0 ? diaPrincipioMes : 6;
    const r = this.td.toArray();
    const l = r.length;

    for (let i = 0, n = 0; i < l; i++ ) {
      const td = r[i].nativeElement;
      const span = td.children[0];
      span.innerHTML = '';
      if ( i >= diaPrincipioMes && n++ < nDias) {
        td.className = 'seleccionable';
        span.append(document.createTextNode(n + ''));
      } else {
        td.className = '';
      }
    }
  }
  siguienteMes() {
    const mes = this.mostrandoMes;
    if ( mes < 11) {
      this.mostrandoMes++;
    } else if (mes === 11) {
      this.mostrandoAno++;
      this.mostrandoMes = 0;
    }
    this.rellenarTablaDias();
  }
  previoMes() {
    const mes = this.mostrandoMes;
    if ( mes > 0) {
      this.mostrandoMes--;
    } else if (mes === 0) {
      this.mostrandoAno--;
      this.mostrandoMes = 11;
    }
    this.rellenarTablaDias();
  }
  selDia(e: MouseEvent) {
    const t = e.target as HTMLElement;
    const dia = t.innerHTML.padStart(2, '0');
    const mes = (this.mostrandoMes + 1 + '').padStart(2, '0');
    const ano = (this.mostrandoAno + '').padStart(4, '0');
    if (t.nodeName !== 'SPAN' || dia.length === 0) {
      return void 0;
    }
    const fecha = dia + '-' + mes + '-' + ano;
    this.fechaSel.next(fecha);
  }
  public scrollMes(e: Event | any): void {
    e.wheelDeltaY > 0 ? this.previoMes() : this.siguienteMes();
    e.preventDefault();
  }
}
