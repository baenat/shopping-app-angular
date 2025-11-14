import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { ProductPageAdminComponent } from "./pages/product-page-admin/product-page-admin.component";
import { ProductsPageAdminComponent } from "./pages/products-page-admin/products-page-admin.component";

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'products',
        component: ProductsPageAdminComponent,
      },
      {
        path: 'product/:id',
        component: ProductPageAdminComponent,
      },
      {
        path: '**',
        redirectTo: 'products'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
]
