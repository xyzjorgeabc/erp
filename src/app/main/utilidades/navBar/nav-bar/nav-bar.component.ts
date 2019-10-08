import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Input()
  titulo: string;
  @Output()
  anadirRegistro    = new EventEmitter<void>();
  @Output()
  eliminarRegistro  = new EventEmitter<void>();
  @Output()
  siguienteRegistro = new EventEmitter<void>();
  @Output()
  anteriorRegistro  = new EventEmitter<void>();
  constructor() {

  }
  ngOnInit() {

  }
  anadir(): void {
    this.anadirRegistro.emit();
  }
  eliminar(): void {
    this.eliminarRegistro.emit();
  }
  siguiente(): void {
    this.siguienteRegistro.emit();
  }
  anterior(): void {
    this.anteriorRegistro.emit();
  }

}
