import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService, Proveedor, MetodoPago } from 'src/app/services/data/data.service';
import { CompEditable, ComponenteEditor } from '../mantenimiento-comp';
import { ValidatorService } from 'src/app/services/validator/validator.service';
@Component({
  selector: 'app-mantenimiento-proveedor',
  templateUrl: './mantenimiento-proveedor.component.html',
  styleUrls: ['./mantenimiento-proveedor.component.css', '../../seccion.css']
})
export class MantenimientoProveedorComponent extends ComponenteEditor<Proveedor | MetodoPago> implements OnInit, CompEditable {
  public form: FormGroup;
  protected uneditedFormState: Proveedor;
  constructor(private ns: NavegacionService, private ds: DataService, protected CFR: ComponentFactoryResolver) {
    super();
    this.form = new FormGroup({
      id:                    new FormControl('', {updateOn: 'change', validators: ValidatorService.isUInt.bind(null, 'id proveedor')}),
      nombre:                new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'nombre proveedor')}),
      cif:                   new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'cif proveedor')}),
      persona_contacto:      new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'persona contacto proveedor')}),
      direccion:             new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'dirección proveedor')}),
      telefono:              new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'telefono proveedor')}),
      fax:                   new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'fax proveedor')}),
      id_metodo_pago:        new FormControl('', {updateOn: 'change', validators: ValidatorService.isUInt.bind(null, 'id metodo pago')}),
      nombre_metodo_pago:    new FormControl({value: null, disabled: true}),
      cuenta_bancaria:       new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'cuenta bancaria proveedor')}),
      sitio_web:             new FormControl('', {updateOn: 'change', validators: ValidatorService.isURL.bind(null, 'sitio web proveedor')}),
      email:                 new FormControl('', {updateOn: 'change', validators: ValidatorService.isEmail.bind(null, 'email proveedor')}),
      informacion_adicional: new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'info adicional proveedor')}),
    });
  }
  ngOnInit() {

    this.ns.navegacion.next(['Mantenimiento', 'Proveedores']);

    this.form.controls.id.valueChanges.subscribe((val) => {
      if (this.uneditedFormState && (this.uneditedFormState.id === val)) {
        return void 0;
      }
      if (this.form.controls.id.invalid) {
        return void 0;
      }
      this.ds.fetchProveedor(val).subscribe((prov: Proveedor) => {
        this.ds.fetchMetodoPago(prov.id_metodo_pago + '').subscribe((metodo: MetodoPago) => {
          this.setRegistro(prov);
          this.setMetodoPago(metodo, false);
          this.uneditedFormState = this.form.getRawValue();
        });
      }, (err) => {
        if (err.status) {
          const tempid = this.form.value.id;
          this.form.reset('', {emitEvent: false});
          this.form.controls.id.setValue(tempid, {emitEvent: false});
          this.uneditedFormState = null;
        }
      });
    });
    this.form.controls.id_metodo_pago.valueChanges.subscribe((val) => {
      if (this.form.controls.id_metodo_pago.invalid) {
        return void 0;
      }
      this.ds.fetchMetodoPago(val).subscribe((metodo: MetodoPago) => {
        this.setMetodoPago(metodo, true);
      },
      (err) => {
        if (err.status === 404) {
          this.form.controls.id_metodo_pago.setValue('', {emitEvent: false});
          this.form.controls.nombre_metodo_pago.setValue('', {emitEvent: false});
        }
      });
    });
    this.form.controls.id.setValue('1');
    this.form.valueChanges.subscribe(this.updateErrors.bind(this));
  }
  private setRegistro(prov: Proveedor): void {
    this.form.reset('', {emitEvent: false});
    this.form.controls.id.setValue(prov.id, {emitEvent: false});
    this.form.controls.nombre.setValue(prov.nombre);
    this.form.controls.cif.setValue(prov.cif);
    this.form.controls.persona_contacto.setValue(prov.persona_contacto);
    this.form.controls.direccion.setValue(prov.direccion);
    this.form.controls.telefono.setValue(prov.telefono);
    this.form.controls.fax.setValue(prov.fax);
    this.form.controls.cuenta_bancaria.setValue(prov.cuenta_bancaria);
    this.form.controls.sitio_web.setValue(prov.sitio_web);
    this.form.controls.email.setValue(prov.email);
    this.form.controls.informacion_adicional.setValue(prov.informacion_adicional);
  }
  private setMetodoPago(metodo: MetodoPago, markAsDirty: boolean): void {
    this.form.controls.id_metodo_pago.setValue(metodo.id, {emitEvent: false});
    this.form.controls.nombre_metodo_pago.setValue(metodo.nombre, {emitEvent: false});
    if (markAsDirty) {
      this.form.markAsDirty();
    }
  }
  public abrirModalProveedor(): void {
    this.ds.fetchProveedor('all').subscribe((data: Proveedor[]) => {
      this.abrirModal(data, (prov: Proveedor) => {
        this.ds.fetchMetodoPago(prov.id_metodo_pago + '').subscribe((metodo: MetodoPago) => {
          this.setRegistro(prov);
          this.setMetodoPago(metodo, false);
        });
      });
    });
  }
  public abrirModalMetodoPago(): void {
    this.ds.fetchMetodoPago('all').subscribe((data: MetodoPago[]) => {
      this.abrirModal(data, (metodo: MetodoPago) => {
        this.setMetodoPago(metodo, true);
      });
    });
  }
  public guardarRegistro(): void {
    this.ds.editarProveedor(this.form.value).subscribe(() => {
      this.form.markAsPristine();
      this.uneditedFormState = this.form.getRawValue();
    });
  }
  public anadirRegistro(): void {
    this.ds.fetchProveedor('last').subscribe((prov: Proveedor) => {
      this.form.reset('', {emitEvent: false});
      this.form.controls.id.setValue(+prov.id + 1, {emitEvent: false});
      this.uneditedFormState = null;
    });
  }
  public eliminarRegistro(): void {

    this.ds.deleteProveedor(this.form.controls.id.value).subscribe(() => {
      const tempid = this.form.value.id;
      this.form.reset('', {emitEvent: false});
      this.form.controls.id.setValue(tempid, {emitEvent: false});
      this.uneditedFormState = null;
    }, function(err) {
      alert('El registro está siendo usado por otro registro.');
    });

  }
}
