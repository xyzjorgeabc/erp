import { Component, ViewChild, OnInit, ViewContainerRef } from '@angular/core';
import { NavegacionService } from '../../services/navegacion/navegacion.service';
import { Chart } from 'chart.js';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('gastos', { read: ViewContainerRef, static: true })
  private gastosEl: ViewContainerRef;
  @ViewChild('topProveedores', { read: ViewContainerRef, static: true })
  private topProvEl: ViewContainerRef;
  @ViewChild('ventas', { read: ViewContainerRef, static: true })
  private ventasEl: ViewContainerRef;
  @ViewChild('topClientes', { read: ViewContainerRef, static: true })
  private topCliEl: ViewContainerRef;
  private chartGastos: Chart;
  private chartTopProv: Chart;
  private chartVentas: Chart;
  private chartTopClie: Chart;
  constructor(private ns: NavegacionService, private ds: DataService) {

  }
  ngOnInit() {
    this.ns.navegacion.next(['Dashboard']);
    this.ds.statsGastos().subscribe((arr) => {

      this.chartGastos = new Chart(this.gastosEl.element.nativeElement.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          datasets: [{
            label: 'Compra mensual',
            data: arr,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            maxBarThickness: 40,
            borderWidth: 3
          }]
        },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    });
    this.ds.statsTopProveedores().subscribe((provs) => {

      const nombresProvs = Object.keys(provs);
      const totals = Object.values(provs);

      this.chartTopProv = new Chart(this.topProvEl.element.nativeElement.getContext('2d'), {
        type: 'bar',
        data: {
            labels: nombresProvs,
          datasets: [{
            label: 'Top proveedores',
            data: totals,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            maxBarThickness: 40,
            borderWidth: 3
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                  beginAtZero: true
              }
            }]
          }
        }
        });

    });
    this.ds.statsVentas().subscribe((arr) => {
      this.chartVentas = new Chart(this.ventasEl.element.nativeElement.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          datasets: [{
            label: 'Ventas mensual',
            data: arr,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            maxBarThickness: 40,
            borderWidth: 3
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    });

    this.ds.statsTopClientes().subscribe((clientes) => {

      const nombresProvs = Object.keys(clientes);
      const totals = Object.values(clientes);

      this.chartTopClie = new Chart(this.topCliEl.element.nativeElement.getContext('2d'), {
        type: 'bar',
        data: {
          labels: nombresProvs,
          datasets: [{
            label: 'Top clientes',
            data: totals,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            maxBarThickness: 40,
            borderWidth: 3
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    });
  }
}
