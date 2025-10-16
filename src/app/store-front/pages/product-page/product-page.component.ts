import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css',
})
export class ProductPageComponent {

  _productIdSlug = inject(ActivatedRoute);
  _productService = inject(ProductsService);

  productIdSlug = this._productIdSlug.snapshot.paramMap.get('idSlug') ?? '';

  productResource = rxResource({
    request: () => (this.productIdSlug),
    loader: ({ request }) => {
      return this._productService.getProductByIdSlug(request);
    }
  })
}
