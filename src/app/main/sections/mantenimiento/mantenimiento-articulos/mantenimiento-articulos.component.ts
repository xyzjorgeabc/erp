import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { zip } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { CalcService as Nums} from '../../../../services/calc/calc.service';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { DataService, Articulo, Proveedor, Categoria } from '../../../../services/data/data.service';
import { ComponenteEditor, CompEditable } from '../mantenimiento-comp';
@Component({
  selector: 'app-mantenimiento-articulos',
  templateUrl: './mantenimiento-articulos.component.html',
  styleUrls: ['./mantenimiento-articulos.component.css', '../../seccion.css']
})
export class MantenimientoArticulosComponent extends ComponenteEditor<Articulo|Proveedor|Categoria> implements OnInit, CompEditable {
  public form: FormGroup;
  protected uneditedFormState: Articulo;
  constructor(private ns: NavegacionService, private ds: DataService, protected CFR: ComponentFactoryResolver) {
    super();
    this.form = new FormGroup({
      id:                    new FormControl('', {updateOn: 'change'}),
      nombre:                new FormControl(),
      descripcion:           new FormControl(),
      id_categoria:          new FormControl(),
      categoria_nombre:      new FormControl({value: null, disabled: true}),
      id_proveedor:          new FormControl(),
      proveedor_nombre:      new FormControl({value: null, disabled: true}),
      cantidad_master:       new FormControl(),
      stock:                 new FormControl({value: null, disabled: true}),
      iva:                   new FormControl('', {updateOn: 'change'}),
      coste_anterior:        new FormControl({value: null, disabled: true}),
      coste:                 new FormControl('', {updateOn: 'change'}),
      coste_mas_iva:         new FormControl({value: null, disabled: true}),
      margen_detalle:        new FormControl({value: null, disabled: true}),
      pvp_detalle:           new FormControl('', {updateOn: 'change'}),
      margen_mayor:          new FormControl({value: null, disabled: true}),
      pvp_mayor:             new FormControl('', {updateOn: 'change'})
    });
  }
  ngOnInit() {

    this.ns.navegacion.next(['Mantenimiento', 'Artículos']);

    this.form.controls.id.valueChanges.subscribe((val) => {
      if (this.uneditedFormState && (this.uneditedFormState.id === val)) {
        return void 0;
      }
      this.ds.fetchArticulo(val).subscribe((art: Articulo) => {
        const catObs = this.ds.fetchCategoria(art.id_categoria + '');
        const provObs = this.ds.fetchProveedor(art.id_proveedor + '');
        const obs = zip(catObs, provObs);
        obs.subscribe((arr) => {
          this.setArticulo(art);
          this.setCategoria(arr[0] as Categoria, false);
          this.setProveedor(arr[1] as Proveedor, false);
          this.uneditedFormState = this.form.getRawValue();
        });
      }, (err) => {
          if (err.status === 404) {
            const tempid = this.form.value.id;
            this.form.reset('', {emitEvent: false});
            this.form.controls.id.setValue(tempid, {emitEvent: false});
            this.uneditedFormState = null;
          }
      });
    });
    this.form.controls.id_proveedor.valueChanges.subscribe((val) => {
      this.ds.fetchProveedor(val + '').subscribe(
        (prov: Proveedor) => {
          this.setProveedor(prov, false);
        },
        (err) => {
          if (err.status === 404) {
            this.form.controls.id_proveedor.setValue('', {emitEvent: false});
            this.form.controls.proveedor_nombre.setValue('', {emitEvent: false});
          }
        });
    });
    this.form.controls.id_categoria.valueChanges.subscribe((val) => {
      this.ds.fetchCategoria(val + '').subscribe(
        (cat: Categoria) => {
          this.setCategoria(cat, false);
        },
        (e) => {
          if (e.status === 404) {
            this.form.controls.id_categoria.setValue('', {emitEvent: false});
            this.form.controls.categoria_nombre.setValue('', {emitEvent: false});
          }
        });
    });
    this.form.controls.iva.valueChanges.subscribe((val) => {
      this.onIvaChange(val);
    });
    this.form.controls.coste.valueChanges.subscribe((val) => {
      this.onCosteChange(val);
    });
    this.form.controls.pvp_detalle.valueChanges.subscribe((val) => {
      this.onPVPChange(val, 'detalle');
    });
    this.form.controls.pvp_mayor.valueChanges.subscribe((val) => {
      this.onPVPChange(val, 'mayor');
    });
    this.form.controls.id.setValue('1');
  }
  onIvaChange(v: number): void {
    if (v === null) {
      return void 0;
    }
    const c = this.form.controls;
    if (c.coste.value === null ||
        +c.coste.value === 0) {
      return void 0;
    }

    const coste_mas_iva = Nums.fix3(Nums.sumaIva(+c.coste.value, v));
    c.coste_mas_iva.setValue('' + coste_mas_iva);

    const margen_detalle = Nums.fix3(Nums.margen(+c.pvp_detalle.value, v, +c.coste.value));
    c.margen_detalle.setValue('' + margen_detalle, {emitEvent: false });
    const margen_mayor = Nums.fix3(Nums.margen(+c.pvp_mayor.value, v, +c.coste.value));
    c.margen_mayor.setValue('' + margen_mayor, {emitEvent: false });
  }
  onCosteChange(v: number): void {
    if (v === null) {
      return void 0;
    }
    const c = this.form.controls;
    const fixed = Nums.fix3(v);

    const coste_mas_iva = Nums.fix3(Nums.sumaIva(v, +c.iva.value));
    c.coste_mas_iva.setValue('' + coste_mas_iva);

    const margen_detalle = Nums.fix3(Nums.margen(+c.pvp_detalle.value, +c.iva.value, v));
    c.margen_detalle.setValue('' + margen_detalle, {emitEvent: false });
    const margen_mayor = Nums.fix3(Nums.margen(+c.pvp_mayor.value, +c.iva.value, v));
    c.margen_mayor.setValue('' + margen_mayor, {emitEvent: false });

  }
  onPVPChange(v: number, t: string): void {
    if (v === null) {
      return void 0;
    }
    const c = this.form.controls;
    const tipoMargen = 'margen_' + t;

    if (c.coste.value === null ||
        +c.coste.value === 0) {
      return void 0;
    }
    const margen = Nums.fix3(Nums.margen(v, +c.iva.value, +c.coste.value));
    c[tipoMargen].setValue('' + margen, {emitEvent: false});
  }
  private setProveedor(prov: Proveedor, markAsDirty: boolean): void {
    this.form.controls.id_proveedor.setValue(prov.id, {emitEvent: false});
    this.form.controls.proveedor_nombre.setValue(prov.nombre);
    if (markAsDirty) {
      this.form.markAsDirty();
    }
  }
  private setCategoria(cat: Categoria, markAsDirty: boolean): void {
    this.form.controls.id_categoria.setValue(cat.id, {emitEvent: false});
    this.form.controls.categoria_nombre.setValue(cat.nombre);
    if (markAsDirty) {
      this.form.markAsDirty();
    }
  }
  private setArticulo(art: Articulo): void {
    this.form.reset('', {emitEvent: false});
    this.form.controls.id.setValue(art.id, {emitEvent: false});
    this.form.controls.nombre.setValue(art.nombre);
    this.form.controls.descripcion.setValue(art.descripcion);
    this.form.controls.cantidad_master.setValue(art.cantidad_master);
    this.form.controls.iva.setValue(art.iva, {emitEvent: false});
    this.form.controls.coste.setValue(art.coste);
    this.form.controls.coste_anterior.setValue(art.coste_anterior);
    this.form.controls.pvp_detalle.setValue(art.pvp_detalle);
    this.form.controls.pvp_mayor.setValue(art.pvp_mayor);
  }
  public abrirModalArticulo (): void {
    this.ds.fetchArticulo('all').subscribe((data: Articulo[]) => {
      this.abrirModal(data, (art: Articulo) => {
        this.setArticulo(art);
        this.ds.fetchCategoria(art.id_categoria + '').subscribe(this.setCategoria.bind(this));
        this.ds.fetchProveedor(art.id_proveedor + '').subscribe(this.setProveedor.bind(this));
        this.cerrarModal();
      });
    });
  }
  public abrirModalCategoria (): void {
    this.ds.fetchCategoria('all').subscribe((data: Categoria[]) => {
      this.abrirModal(data, (cat: Categoria) => {
        this.setCategoria(cat, true);
        this.cerrarModal();
      });
    });
  }
  public abrirModalProveedor (): void {
    this.ds.fetchProveedor('all').subscribe((data: Proveedor[]) => {
      this.abrirModal(data, (prov: Proveedor) => {
        this.setProveedor(prov, true);
        this.cerrarModal();
      });
    });
  }
  public guardarRegistro(): void {
    this.ds.editarArticulo(this.form.value).subscribe((art: Articulo ) => {
      this.uneditedFormState = this.form.getRawValue();
      this.form.markAsPristine();
     });
  }
  public anadirRegistro(): void {
    this.ds.fetchArticulo('last').subscribe((art: Articulo) => {
      this.form.reset('', {emitEvent: false});
      this.form.controls.id.setValue( +art.id + 1, {emitEvent: false} );
      this.uneditedFormState = null;
    });
  }
  public eliminarRegistro(): void {

  }
  validarForm(): void {

  }
}
