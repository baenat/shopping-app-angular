import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCardComponent } from "@products/components/product-card/product-card.component";

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent],
  templateUrl: './gender-page.component.html',
  styleUrl: './gender-page.component.css',
})
export class GenderPageComponent {

  _route = inject(ActivatedRoute);
  _productService = inject(ProductsService);

  gender = toSignal<string>(this._route.params.pipe(map((params) => params['gender'])));

  productsResource = rxResource({
    request: () => (this.gender()),
    loader: ({ request }) => {
      return this._productService.getProducts({ gender: request });
    }
  });

}
