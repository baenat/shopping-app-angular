import { Component, inject, input } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

  product = input.required<Product>();

  formBuilder = inject(FormBuilder);

  productForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [['']],
    tags: [''],
    gender: ['', [Validators.pattern('^(men|women|kid|unisex)$')]],
  })

  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  onSubmit() {
    // if (this.productForm.invalid) {
    //   this.productForm.markAllAsTouched();
    //   return;
    // }
    console.log(this.productForm.value)
  }
}
