import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCardComponent } from "@products/components/product-card/product-card.component";
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
  styleUrl: './gender-page.component.css',
})
export class GenderPageComponent {

  _route = inject(ActivatedRoute);
  _productService = inject(ProductsService);
  _paginationService = inject(PaginationService);

  gender = toSignal<string>(this._route.params.pipe(map((params) => params['gender'])));

  productsResource = rxResource({
    request: () => ({
      gender: this.gender(),
      page: this._paginationService.currentPage() - 1
    }),
    loader: ({ request }) => {
      return this._productService.getProducts({
        gender: request.gender,
        offset: request.page * 9,
      });
    }
  });

}
