import { ModalMuestraSeleccionComponent } from '../../utilidades/modal-muestra-seleccion/modal-muestra-seleccion.component';
import { ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { FormGroup, ValidationErrors, FormArray, FormControl } from '@angular/forms';

export abstract class ComponenteEditor <T extends object> {

  @ViewChild('modal', { read: ViewContainerRef, static: true })
  private modalContainer: ViewContainerRef;
  private modal: ComponentRef<ModalMuestraSeleccionComponent>;
  protected errors: Set<ValidationErrors>;
  protected abstract CFR: ComponentFactoryResolver;
  protected abstract form: FormGroup;
  protected abstract uneditedFormState: T;
  constructor() {
    this.errors = new Set();
  }
  protected abrirModal(data: Array<T>, onSelect: Function): void {
    if (this.modal) { return void 0; }
    const comp = this.CFR.resolveComponentFactory(ModalMuestraSeleccionComponent);
    const CRI = this.modalContainer.createComponent(comp, 0);
    CRI.instance._data = data;
    CRI.instance.eventoSel.subscribe((reg: T) => {
      onSelect(reg);
      this.cerrarModal();
    });
    CRI.instance.eventoCerrar.subscribe(this.cerrarModal.bind(this));
    CRI.instance.dinamycInit();
    this.modal = CRI;
  }
  protected cerrarModal(): void {
    this.modal.destroy();
    this.modal = null;
  }
  protected updateErrors(): void {
    const tmp = new Set();
    // tslint:disable-next-line: forin
    for (const control in this.form.controls) {
      const formControl: FormControl | FormArray = this.form.controls[control] as FormControl | FormArray;
      if (formControl.pristine) {
        continue;
      }
      if ( formControl instanceof FormArray) {
        for (let i = 0; i < formControl.length ; i++) {
          // tslint:disable-next-line: forin
          for (const controlName in (formControl.controls[i] as FormGroup).controls) {
            console.log(formControl.controls[i]);
            const error = (formControl.controls[i] as FormGroup) .controls[controlName].errors;
            if (error) {
              tmp.add(error);
            }
          }
        }
      } else {
        const error = this.form.controls[control].errors;
        if (error) {
          tmp.add(error);
        }
      }
    }
    console.log('\n \n \n \n \n \n \n \n \n \n \n \n \n \n ');
    this.errors = tmp;
  }
  public siguienteRegistro(): void {
    this.form.controls.id.setValue((+this.form.value.id + 1) + '');
  }
  public anteriorRegistro(): void {
    const anterior = this.form.value.id - 1;
    this.form.controls.id.setValue((anterior > 0 ? anterior : 1) + '');
  }
  public deshacerCambios(): void {
    const tempid = this.form.value.id;
    this.form.reset('', {emitEvent: false});
    if (this.uneditedFormState) {
      this.form.setValue(this.uneditedFormState, {emitEvent: false});
    } else {
      this.form.controls.id.setValue(tempid, {emitEvent: false});
    }
    this.updateErrors();
  }
  public abstract anadirRegistro(): void;
  public abstract eliminarRegistro(): void;
  public abstract guardarRegistro(): void;
}

export interface CompEditable {
  deshacerCambios(): void;
  anteriorRegistro(): void;
  siguienteRegistro(): void;
  anadirRegistro(): void;
  eliminarRegistro(): void;
  guardarRegistro(): void;
}
