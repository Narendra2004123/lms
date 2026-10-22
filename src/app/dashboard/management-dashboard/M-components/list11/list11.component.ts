import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list11',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list11.component.html',
  styleUrls: ['./list11.component.css']
})
export class List11Component implements OnInit {
  authToken: string = '';
  requisitionList: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.loadAuthToken();

    if (!this.authToken) {
      this.handleError('Auth token missing. Please log in again.');
      this.clearSession();
      return;
    }

    this.fetchInventoryList();
  }

  loadAuthToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authToken = this.cookieService.get('authToken') || '';
      console.log('Loaded token:', this.authToken);
    }
  }

  back(): void {
    this.router.navigate(['/dashboard/student/inventory-request']);
  }

  fetchInventoryList(): void {
    const token = this.cookieService.get('authToken') || '';
    this.loading = true;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post<any>(this.authService.INDENT_LIST_URL, {}, { headers, observe: 'response' })
      .subscribe({
        next: (response) => {
          this.updateAuthToken(response);
          if (response.body?.status) {
            this.requisitionList = response.body.data;
            this.loading = false;
            this.isLoading = false;
          } else {
            this.handleError(response.body?.message || 'Unknown error occurred');
          }
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(err.message || 'Error fetching inventory list');
          this.loading = false;
        }
      });
  }

  downloadRequisition(id: number): void {
    const token = this.cookieService.get('authToken');
    if (!token) {
      this.showToast('Authorization token missing. Please log in again.');
      this.router.navigate(['/home']);
      return;
    }

    this.loading = true;

    this.http.post<any>(
      this.authService.INDENT_DOWNLOAD_URL,
      { id },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe({
      next: (response) => {
        this.loading = false;

        const base64Data = response.data;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Inventory_Requisition_${id}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Download failed:', error);
        this.showToast('Failed to download the inventory requisition form.');
        this.loading = false;
      }
    });
  }

  showToast(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-toast']
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
        console.log('🔁 Token refreshed:', newToken);
      }
    }
  }

  clearSession(): void {
    this.cookieService.delete('authToken');
    this.cookieService.delete('userData');
    this.router.navigate(['/home']);
  }

  handleError(message: string): void {
    console.error('❌ Error:', message);
    this.errorMessage = message;
    this.isLoading = false;
    this.loading = false;
  }
}
