import { ModalMuestraSeleccionComponent } from '../../utilidades/modal-muestra-seleccion/modal-muestra-seleccion.component';
import { ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { FormGroup } from '@angular/forms';

export abstract class ComponenteEditor <T extends object> {

  @ViewChild('modal', { read: ViewContainerRef, static: true })
  private modalContainer: ViewContainerRef;
  private modal: ComponentRef<ModalMuestraSeleccionComponent>;
  protected abstract CFR: ComponentFactoryResolver;
  protected abstract form: FormGroup;
  protected abstract uneditedFormState: T;
  constructor() {

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
