import { Injectable } from '@angular/core';
import { ValidationErrors, FormControl } from '@angular/forms';
import { default as validator } from 'validator';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  constructor() {

  }
  private static getVal (form: FormControl): string {
    return form.value === null ? '' : form.value + '';
  }
  public static isString (nombre: string, form: FormControl): ValidationErrors | null {
    if (form.pristine) { return null; }
    const value = ValidatorService.getVal(form);
    return validator.isAscii(value) ? null : {error: nombre + ': not string'};
  }
  public static isNumber (nombre: string, form: FormControl): ValidationErrors | null {
    if (form.pristine) { return null; }
    const value = ValidatorService.getVal(form);
    return validator.isNumeric(value) ? null : {error: nombre + ': not number'};
  }
  public static isInt (nombre: string, form: FormControl): ValidationErrors | null {
    if (form.pristine) { return null; }
    const value = ValidatorService.getVal(form);
    return validator.isInt(value) ? null : {error: nombre + ': not integer'};
  }
  public static isEmail (nombre: string, form: FormControl): ValidationErrors | null {
    if (form.pristine) { return null; }
    const value = ValidatorService.getVal(form);
    return validator.isEmail(value) ? null : {error: nombre + ': not email'};
  }
  public static isUInt (nombre: string, form: FormControl): ValidationErrors | null {
    if (form.pristine) { return null; }
    const value = ValidatorService.getVal(form);
    return validator.isInt(value) && (+value >= 0) ? null : {error: nombre + ': not unsigned Int', form: form};
  }
  public static isURL (nombre: string, form: FormControl): ValidationErrors | null {
    if (form.pristine) { return null; }
    const value = ValidatorService.getVal(form);
    return validator.isURL(value) ? null : {error: nombre + ': not URL'};
  }
  public static isTLFNumber (nombre: string, form: FormControl): ValidationErrors | null {
    if (form.pristine) { return null; }
    const value = ValidatorService.getVal(form);
    return validator.isMobilePhone(value, 'es-ES') ? null : {error: nombre + ': not telephone'};
  }
  public static isDate (nombre: string, form: FormControl): ValidationErrors | null {
    if (form.pristine) { return null; }
    const tmp = ValidatorService.getVal(form);
    const value = tmp.slice(6, 12) + '-' + tmp.slice(3, 5) + '-' + tmp.slice(0, 2);
    return validator.isISO8601(value) ? null : {error: nombre + ': not date'};
  }
}
