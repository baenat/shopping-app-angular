import { inject, Injectable } from '@angular/core';
import { Product, ProductsResponse } from '@products/interfaces/product.interface';
import { GeneralService } from '@shared/services/general.services';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private _generalService = inject(GeneralService);
  private productsCache = new Map<string, ProductsResponse>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;

    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this._generalService.get<ProductsResponse>(`${baseUrl}/products`, { params: { limit, offset, gender } }).pipe(
      tap(console.log),
      tap((products) => this.productsCache.set(key, products))
    );
  }

  getProductByIdSlug(slug: string): Observable<Product> {
    return this._generalService.get<Product>(`${baseUrl}/products/${slug}`);
  }
}
