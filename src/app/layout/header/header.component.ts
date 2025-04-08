import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy,EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-header',
  standalone:false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  authToken: string = '';
  studentName:string='';
  departmentCode:string='';
  private logoutSubscription: Subscription | null = null; // Initialize as null

  // API URLs
  // private readonly API_BASE = 'http://localhost:8081/api';
  // private readonly LOGOUT_URL = `${this.API_BASE}/logout`;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService:CookieService,
    private snackBar: MatSnackBar,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.authToken = this.cookieService.get('authToken') || '';
  
    if (!this.authToken) {
      this.handleSessionExpired();
      this.router.navigate(['/home']);
      return; // Stop further execution if token is missing
    }
  
    // Read student name from cookies
    const nameFromCookie = this.cookieService.get('studentName');
    this.studentName = nameFromCookie ? nameFromCookie : 'Student';
  
    // Read department code from cookies
    const departmentFromCookie = this.cookieService.get('Department');
    this.departmentCode = departmentFromCookie ? departmentFromCookie : 'N/A'; // fallback
  }
  
  
  logout(event?: Event) {
    if (event) event.preventDefault();
  
    const authToken = this.cookieService.get('authToken');
  
    if (!authToken) {
      console.warn('No session token found. Redirecting to login.');
      this.router.navigate(['/login']);
      return;
    }
  
    console.log('Auth token from cookie:', authToken); // ✅ Log token
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
  
    this.logoutSubscription = this.http
      .post<{ status: boolean; message: string }>(
        this.authService.LOGOUT_URL,
        {},
        { headers }
      )
      .subscribe(
        (response) => {
          console.log('Logout API response:', response); // ✅ Log response
          if (response.status) {
            console.log('✅ Logged out successfully:', response.message); // should be "Session Deleted Successfully."
            this.clearSession();
            this.router.navigate(['/land']);
          } else {
            console.error('❌ Logout failed from server:', response.message);
            this.showToast('Logout failed. Please try again.');
          }
        },
        (error) => {
          console.error('❌ Logout request failed:', error);
          this.showToast('Logout request failed. Please check your network and try again.');
        }
      );
  }
  
  

  private clearSession() {
    this.cookieService.delete('authToken');
    this.cookieService.delete('userData');
    this.cookieService.delete('indentDraft');
  }
  

  private showToast(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private handleSessionExpired() {
    console.warn('Session expired. Redirecting to login.');
    this.clearSession();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }
  }
  @Output() sidebarToggle = new EventEmitter<void>();

  toggleSidebar() {
    this.sidebarToggle.emit(); // Notify the parent layout component
  }
  
  
}
