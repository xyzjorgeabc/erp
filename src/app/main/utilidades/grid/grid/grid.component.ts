import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ViewChild,
         EventEmitter, Output} from '@angular/core';
import { FilaComponent, Columna } from '../fila/fila/fila.component';
import { DescendienteDinamicoTrackerService } from '../../../../services/descendienteDinamcoTracker/descendiente-dinamico-tracker.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css', ],
  providers: [DescendienteDinamicoTrackerService]
})
export class GridComponent implements OnInit {
  @Output()
  public eventoAnadir = new EventEmitter<void>();
  @Input()
  tipo: string;
  @Input()
  columnas: Array<Columna>;
  @ViewChild('tbody', { read: ViewContainerRef, static: true })
  private tbody: ViewContainerRef;
  private ultimoNFila = 0;
  constructor(private CFR: ComponentFactoryResolver,
    private DDTFilas: DescendienteDinamicoTrackerService) {
  }
  ngOnInit() {
    const self = this;
    setTimeout(() => {
      self.anadirFila();
      self.anadirFila();
      self.anadirFila();
      self.anadirFila();
    }, 0);
  }
  public anadirFila(): void {
    const CR = this.CFR.resolveComponentFactory(FilaComponent);
    const CRI = this.tbody.createComponent(CR, 0);
    CRI.instance.columnas = this.columnas;
    CRI.instance.tipoGrid = this.tipo;
    CRI.instance.nFila = ++this.ultimoNFila;
    CRI.instance.eventoEliminar.subscribe((x: FilaComponent) => { this.eliminarFila(x); });
    // this.formArr.push();
    this.DDTFilas.anadir(CRI);
  }
  anadir(): void {
    this.eventoAnadir.next();
  }
  eliminarFila(fila: FilaComponent) {
    this.DDTFilas.eliminar(fila);
  }
}
