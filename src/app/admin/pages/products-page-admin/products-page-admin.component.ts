import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTableComponent } from "@products/components/product-table/product-table.component";
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-page-admin',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-page-admin.component.html',
  styleUrl: './products-page-admin.component.css'
})
export class ProductsPageAdminComponent {

  _productsService = inject(ProductsService);
  _paginationService = inject(PaginationService);

  productsPerPage = signal(10);

  productsResource = rxResource({
    request: () => (
      {
        page: this._paginationService.currentPage() - 1,
        limit: this.productsPerPage()
      }
    ),
    loader: ({ request }) => this._productsService.getProducts({
      offset: request.page * 9,
      limit: request.limit
    })
  })
}
