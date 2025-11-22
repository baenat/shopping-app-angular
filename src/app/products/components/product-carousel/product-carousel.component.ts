import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { Navigation, Pagination } from 'swiper/modules';

import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.css',
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges {

  images = input.required<string[]>();
  swiperContainer = viewChild.required<ElementRef>('swiperContainer');

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['images'].firstChange) {
      this.swiperInit();
    }
  }

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  swiperInit() {
    const element = this.swiperContainer().nativeElement;
    if (!element) return;

    const swiper = new Swiper(element, {

      modules: [Navigation, Pagination],

      // Optional parameters
      direction: 'horizontal',
      loop: true,

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
