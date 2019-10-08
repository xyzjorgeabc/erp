import { Component, OnInit } from '@angular/core';
import { NavegacionService } from '../../services/navegacion/navegacion.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  titulo = 'Edición de articulos';
  constructor(private ns: NavegacionService) {
    this.ns.navegacion.next(['Panel Principal']);
   }

  ngOnInit() {
  }

}
