import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";


@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FooterComponent
],
  exports: [
    LayoutComponent,  // ✅ Export LayoutComponent so it can be used in AppComponent
    SidebarComponent, 
    HeaderComponent,
    FooterComponent
  ]
})
export class LayoutModule { }
