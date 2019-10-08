import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalcService {
  static pvp(iva: number, margen: number, precioCompra: number): number {
    return precioCompra * (margen / 100 + 1 ) * (iva / 100 + 1 );
  }
  static sumaIva(precioCompra: number, iva: number): number {
    return precioCompra * (iva / 100 + 1);
  }
  static margen(pvp: number, iva: number, precioCompra: number): number {
    const precioVentaSinIVA = pvp / (iva / 100 + 1);
    return (precioVentaSinIVA / precioCompra - 1) * 100;
  }
  static fix3(n: number): number {
    const str = n.toString();
    const dotI = str.lastIndexOf('.');
    const dec = str.substring(dotI + 1);
    const ent = str.substring(0, dotI + 1);
    if ( ~dotI && dec.length > 3 ) {
      return +(ent + dec.substring(0, 3));
    }
    return n;
  }
  static aplicarDescuento(importe: number, descuento: number ): number {
    return importe * ((100 - descuento) / 100);
  }
  static aplicarIVA(importe: number, iva: number): number {
    return importe * (iva / 100 + 1);
  }
  constructor() { }
}
