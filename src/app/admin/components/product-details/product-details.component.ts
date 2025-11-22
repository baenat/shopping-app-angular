import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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

  isSavedProduct = signal(false);
  tempImages = signal<string[]>([]);
  imageFileList: FileList | undefined = undefined;

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

  imagesToCarrusel = computed((() => {
    return [...this.product().images, ...this.tempImages()]
  }));

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

  async onSubmit() {
    const isFormValid = this.productForm.valid;

    if (!isFormValid) return;

    const formValue = this.productForm.value;
    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',').map(tag => tag.trim()) ?? [],
    }

    this.product().id === 'new'
      ? await this.createProduct(productLike as Product)
      : await this.updateProduct(productLike as Product);

    this.isSavedProduct.set(true);
    setTimeout(() => {
      this.isSavedProduct.set(false);
    }, 3000);
  }

  private async updateProduct(product: Product) {
    return await firstValueFrom(this.productServices.updateProduct(this.product().id, product));
  }

  private async createProduct(product: Partial<Product>) {
    return await firstValueFrom(this.productServices.createProduct(product))
      .then((product) => {
        this.router.navigate(['/admin/product', product.id]);
      });
  }

  onFilesChanged(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    this.tempImages.set([]);
    this.imageFileList = fileList ?? undefined;
    const imageUrls = Array.from(fileList ?? []).map(file => URL.createObjectURL(file));

    this.tempImages.set(imageUrls);
  }
}
