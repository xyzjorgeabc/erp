import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginCardComponent} from './login-card/login-card.component';
import { MenuComponent } from './main/menu/menu.component';
import { MantenimientoProveedorComponent } from './main/sections/mantenimiento/mantenimiento-proveedor/mantenimiento-proveedor.component';
import { BreadcrumbComponent } from './main/breadcrumb/breadcrumb.component';
import { MantenimientoArticulosComponent } from './main/sections/mantenimiento/mantenimiento-articulos/mantenimiento-articulos.component';
import { MantenimientoClientesComponent } from './main/sections/mantenimiento/mantenimiento-clientes/mantenimiento-clientes.component';
import { MantenimientoCategoriasComponent } from './main/sections/mantenimiento/mantenimiento-categorias/mantenimiento-categorias.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CalcService } from './services/calc/calc.service';
import { GridComponent } from './main/utilidades/grid/grid/grid.component';
import { ComprasAlbaranesComponent } from './main/sections/compras/compras-albaranes/compras-albaranes.component';
import { NavBarComponent } from './main/utilidades/navBar/nav-bar/nav-bar.component';
import { FilaComponent } from './main/utilidades/grid/fila/fila/fila.component';
import { NavegacionService } from './services/navegacion/navegacion.service';
import { ComprasFacturasComponent } from './main/sections/compras/compras-facturas/compras-facturas.component';
import { ModalSeleccionAlbaranesComponent } from './main/utilidades/modal-seleccion-albaranes/modal-seleccion-albaranes.component';
import { VentasPedidosComponent } from './main/sections/ventas/ventas-pedidos/ventas-pedidos.component';
import { VentasAlbaranesComponent } from './main/sections/ventas/ventas-albaranes/ventas-albaranes.component';
import { VentasFacturasComponent } from './main/sections/ventas/ventas-facturas/ventas-facturas.component';
import { MantenimientoTiposPagoComponent } from './main/sections/mantenimiento/mantenimiento-tipos-pago/mantenimiento-tipos-pago.component';
import { LoginService } from './services/login/login.service';
import { HttpClientModule} from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SelectorFechaComponent } from './main/utilidades/selector-fecha/selector-fecha.component';
import { FechaInputComponent } from './main/utilidades/fecha-input/fecha-input.component';
import { FakeInputComponent } from './main/utilidades/fake-input/fake-input.component';
import { ModalMuestraSeleccionComponent } from './main/utilidades/modal-muestra-seleccion/modal-muestra-seleccion.component';
import { ModalSeleccionAlbaranesVentaComponent } from './main/utilidades/modal-seleccion-albaranes-venta/modal-seleccion-albaranes-venta.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginCardComponent,
    MenuComponent,
    MantenimientoProveedorComponent,
    BreadcrumbComponent,
    MantenimientoArticulosComponent,
    MantenimientoClientesComponent,
    MantenimientoCategoriasComponent,
    GridComponent,
    ComprasAlbaranesComponent,
    NavBarComponent,
    FilaComponent,
    ComprasFacturasComponent,
    ModalSeleccionAlbaranesComponent,
    VentasPedidosComponent,
    VentasAlbaranesComponent,
    VentasFacturasComponent,
    MantenimientoTiposPagoComponent,
    MainComponent,
    DashboardComponent,
    SelectorFechaComponent,
    FechaInputComponent,
    FakeInputComponent,
    ModalMuestraSeleccionComponent,
    ModalSeleccionAlbaranesVentaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  entryComponents: [FilaComponent, ModalSeleccionAlbaranesComponent, ModalSeleccionAlbaranesVentaComponent],
  providers: [CalcService, NavegacionService, LoginService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
