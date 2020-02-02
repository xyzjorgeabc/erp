import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NavegacionService } from '../../../../services/navegacion/navegacion.service';
import { DataService, Cliente, MetodoPago } from '../../../../services/data/data.service';
import { ComponenteEditor, CompEditable } from '../mantenimiento-comp';
import { ValidatorService } from 'src/app/services/validator/validator.service';
@Component({
  selector: 'app-mantenimiento-clientes',
  templateUrl: './mantenimiento-clientes.component.html',
  styleUrls: ['./mantenimiento-clientes.component.css', '../../seccion.css']
})
export class MantenimientoClientesComponent extends ComponenteEditor<Cliente | MetodoPago> implements OnInit, CompEditable {
  public form: FormGroup;
  protected uneditedFormState: Cliente;
  constructor(private ns: NavegacionService, private ds: DataService, protected CFR: ComponentFactoryResolver) {
    super();
    this.form = new FormGroup({
      id:                    new FormControl('', {updateOn: 'change', validators: ValidatorService.isUInt.bind(null, 'id cliente')}),
      nombre_comercial:      new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'nombre comercial cliente')}),
      cif:                   new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'cif cliente')}),
      persona_contacto:      new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'persona contacto cliente')}),
      direccion:             new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'dirección cliente')}),
      telefono:              new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'telefono cliente')}),
      fax:                   new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'fax cliente')}),
      precio_albaran:        new FormControl(),
      factura_automatica:    new FormControl(),
      fecha_captacion:       new FormControl(),
      fecha_nacimiento:      new FormControl(),
      id_metodo_pago:        new FormControl('', {updateOn: 'change', validators: ValidatorService.isUInt.bind(null, 'id metodo pago')}),
      nombre_metodo_pago:    new FormControl({value: null, disabled: true}),
      cuenta_bancaria:       new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'cuentea bancaria cliente')}),
      sitio_web:             new FormControl('', {updateOn: 'change', validators: ValidatorService.isURL.bind(null, 'sitio web cliente')}),
      email:                 new FormControl('', {updateOn: 'change', validators: ValidatorService.isEmail.bind(null, 'email cliente')}),
      descuento:             new FormControl('', {updateOn: 'change', validators: ValidatorService.isNumber.bind(null, 'descuento de cliente')}),
      informacion_adicional: new FormControl('', {updateOn: 'change', validators: ValidatorService.isString.bind(null, 'info adicional cliente')})
    });
  }
  ngOnInit() {

    this.ns.navegacion.next(['Mantenimiento', 'Clientes']);

    this.form.controls.id.valueChanges.subscribe((val) => {
      if (this.uneditedFormState && (this.uneditedFormState.id === val)) {
        return void 0;
      }
      if (this.form.controls.id.invalid) {
        return void 0;
      }
      this.ds.fetchCliente(val).subscribe((cliente: Cliente) => {
        this.ds.fetchMetodoPago(cliente.id_metodo_pago + '').subscribe((metodo: MetodoPago) => {
          this.setRegistro(cliente);
          this.setMetodoPago(metodo, false);
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
  private setRegistro(cliente: Cliente): void {
      this.form.reset('', {emitEvent: false});
      this.form.controls.id.setValue(cliente.id, {emitEvent: false});
      this.form.controls.nombre_comercial.setValue(cliente.nombre_comercial, {emitEvent: false});
      this.form.controls.cif.setValue(cliente.cif, {emitEvent: false});
      this.form.controls.persona_contacto.setValue(cliente.persona_contacto, {emitEvent: false});
      this.form.controls.direccion.setValue(cliente.direccion, {emitEvent: false});
      this.form.controls.telefono.setValue(cliente.telefono, {emitEvent: false});
      this.form.controls.fax.setValue(cliente.fax, {emitEvent: false});
      this.form.controls.precio_albaran.setValue(!!+cliente.precio_albaran, {emitEvent: false});
      this.form.controls.factura_automatica.setValue(!!+cliente.factura_automatica, {emitEvent: false});
      this.form.controls.fecha_captacion.setValue(cliente.fecha_captacion);
      this.form.controls.fecha_nacimiento.setValue(cliente.fecha_nacimiento, {emitEvent: false});
      this.form.controls.cuenta_bancaria.setValue(cliente.cuenta_bancaria, {emitEvent: false});
      this.form.controls.sitio_web.setValue(cliente.sitio_web, {emitEvent: false});
      this.form.controls.email.setValue(cliente.email, {emitEvent: false});
      this.form.controls.descuento.setValue(cliente.descuento, {emitEvent: false});
      this.form.controls.informacion_adicional.setValue(cliente.informacion_adicional, {emitEvent: false});
  }
  private setMetodoPago(metodo: MetodoPago, markAsDirty: boolean): void {
    this.form.controls.id_metodo_pago.setValue(metodo.id, {emitEvent: false});
    this.form.controls.nombre_metodo_pago.setValue(metodo.nombre, {emitEvent: false});
    if (markAsDirty) {
      this.form.markAsDirty();
    }
  }
  public abrirModalMetodoPago(): void {
    this.ds.fetchMetodoPago('all').subscribe((data: MetodoPago[]) => {
      this.abrirModal(data, (metodo: MetodoPago) => {
        this.setMetodoPago(metodo, true);
      });
    });
  }
  public abrirModalCliente(): void {
    this.ds.fetchCliente('all').subscribe((data: Cliente[]) => {
      this.abrirModal(data, (cliente: Cliente) => {
        this.ds.fetchMetodoPago(cliente.id_metodo_pago + '').subscribe( (metodo: MetodoPago) => {
          this.setRegistro(cliente);
          this.setMetodoPago(metodo, false);
        });
      });
    });
  }
  public guardarRegistro(): void {
    this.ds.editarCliente(this.form.value).subscribe((cl: Cliente) => {
      this.uneditedFormState = this.form.getRawValue();
      this.form.markAsPristine();
    });
  }
  public anadirRegistro(): void {
    this.ds.fetchCliente('last').subscribe((cl: Cliente) => {
      this.form.reset('', {emitEvent: false});
      this.form.controls.id.setValue(+cl.id + 1, {emitEvent: false});
      this.uneditedFormState = null;
    });
  }
  public eliminarRegistro(): void {
    this.ds.deleteCliente(this.form.controls.id.value).subscribe(() => {
      const tempid = this.form.value.id;
      this.form.reset('', {emitEvent: false});
      this.form.controls.id.setValue(tempid, {emitEvent: false});
      this.uneditedFormState = null;
    }, function(err) {
      alert('El registro está siendo usado por otro registro.');
    });
  }
}
