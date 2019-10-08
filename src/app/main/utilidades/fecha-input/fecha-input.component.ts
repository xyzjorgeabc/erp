import { Component, OnInit, ViewChild, ElementRef, Input, forwardRef } from '@angular/core';
import { FormControl, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValidadorFormService as Val} from '../../../services/ValidadorForm/validador-form.service';

@Component({
  selector: 'app-fecha-input',
  templateUrl: './fecha-input.component.html',
  styleUrls: ['./fecha-input.component.css'],
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FechaInputComponent), multi: true}]
})
export class FechaInputComponent implements OnInit, ControlValueAccessor {
  @Input()
  public id: string;
  @Input()
  public btn: boolean;
  public form: FormGroup;
  public selectorOn = false;
  @ViewChild('mes', { static: true })
  private elMes: ElementRef;
  @ViewChild('ano', { static: true })
  private elAno: ElementRef;
  private dia: number;
  private mes: number;
  private ano: number;
  private _onChangeListeners: Function[];
  private _onTouchedListeners: Function[];
  constructor() {
    this._onChangeListeners = [];
    this._onTouchedListeners = [];
    this.form = new FormGroup({
      dia: new FormControl('', {updateOn: 'change'}),
      mes: new FormControl('', {updateOn: 'change'}),
      ano: new FormControl('', {updateOn: 'change'}),
    }, {updateOn: 'change'});
  }
  public ngOnInit() {
    this.form.valueChanges.subscribe((f: Fecha) => {
      this._onChangeListeners.forEach((cb) => {
        cb(f.dia + '-' + f.mes + '-' + f.ano);
       });
    });
  }
  public onDiaChange(val: string): void {
    if (val.length === 2) {
      const n = this.elMes.nativeElement;
      n.focus();
      n.select();
    }
  }
  public onMesChange(val: string): void {
    if (val.length === 2) {
      const n = this.elAno.nativeElement;
      n.focus();
      n.select();
    }
  }
  public onKDia(ev: KeyboardEvent | any) {
    Val.unsigInt(ev, 2);
  }
  public onKMes(ev: KeyboardEvent | any) {
    Val.unsigInt(ev, 2);
  }
  public onKAno(ev: KeyboardEvent | any) {
    Val.unsigInt(ev, 4);
  }
  public mostrarSelector(): void {
    this.selectorOn = !this.selectorOn;
  }
  public writeValue(fecha: string): void {
    if ( fecha === null ) {
      this.form.reset('', {emitEvent: false});
      return void 0;
    }
    const c = this.form.controls;
    const [dia, mes, ano] = fecha.split('-');
    c.dia.setValue(dia.padStart(2, '0'), {emitEvent: false});
    c.mes.setValue(mes.padStart(2, '0'), {emitEvent: false});
    c.ano.setValue(ano, {emitEvent: false});
  }
  public registerOnChange(cb: Function): void {
    this._onChangeListeners.push(cb);
  }
  public registerOnTouched(cb: Function): void {
    this._onTouchedListeners.push(cb);
  }
  public onFechaSelect(fecha: string): void {
    this.writeValue(fecha);
    this._onChangeListeners.forEach((cb) => { cb(fecha); });
    this.selectorOn = false;
  }
}

export interface Fecha {
  dia: number;
  mes: number;
  ano: number;
}
