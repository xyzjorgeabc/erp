import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginCardComponent } from './login-card/login-card.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { MantenimientoArticulosComponent } from './main/sections/mantenimiento/mantenimiento-articulos/mantenimiento-articulos.component';
import { MantenimientoCategoriasComponent } from './main/sections/mantenimiento/mantenimiento-categorias/mantenimiento-categorias.component';
import { MantenimientoClientesComponent } from './main/sections/mantenimiento/mantenimiento-clientes/mantenimiento-clientes.component';
import { MantenimientoProveedorComponent } from './main/sections/mantenimiento/mantenimiento-proveedor/mantenimiento-proveedor.component';
import { ComprasAlbaranesComponent } from './main/sections/compras/compras-albaranes/compras-albaranes.component';
import { ComprasFacturasComponent} from './main/sections/compras/compras-facturas/compras-facturas.component';
import { VentasPedidosComponent} from './main/sections/ventas/ventas-pedidos/ventas-pedidos.component';
import { VentasAlbaranesComponent} from './main/sections/ventas/ventas-albaranes/ventas-albaranes.component';
import { VentasFacturasComponent} from './main/sections/ventas/ventas-facturas/ventas-facturas.component';
import { ModalMuestraSeleccionComponent } from './main/utilidades/modal-muestra-seleccion/modal-muestra-seleccion.component';

const routes: Routes = [
  {path: 'login',
   component: LoginCardComponent},
  {path: 'main',
   component: MainComponent,
   children: [
      {path: '',
      component: DashboardComponent},
      {path: 'test',
       component: ModalMuestraSeleccionComponent},
      {path: 'mantenimiento/articulos',
      component: MantenimientoArticulosComponent},
      {path: 'mantenimiento/categorias',
        component: MantenimientoCategoriasComponent},
      {path: 'mantenimiento/clientes',
        component: MantenimientoClientesComponent},
      {path: 'mantenimiento/proveedores',
        component: MantenimientoProveedorComponent},
      {path: 'compras/albaranes',
        component: ComprasAlbaranesComponent},
      {path: 'compras/facturas',
        component: ComprasFacturasComponent},
      {path: 'ventas/pedidos',
        component: VentasPedidosComponent},
      {path: 'ventas/albaranes',
        component: VentasAlbaranesComponent},
      {path: 'ventas/facturas',
        component: VentasFacturasComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
