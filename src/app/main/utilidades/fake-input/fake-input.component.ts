import { Component, OnInit, Input, ElementRef, forwardRef, HostBinding, HostListener } from '@angular/core';
import { ValidadorFormService as Val } from '../../../services/ValidadorForm/validador-form.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-fake-input',
  templateUrl: './fake-input.component.html',
  styleUrls: ['./fake-input.component.css'],
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FakeInputComponent), multi: true}]
})
export class FakeInputComponent implements OnInit, ControlValueAccessor {
  private _onChangeListeners: Array<Function>;
  private _onTouchedListeners: Array<Function>;
  private _oldValue = '';
  @Input()
  public type: string;
  @Input()
  public dec: number;
  @Input()
  public int: number;
  @Input()
  public len: number;
  @Input()
  @HostBinding('attr.contenteditable')
  public editable: boolean;
  public _touched: boolean;
  constructor(private el: ElementRef) {
    this.editable = true;
    this._onChangeListeners = [];
    this._onTouchedListeners = [];
  }
  ngOnInit(): void {
  }
  get value(): string {
    return this.el.nativeElement.textContent;
  }
  set value(str: string) {
    this.el.nativeElement.textContent = str;
  }
  @HostListener('keydown', ['$event'])
  @HostListener('keypress', ['$event'])
  @HostListener('keyup', ['$event'])
  public filtro (ev: KeyboardEvent): void {
    switch (this.type) {
      case 'sigFloat':
        Val.sigFl(ev, this.int, this.dec);
        break;
      case 'unsigFloat':
        Val.unsigFl(ev, this.int, this.dec);
        break;
      case 'unsigInt':
        Val.unsigInt(ev, this.int);
        break;
      case 'text':
        Val.text(ev, this.len);
        break;
    }
  }
  @HostListener('blur', ['$event'])
  public dispatchTouch(ev: FocusEvent): void {
    const v = this.value;
    if (v !== this._oldValue && !this._touched) {
      this._onTouchedListeners.forEach(function(fn) {
        fn(v);
      });
      this._touched = true;
    }
    if (v !== this._oldValue) {
      this._onChangeListeners.forEach(function(fn) {
        fn(v);
      });
    }
    this._oldValue = this.value;
  }
  @HostListener('paste', ['$event'])
  @HostListener('drop', ['$event'])
  public nonKeypress(ev: DragEvent): void {
    ev.preventDefault();
  }
  public writeValue(str: string): void {
    this.value = str || '';
    this._oldValue = str || '';
  }
  public registerOnChange(fn: Function): void {
    this._onChangeListeners.push(fn);
  }
  public registerOnTouched(fn: Function): void {
    this._onTouchedListeners.push(fn);
  }
  public setDisabledState(isD: boolean): void {
    this.editable = !isD;
  }
}
