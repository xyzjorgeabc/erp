import { CalcService as Nums} from '../calc/calc.service';
import { FormControl, ValidationErrors } from '@angular/forms';

export class ValidadorFormService {
  private static numKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  private static sigFlKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '.'];
  private static unsigFlKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
  private static navKeys = ['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'End', 'Home'];
  private static delKeys = ['Backspace', 'clear', 'Cut', 'Delete'];
  constructor() { }
  private static extrIntPart (inp: string): string {
    const input = inp.replace('-', '');
    const puntInd  = input.indexOf('.');
    return input.substring(0, ~puntInd ? puntInd : input.length);
  }
  private static extrDecPart (inp: string): string {
    const input = inp.replace('-', '');
    const puntInd = input.indexOf('.');
    return ~puntInd ? input.substring(puntInd + 1, input.length) : '';
  }
  private static getSelection(ev: KeyboardEvent | any): {start: number, end: number, length: number} {
    let start: number;
    let end: number;
    if ('selectionStart' in ev.target) {
      start = ev.target.selectionStart;
      end = ev.target.selectionEnd;
    } else {
      const s = document.getSelection();
      if ( s.anchorNode.nodeName === '#text' && s.focusNode.nodeName === '#text' && s.focusNode.parentNode === ev.target ) {
        if (s.anchorOffset <= s.focusOffset) {
          start = s.anchorOffset;
          end = s.focusOffset;
        } else {
          start = s.focusOffset;
          end = s.anchorOffset;
        }
      } else {
        start = 0;
        end = 0;
      }
    }
    return { start: start, end: end, length: end - start };
  }
  private static getValue(ev: KeyboardEvent | any): string {
    return 'value' in ev.target ? ev.target.value : ev.target.textContent;
  }
  public static fix3Dec(control: FormControl ): ValidationErrors | null {
    const val = control.value;
    if (val === null) {
      return {
        tipo: 'NaN',
      };
    }
    const fixed = Nums.fix3(val);
    if (fixed !== val) {
      control.setValue(fixed, {emitEvent: false });
    }
    return null;
  }
  public static int(control: FormControl): ValidationErrors | null {
    const val = control.value;
    if (val === null) {
      return {
        tipo: 'NaN',
      };
    }
    if (/^\d+$/.test(val.toString())) {
      return null;
    } else {
      return {
        tipo: 'noInt'
      };
    }
  }
  public static id (control: FormControl): ValidationErrors | null {
    const val = control.value;
    const str = val.toString();
    if (val === null) {
      return {
        tipo: 'NaN'
      };
    }
    if (/^\d+$/.test(str) && str.length <= 11) {
      return null;
    } else {
      return {
        tipo: 'noInt'
      };
    }
  }
  public static nombre(control: FormControl): ValidationErrors | null {
    if (control.value.length > 2 && control.value.length < 50) {
      return null;
    } else {
      return {
        tipo: 'El nombre debe tener entre 2 y 50 caracteres.'
      };
    }
  }
  public static descr(control: FormControl): ValidationErrors | null {
    if (control.value.length < 100) {
      return null;
    } else {
      return {
        tipo: 'El nombre debe tener entre 0 y 100 caracteres.'
      };
    }
  }
  public static fecha (dia: number, mes: number, ano: number): boolean {
    return (ano > 999 && ano < 3000) &&
           (mes > 0 && mes < 13) &&
           ((dia > 0) && (new Date(ano, mes, 0).getDate() >= dia));
  }
  public static unsigFl(ev: KeyboardEvent | any, intLen: number, decLen: number): void {
    const v = this.getValue(ev);
    const s = this.getSelection(ev);
    const k = ev.key;
    const dP = this.extrDecPart(v);
    const iP = this.extrIntPart(v);
    const decimal  = v.indexOf('.');

    if ( ev.type === 'keypress' && !this.unsigFlKeys.includes(k) ) {
      ev.preventDefault();
      return void 0;
    }

    if (~decimal) {
      const puntInd = v.indexOf('.');
      if (Number.isInteger(+k) && (s.start <= puntInd && s.end > puntInd)) {
        const tmp = v.substring(s.start, s.end);
        const newLen = v.replace(tmp, '').length + 1;
        if (newLen > intLen) {
          ev.preventDefault();
          return void 0;
        }
      } else if (ev.key === '.' && !(s.start <= puntInd && s.end > puntInd)) {
        ev.preventDefault();
        return void 0;
      } else if (k === 'Backspace' && ( (s.start <= puntInd && s.end > puntInd) || (puntInd + 1 === s.end && !s.length)) ) {
        const tmp = v.substring(s.length ? s.start : s.start - 1, s.end);
        const newLen = v.replace(tmp, '').length;
        if (newLen > intLen) {
          ev.preventDefault();
          return void 0;
        }
      } else if (k === 'Delete' && ((s.start <= puntInd && s.end > puntInd) || (puntInd === s.end && !s.length))) {
        const tmp = v.substring(s.start, s.length ? s.end : s.end + 1);
        const newLen = v.replace(tmp, '').length;
        if (newLen > intLen) {
          ev.preventDefault();
          return void 0;
        }
      }
    }
    if ( Number.isInteger(+k) ) {
      if (s.length < 1) {
        if ( iP.length >= intLen && ( ~decimal ? s.start <= decimal : true )) {
          ev.preventDefault();
          return void 0;
        }
        if ( ~decimal && s.start > decimal && dP.length >= decLen ) {
          ev.preventDefault();
          return void 0;
        }
      }
    } else if ( k === '.' && ( iP.length - s.start > decLen) ) {
      ev.preventDefault();
      return void 0;
    }
  }
  public static sigFl(ev: KeyboardEvent | any, intLen: number, decLen: number): void {
    const v = this.getValue(ev);
    const s = this.getSelection(ev);
    const k: string = ev.key;
    const dP: string = this.extrDecPart(v);
    const iP: string = this.extrIntPart(v);
    const negativo: number = v.indexOf('-');
    const decimal: number  = v.indexOf('.');

    if ( ev.type === 'keypress' && !this.sigFlKeys.includes(k) ) {
      ev.preventDefault();
      return void 0;
    }
    if (~negativo) {
      if (Number.isInteger(+k) && (s.length < 2 && (s.start === 0) && (iP.length >= intLen))) {
        ev.preventDefault();
        return void 0;
      } else if (k === '-' && !s.length) {
        ev.preventDefault();
        return void 0;
      }
    }
    if (~decimal) {
      const puntInd = v.indexOf('.');
      if (Number.isInteger(+k) && (s.start <= puntInd && s.end > puntInd)) {
        const tmp = v.substring(s.start, s.end);
        const newLen = v.replace(tmp, '').length + 1;
        if (newLen > intLen) {
          ev.preventDefault();
          return void 0;
        }
      } else if (ev.key === '.' && !(s.start <= puntInd && s.end > puntInd)) {
        ev.preventDefault();
        return void 0;
      } else if (k === 'Backspace' && ( (s.start <= puntInd && s.end > puntInd) || (puntInd + 1 === s.end && !s.length)) ) {
        const tmp = v.substring(s.length ? s.start : s.start - 1, s.end);
        const newLen = v.replace(tmp, '').length;
        if (newLen > intLen) {
          ev.preventDefault();
          return void 0;
        }
      } else if (k === 'Delete' && ((s.start <= puntInd && s.end > puntInd) || (puntInd === s.end && !s.length))) {
        const tmp = v.substring(s.start, s.length ? s.end : s.end + 1);
        const newLen = v.replace(tmp, '').length;
        if (newLen > intLen) {
          ev.preventDefault();
          return void 0;
        }
      }
    }

    if ( Number.isInteger(+k) ) {
      if (s.length < 1) {
        if ( iP.length >= intLen && ( ~decimal ? s.start <= decimal : true )) {
          ev.preventDefault();
          return void 0;
        }
        if ( ~decimal && s.start > decimal && dP.length >= decLen ) {
          ev.preventDefault();
          return void 0;
        }
      }
    } else if ( k === '.' && ( iP.length - s.start > decLen) ) {
      ev.preventDefault();
      return void 0;
    } else if ( k === '-' && s.start > 0 ) {
      ev.preventDefault();
      return void 0;
    }
  }
  public static text (ev: KeyboardEvent | any, len: number): void {
    if ( ev.key === 'Enter' || this.getValue(ev).length >= len) {
      ev.preventDefault();
      return void 0;
    }
  }
  public static unsigInt (ev: KeyboardEvent | any, len: number): void {
    if (ev.type === 'keydown') {
      return;
    }

    const s = this.getSelection(ev);
    if (!(this.numKeys.includes(ev.key) && (this.getValue(ev).length < len || s.length))) {
      ev.preventDefault();
      return void 0;
    }
  }
}
export const Errores = {
    NaN: 'Número Inválido.',
    noInt: 'Los números identificadores deben ser enteros.',
    fechaError: 'Fecha Incorrecta.'
  };

