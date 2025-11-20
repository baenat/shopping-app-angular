import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  product = input.required<Product>();

  formBuilder = inject(FormBuilder);
  router = inject(Router);

  productServices = inject(ProductsService);

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

  ngOnInit(): void {
    this.setFormValues(this.product());
  }

  setFormValues(formParam: Partial<Product>) {
    this.productForm.reset(formParam as any);
    this.productForm.patchValue({ tags: formParam.tags?.join(', ') });
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.get('sizes')?.value ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  onSubmit() {
    const isFormValid = this.productForm.valid;

    if (!isFormValid) return;

    const formValue = this.productForm.value;
    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',').map(tag => tag.trim()) ?? [],
    }

    this.product().id === 'new'
      ? this.createProduct(productLike as Product)
      : this.updateProduct(productLike as Product);
  }

  private updateProduct(product: Product) {
    this.productServices.updateProduct(this.product().id, product)
      .subscribe((product) => {
        console.log('Product updated')
      });
  }

  private createProduct(product: Partial<Product>) {
    this.productServices.createProduct(product)
      .subscribe((product) => {
        console.log('Product updated');
        this.router.navigate(['/admin/product', product.id]);
      });
  }
}
