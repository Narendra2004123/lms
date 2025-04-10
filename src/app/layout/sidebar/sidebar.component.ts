import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterModule } from '@angular/router';

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
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent implements OnInit {
  authToken: string = '';
  userData: any = null;
  sidebarMenu: MenuItem[] = [];
  isStudent: boolean = false;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadAuthToken();

    console.log('[Sidebar] Init with token:', this.authToken);
    if (!this.authToken) {
      this.handleError('Auth token is missing! Please log in again.');
      this.router.navigate(['/home']);
      return;
    }

    this.fetchSidebarMenu();
  }

  loadAuthToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authToken = this.cookieService.get('authToken') || '';
      console.log('[Sidebar] Loaded token:', this.authToken);
    }
  }

  fetchSidebarMenu(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`
    });
  
    this.http.get<any>('http://localhost:8081/api/login/_next', {
      headers,
      observe: 'response'
    }).subscribe({
      next: (response) => {
        console.log('[Sidebar] API Response Success');
        this.updateAuthToken(response);
  
        const data = response.body?.data || {};
        const userInfo = data?.UserData?.[0] || {};
  
        // ✅ Save userInfo for local usage
        this.userData = userInfo;
        this.isStudent = !!userInfo['program code'];
  
        // ✅ Store userData in cookie (safely, only on browser)
        if (isPlatformBrowser(this.platformId)) {
          try {
            const encodedUserData = JSON.stringify(userInfo);
            this.cookieService.set('userData', encodedUserData);
            console.log('[Sidebar] userData cookie set:', userInfo);
          } catch (err) {
            console.error('❌ Failed to store userData in cookies:', err);
          }
        }
  
        // ✅ Sidebar Menu setup
        const sidebarList = data?.sidebarMenu || [];
        this.sidebarMenu = sidebarList.filter(
          (item: MenuItem) => item.isActive === 'true' || item.isActive === true
        );
  
        // ✅ Optional: manually trigger an event in case header listens for it
        const event = new CustomEvent('userDataUpdated');
        window.dispatchEvent(event);
  
        this.loading = false;
      },
  
      error: (error: HttpErrorResponse) => {
        console.error('[Sidebar] API Error:', error);
        this.errorMessage = error.status === 403
          ? 'Access denied. Please log in again.'
          : 'Failed to fetch sidebar menu.';
        this.clearSession();
      }
    });
  }
  
  updateAuthToken(response: any): void {
    const authHeader = response.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const newToken = authHeader.split(' ')[1];
      if (newToken && isPlatformBrowser(this.platformId)) {
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 30);
        this.cookieService.set('authToken', newToken, expiryDate, '/', '', false, 'Strict');
        console.log('[Sidebar] Token Updated:', newToken);
      }
    }
  }

  clearSession(): void {
    this.cookieService.delete('authToken');
    this.cookieService.delete('userData');
    this.router.navigate(['/home']);
    this.loading = false;
  }

  handleError(message: string): void {
    this.errorMessage = message;
    this.loading = false;
    console.error('[Sidebar] Error:', message);
  }
}
