import { inject, Injectable } from '@angular/core';
import { ProductsResponse } from '@products/interfaces/product.interface';
import { GeneralService } from '@shared/services/general.services';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private _generalService = inject(GeneralService);

  getProducts(): Observable<ProductsResponse> {
    return this._generalService.get<ProductsResponse>(`http://localhost:3000/api/products`).pipe(tap(console.log));
  }
}
