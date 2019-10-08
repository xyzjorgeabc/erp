import { Component, OnInit } from '@angular/core';
import { NavegacionService } from '../../services/navegacion/navegacion.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  seccionActiva: Array<String>;
  constructor(private ns: NavegacionService) {

  }
  ngOnInit() {
    this.seccionActiva = [''];
    this.ns.navegacion.subscribe((camino: Array<String>) => { this.seccionActiva = camino; });
  }
}
