import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isSidebarVisible = true; // Sidebar visible by default

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
