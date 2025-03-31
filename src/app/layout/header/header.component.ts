import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone:false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  authToken: string = '';
  private logoutSubscription: Subscription | null = null; // Initialize as null

  // API URLs
  private readonly API_BASE = 'http://localhost:8081/api';
  private readonly LOGOUT_URL = `${this.API_BASE}/logout`;

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authToken = localStorage.getItem('authToken') || '';

    if (!this.authToken) {
      this.handleSessionExpired();
    }
  }

  logout() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.warn('No session token found. Redirecting to login.');
      this.clearSession();
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });

    this.logoutSubscription = this.http
      .post<{ authToken: string; status: boolean; message: string }>(
        this.LOGOUT_URL,
        {},
        { headers }
      )
      .subscribe(
        (response) => {
          if (response.status) {
            console.log('Logged out successfully:', response);
            this.clearSession();
            this.router.navigate(['/login']);
          } else {
            console.error('Logout failed:', response);
            this.showToast('Logout failed. Please try again.');
          }
        },
        (error) => {
          console.error('Logout request failed:', error);
          this.showToast('Logout request failed. Please check your network and try again.');
          this.clearSession();
          this.router.navigate(['/login']);
        }
      );
  }

  private clearSession() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('indentDraft');
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
}
