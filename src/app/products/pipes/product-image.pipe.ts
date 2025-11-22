import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage'
})
export class ProductImagePipe implements PipeTransform {

  transform(value: string | string[]): string {
    const noImage = `./assets/images/no-image.jpg`;

    if (typeof value === 'string' && value.startsWith('blob:')) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.length ? `${baseUrl}/files/product/${value[0]}` : noImage;
    }

    if (value && typeof value === 'string') {
      return `${baseUrl}/files/product/${value}`;
    }

    return noImage;
  }

}
