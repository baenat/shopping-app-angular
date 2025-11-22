import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { GeneralService } from '@shared/services/general.services';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  images: [],
  tags: [],
  user: {} as User
}

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
  private productCache: Record<string, Product> = ({});

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
    if (this.productCache[slug]) {
      return of(this.productCache[slug]);
    }

    return this._generalService.get<Product>(`${baseUrl}/products/${slug}`)
      .pipe(
        delay(2000),
        tap((product) => this.productCache[slug] = product)
      );
  }

  getProductById(id: string): Observable<Product> {

    if (id === 'new') {
      return of(emptyProduct);
    }

    if (this.productCache[id]) {
      return of(this.productCache[id]);
    }

    return this._generalService.get<Product>(`${baseUrl}/products/${id}`)
      .pipe(
        delay(2000),
        tap((product) => this.productCache[id] = product)
      );
  }

  updateProduct(id: string, product: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    const currentImages = product.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map((imagesNames) => ({
        ...product,
        images: [...currentImages, ...imagesNames]
      })),
      switchMap((updatedProduct) => this._generalService.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)),
      tap((product) => this.updateProductCache(product)),
      tap((product) => this.updateProductsCache(product)),
    );

    // return this._generalService.patch<Product>(`${baseUrl}/products/${id}`, product)
    //   .pipe(
    //     delay(2000),
    //     tap((product) => this.updateProductCache(product)),
    //     tap((product) => this.updateProductsCache(product)),
    //   );
  }

  createProduct(product: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    const currentImages = product.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map((imagesNames) => ({
        ...product,
        images: [...currentImages, ...imagesNames]
      })),
      switchMap((createdProduct) => this._generalService.post<Product>(`${baseUrl}/products`, createdProduct)),
      tap((product) => this.updateProductCache(product)),
    );

    // return this._generalService.post<Product>(`${baseUrl}/products`, product)
    //   .pipe(
    //     tap((product) => this.updateProductCache(product))
    //   );
  }

  private updateProductCache(product: Product) {
    const productId = product.id;
    this.productCache[productId] = product;
  }

  private updateProductsCache(product: Product) {
    const productId = product.id;

    for (const productsResponse of this.productsCache.values()) {
      productsResponse.products = productsResponse.products.map((currentProduct) =>
        currentProduct.id === productId ? product : currentProduct
      );
    }
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map(imageFile => this.uploadImage(imageFile));

    return forkJoin(uploadObservables)
      .pipe(
        tap(console.log)
      );
  }

  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this._generalService.post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(map(response => response.fileName));
  }
}
