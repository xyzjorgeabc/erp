import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private static SERVER = 'http://127.0.0.1:3000';
  private static DEFAULT_HEADERS = {
    FETCH: {headers: new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'})},
    EDITAR: {headers: new HttpHeaders({'Content-Type': 'application/json'}), responseType: 'text' as 'json'}, // Error en definicion de tipos.
    ELIMINAR: {}
  };
  constructor( private http: HttpClient ) {
  }

  public fetchArticulo(id: string): Observable<Articulo | Articulo[]> {
    return this.http.post(
      DataService.SERVER + '/fetch/articulo', JSON.stringify({articulo: {id: id}, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<Articulo | Articulo[]>;
  }
  public fetchProveedor(id: string): Observable<Proveedor | Proveedor[]> {
    return this.http.post(
      DataService.SERVER + '/fetch/proveedor', JSON.stringify({proveedor: {id: id}, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<Proveedor | Proveedor[]>;
  }
  public fetchCategoria(id: string): Observable<Categoria | Categoria[]> {
    return this.http.post(
      DataService.SERVER + '/fetch/categoria', JSON.stringify({categoria: {id: id}, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<Categoria| Categoria[]>;
  }
  public fetchMetodoPago(id: string): Observable<MetodoPago | MetodoPago[]> {
    return this.http.post(
      DataService.SERVER + '/fetch/metodo_pago', JSON.stringify({metodo_pago: {id: id}, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<MetodoPago | MetodoPago[]>;
  }
  public fetchCliente(id: string): Observable<Cliente | Cliente[]> {
    return this.http.post(
      DataService.SERVER + '/fetch/cliente', JSON.stringify({cliente: { id: id }, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<Cliente | Cliente[]>;
  }
  public fetchSerie(id: string): Observable<Serie | Serie[]> {
    return this.http.post(
      DataService.SERVER + '/fetch/serie', JSON.stringify({serie: {id: id}, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<Serie | Serie[]>;
  }
  public fetchListaAlbaranCompra(idSerie: string): Observable<MuestraAlbaranCompra[]> {
    return this.http.post(
      DataService.SERVER + '/fetch/listar/albaran_compra', JSON.stringify({albaran_compra: {id_serie: idSerie}, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<MuestraAlbaranCompra[]>;
  }
  public fetchListaAlbaranVenta(idSerie: string): Observable<MuestraAlbaranVenta[]> {
    return this.http.post(
      DataService.SERVER + '/listar/albaran_venta', JSON.stringify({albaran_venta: {id_serie: idSerie}, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<MuestraAlbaranVenta[]>;
  }
  public fetchAlbaranCompra(idSerie: number, id: number): Observable<AlbaranCompra | AlbaranCompra[]> {
    return this.http.post(
      DataService.SERVER + '/fetch/albaran_compra', JSON.stringify({albaran_compra: {id_serie: idSerie, id: id}, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<AlbaranCompra | AlbaranCompra[]>;
  }
  public fetchFacturaCompra(idSerie: string, id: string): Observable<FacturaCompra | FacturaCompra[]> {
    return this.http.post(
      DataService.SERVER + '/fetch/factura_compra', JSON.stringify({factura_compra: {id_serie: idSerie, id: id}, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<FacturaCompra | FacturaCompra[]>;
  }
  public fetchFacturaVenta(idSerie: string, id: string): Observable<FacturaVenta | FacturaVenta[]> {
    return this.http.post(
      DataService.SERVER + '/fetch/factura_venta', JSON.stringify({factura_venta: {id_serie: idSerie, id: id}, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<FacturaVenta | FacturaVenta[]>;
  }
  public fetchAlbaranVenta(idSerie: number, id: number|string): Observable<AlbaranVenta | AlbaranVenta[]> {
    return this.http.post(
      DataService.SERVER + '/fetch/albaran_venta', JSON.stringify({albaran_venta: {id_serie: idSerie, id: id}, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<AlbaranVenta | AlbaranVenta[]>;
  }
  public editarArticulo(articulo: Articulo): Observable<Articulo> {
    return this.http.post(
      DataService.SERVER + '/editar/articulo', JSON.stringify({articulo: articulo, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.EDITAR) as Observable<Articulo>;
  }
  public editarProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post(
      DataService.SERVER + '/editar/proveedor', JSON.stringify({proveedor: proveedor, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.EDITAR) as Observable<Proveedor>;
  }
  public editarCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post(
      DataService.SERVER + '/editar/categoria', JSON.stringify({categoria: categoria, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.EDITAR) as Observable<Categoria>;
  }
  public editarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post(
      DataService.SERVER + '/editar/cliente', JSON.stringify({cliente: cliente, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.EDITAR) as Observable<Cliente>;
  }
  public editarAlbaranCompra(albaranCompra: AlbaranCompra): Observable<AlbaranCompra> {
    return this.http.post(
      DataService.SERVER + '/editar/albaran_compra', JSON.stringify({albaran_compra: albaranCompra, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.EDITAR) as Observable<AlbaranCompra>;
  }
  public editarFacturaCompra(facturaCompra: FacturaCompra): Observable<FacturaCompra> {
    return this.http.post(
      DataService.SERVER + '/editar/factura_compra', JSON.stringify({factura_compra: facturaCompra, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.EDITAR) as Observable<FacturaCompra>;
  }
  public buscarAlbaranesCompra(fechaDesde: string, fechaHasta: string, idSerie: number): Observable<AlbaranCompra[]> {
    return this.http.post(
      DataService.SERVER + '/buscar/albaranes_compra',
      JSON.stringify({albaran_compra: {id_serie: idSerie, fecha_desde: fechaDesde, fecha_hasta: fechaHasta}, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<AlbaranCompra[]>;
  }
  public buscarAlbaranesVenta(fechaDesde: string, fechaHasta: string, idSerie: number): Observable<AlbaranVenta[]> {
    return this.http.post(
      DataService.SERVER + '/buscar/albaranes_venta',
      JSON.stringify({albaran_venta: {id_serie: idSerie, fecha_desde: fechaDesde, fecha_hasta: fechaHasta}, token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<AlbaranVenta[]>;
  }
  public statsGastos(): Observable<Array<number>> {
    return this.http.post(
      DataService.SERVER + '/stats/gastos',
      JSON.stringify({token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<Array<number>>;
  }
  public statsTopProveedores(): Observable<Object> {
    return this.http.post(
      DataService.SERVER + '/stats/top_prov',
      JSON.stringify({token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<Object>;
  }
  public statsVentas(): Observable<Array<number>> {
    return this.http.post(
      DataService.SERVER + '/stats/ventas',
      JSON.stringify({token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<Array<number>>;
  }
  public statsTopClientes(): Observable<Object> {
    return this.http.post(
      DataService.SERVER + '/stats/top_clientes',
      JSON.stringify({token: localStorage.getItem('token')}),
      DataService.DEFAULT_HEADERS.FETCH) as Observable<Object>;
  }
}

export interface Serie {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_desde: string;
  fecha_hasta: string;
}
export interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  id_categoria: number;
  id_proveedor: number;
  cantidad_master: number;
  iva: number;
  coste_anterior: number;
  coste: number;
  pvp_detalle: number;
  pvp_mayor: number;
}
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  iva_por_defecto: number;
}
export interface Cliente {
  id: number;
  nombre_comercial: string;
  cif: string;
  persona_contacto: string;
  direccion: string;
  telefono: string;
  fax: string;
  precio_albaran: boolean;
  factura_automatica: boolean;
  id_metodo_pago: number;
  cuenta_bancaria: string;
  sitio_web: string;
  email: string;
  fecha_nacimiento: string;
  fecha_captacion: string;
  descuento: number;
  informacion_adicional: string;
}
export interface Proveedor {
  id: number;
  nombre: string;
  cif: string;
  persona_contacto: string;
  direccion: string;
  telefono: string;
  fax: string;
  id_metodo_pago: number;
  cuenta_bancaria: string;
  sitio_web: string;
  email: string;
  informacion_adicional: string;
}
export interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string;
}
export interface AlbaranCompra {
  id_serie: number;
  id: number;
  id_proveedor: number;
  fecha: string;
  id_albaran_proveedor: string;
  id_metodo_pago: number;
  descuento_general: number;
  id_serie_factura: number;
  id_factura: number;
  registros: RegistroAlbaranCompra[];
}
export interface RegistroAlbaranCompra {
  n: number;
  id_articulo: number;
  nombre_registro: string;
  iva: number;
  cantidad_master: number;
  precio_coste: number;
  descuento: number;
  cantidad: number;
}
export interface MuestraAlbaranCompra {
  id: number;
  fecha: string;
  id_albaran_proveedor: string;
  nombre_proveedor: string;
  nombre_metodo: string;
  descuento_general: number;
  import: number;
}
export interface FacturaCompra {
  id_serie: number;
  id: number;
  id_proveedor: number;
  fecha: string;
  id_factura_proveedor: string;
  id_metodo_pago: number;
  descuento_general: number;
  albaranes: AlbaranCompra[];
}

export interface PedidoVenta {
  id_serie: number;
  id: number;
  id_cliente: number;
  fecha_pedido: string;
  fecha_entrega: string;
  id_serie_albaran: number;
  id_albaran: number;
}
export interface AlbaranVenta {
  id_serie: number;
  id: number;
  id_cliente: number;
  id_metodo_pago: number;
  fecha: string;
  descuento_general: number;
  id_serie_factura: number;
  id_factura: number;
  registros: RegistroAlbaranCompra[];
}
export interface RegistroAlbaranVenta {
  n: number;
  id_articulo: number;
  nombre_registro: string;
  iva: number;
  cantidad_master: number;
  precio_coste: number;
  descuento: number;
  cantidad: number;
}
export interface MuestraAlbaranVenta {
  id: number;
  fecha: string;
  nombre_cliente: string;
  nombre_metodo: string;
  descuento_general: number;
  importe: number;
}
export interface FacturaVenta {
  id_serie: number;
  id: number;
  id_cliente: number;
  fecha: string;
  id_metodo_pago: number;
  descuento_general: number;
  albaranes: AlbaranVenta[];
}
