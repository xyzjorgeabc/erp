import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService, Categoria } from '../../../../services/data/data.service';
import { ComponenteEditor, CompEditable } from '../mantenimiento-comp';
@Component({
  selector: 'app-mantenimiento-categorias',
  templateUrl: './mantenimiento-categorias.component.html',
  styleUrls: ['./mantenimiento-categorias.component.css', '../../seccion.css']
})
export class MantenimientoCategoriasComponent extends ComponenteEditor<Categoria> implements OnInit, CompEditable {
  public form: FormGroup;
  protected uneditedFormState: Categoria;
  constructor(private ns: NavegacionService, private ds: DataService, protected CFR: ComponentFactoryResolver) {
    super();
    this.form = new FormGroup({
      id:              new FormControl(),
      nombre:          new FormControl(),
      descripcion:     new FormControl(),
      iva_por_defecto: new FormControl()
    });
  }

  ngOnInit() {
    this.ns.navegacion.next(['Mantenimiento', 'Categorías']);

    this.form.controls.id.valueChanges.subscribe((val) => {
      if (this.uneditedFormState && (this.uneditedFormState.id === val)) {
        return void 0;
      }
      this.ds.fetchCategoria(val + '').subscribe((cat: Categoria) => {
        this.form.reset('', {emitEvent: false});
        this.setRegistro(cat);
        this.uneditedFormState = this.form.getRawValue();
      }, (err) => {
          if (err.status === 404) {
            const tempid = this.form.value.id;
            this.form.reset('', {emitEvent: false});
            this.form.controls.id.setValue(tempid, {emitEvent: false});
            this.uneditedFormState = null;
          }
       });
    });
    this.form.controls.id.setValue('1');
  }
  private setRegistro(cat: Categoria): void {
    this.form.reset('', {emitEvent: false});
    this.form.controls.id.setValue(cat.id, {emitEvent: false});
    this.form.controls.nombre.setValue(cat.nombre);
    this.form.controls.descripcion.setValue(cat.descripcion);
    this.form.controls.iva_por_defecto.setValue(cat.iva_por_defecto);
  }
  public anadirRegistro(): void {
    this.ds.fetchCategoria('last').subscribe((cat: Categoria) => {
      this.form.reset('', {emitEvent: false});
      this.form.controls.id.setValue( +cat.id + 1, {emitEvent: false} );
      this.uneditedFormState = null;
    });
  }
  public eliminarRegistro(): void {

  }
  public guardarRegistro(): void {
    this.ds.editarCategoria(this.form.value).subscribe((cat: Categoria) => {
      this.uneditedFormState = this.form.getRawValue();
      this.form.markAsPristine();
    });
  }
  public buscarCategorias(): void {
    this.ds.fetchCategoria('all').subscribe((data: Array<Categoria>) => {
      this.abrirModal(data, (cat: Categoria) => {
        this.setRegistro(cat);
      });
    });
  }
  validarForm(): void {

  }
}
