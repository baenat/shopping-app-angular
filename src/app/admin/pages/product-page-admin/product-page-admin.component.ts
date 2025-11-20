import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductDetailsComponent } from "@admin/components/product-details/product-details.component";

@Component({
  selector: 'app-product-page-admin',
  imports: [ProductDetailsComponent],
  templateUrl: './product-page-admin.component.html',
  styleUrl: './product-page-admin.component.css'
})
export class ProductPageAdminComponent {

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  productsService = inject(ProductsService);

  productId = toSignal(this.activatedRoute.params.pipe(map(params => params['id'])));

  productResource = rxResource({
    request: () => ({ id: this.productId() }),
    loader: ({ request }) => this.productsService.getProductById(request.id)
  });

  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigateByUrl('/admin/products');
    }
  });

}
