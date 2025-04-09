import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface MenuItem {
  menuId: string;
  menuIcon: string | null;
  menuItem: string;
  resourcesEndpoint: string;
  isActive: string | boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SidebarComponent implements OnInit {

  
  userData: any = null;          // For header display
  sidebarMenu: MenuItem[] = [];  // For sidebar
  isStudent: boolean = false;    // Role flag
  loading: boolean = true;
  errorMessage: string = '';
  

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router:Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentToken = this.cookieService.get('authToken');
    console.log("in login_next oninit");
    console.log(currentToken);
    if (!currentToken) {
      this.errorMessage = 'Auth token is missing! Please log in again.';
      this.loading = false;
      this.router.navigate(['/home']);
      return;
    }

    this.fetchSidebarMenu();
  }

  fetchSidebarMenu(): void {
    const token = this.cookieService.get('authToken');
    console.log('📦 Sending token in request:', token);
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    this.http.get<any>('http://localhost:8081/api/login/_next', {
      headers,
      observe: 'response'
    }).subscribe({
      next: (response) => {
        console.log('✅ Response received from sidebar API');
        this.updateAuthToken(response);
  
        const data = response.body?.data || {};
        const userInfo = data?.UserData?.[0] || {};
        this.userData = userInfo;
  
        // Store complete userData in cookie (as string)
        this.cookieService.set('userData', JSON.stringify(userInfo));
  
        this.isStudent = 'program code' in userInfo;
  
        const sidebarList = data?.sidebarMenu || [];
        this.sidebarMenu = sidebarList.filter(
          (item: MenuItem) => item.isActive === 'true' || item.isActive === true
        );
  
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Sidebar fetch failed:', error);
        this.errorMessage = error.status === 403
          ? 'Access denied. Your session might have expired.'
          : 'Failed to fetch sidebar.';
        this.loading = false;
      }
    });
  }
  
  
  updateAuthToken(response: any): void {
    const authHeader = response.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const newToken = authHeader.split(' ')[1];
      if (newToken && isPlatformBrowser(this.platformId)) {
        // Set expiry for 30 minutes from now
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 30); 
  
        this.cookieService.set('authToken', newToken, expiryDate, '/', '', false, "Strict"); 
        console.log('🔄 Token updated with expiry:', newToken);
      }
    }
  }
  
}
