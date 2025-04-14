import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-indentreq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './indentreq.component.html',
  styleUrls: ['./indentreq.component.css']
})
export class IndentreqComponent implements OnInit {
  authToken: string = '';
  indentList: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  isSubmitting: boolean = false;

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

    this.fetchList();
  }

  loadAuthToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authToken = this.cookieService.get('authToken') || '';
      console.log('Loaded token:', this.authToken);
    }
  }

  back(): void {
    this.router.navigate(['/dashboard/student/requist']);
  }

  submitStatus(id: number, status: string): void {
    const token = this.cookieService.get('authToken') || '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      id: id.toString(),
      status: status
    };

    this.http.put<any>(this.authService.STATUS_INDENT_URL, body, { headers, observe: 'response' })
      .subscribe({
        next: (response) => {
          this.updateAuthToken(response);

          if (response.body?.status) {
            this.showToast('Status updated successfully.');

            const item = this.indentList.find(item => item.id === id);
            if (item) {
              item.isSubmitted = true;
              // item.status = response.body.status; // Optional if backend modifies status
            }
          } else {
            this.showToast(response.body?.message || 'Failed to update status.');
          }
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(err.message || 'Error updating status');
        }
      });
  }

  fetchList(): void {
    const token = this.cookieService.get('authToken') || '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post<any>(this.authService.INDENT_FETCH_URL, {}, { headers, observe: 'response' })
      .subscribe({
        next: (response) => {
          this.updateAuthToken(response);
          if (response.body?.status) {
            this.indentList = response.body.data;
            this.isLoading = false;
          } else {
            this.handleError(response.body?.message || 'Unknown error');
          }
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(err.message || 'Error fetching data');
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

    this.http.post<any>(
      this.authService.INDENT_DOWNLOAD_URL,
      { id },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe({
      next: (response) => {
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
        link.download = `Indent_${id}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Download failed:', error);
        this.showToast('Failed to download the indent file.');
      }
    });
  }

  showToast(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-toast']
    });
  }

  updateAuthToken(response: any): void {
    const authHeader = response.headers.get('Authorization');
    console.log('🪪 Received header:', authHeader);

    if (authHeader?.startsWith('Bearer ')) {
      const newToken = authHeader.split(' ')[1];
      if (newToken && isPlatformBrowser(this.platformId)) {
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 30);
        this.cookieService.set('authToken', newToken, expiryDate);
        console.log('🔁 Token refreshed and saved:', newToken);
      }
    } else {
      console.warn('⚠️ No Bearer token in response headers');
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
  }
}
