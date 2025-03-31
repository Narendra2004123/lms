import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-land',
  standalone:false,
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.css'] // ✅ Fixed the typo
})
export class LandComponent implements OnInit, AfterViewInit {

  constructor(private router: Router) {}

  images: string[] = [
    'assets/lms1.webp', 'assets/lms2.webp', 'assets/lms3.webp',
    'assets/lms4.webp', 'assets/lms5.webp', 'assets/lms6.webp',
    'assets/lms7.webp', 'assets/lms8.webp', 'assets/lms9.webp',
    'assets/lms10.webp'
  ];

  ngOnInit(): void {
    // console.log("LandComponent initialized");
  }

  ngAfterViewInit(): void {
    // console.log("LandComponent view initialized");
  }
  currentIndex: number = 0;

  /** Navigate to Previous Slide */
  prevSlide(): void {
    this.currentIndex = (this.currentIndex === 0) ? this.images.length - 1 : this.currentIndex - 1;
  }

  /** Navigate to Next Slide */
  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
