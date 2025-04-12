import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  authToken: string = '';
  requisitionList: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private snackBar:MatSnackBar,
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
  back()
  {
      this.router.navigate(['/dashboard/student/requist'])
  }
  fetchList(): void {
    const token = this.cookieService.get('authToken') || '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post<any>(this.authService.LIST_URL, {}, { headers, observe: 'response' })
      .subscribe({
        next: (response) => {
          this.updateAuthToken(response); // Rotate token if provided
          if (response.body?.status) {
            this.requisitionList = response.body.data;
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
  
  showToast(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-toast']
    });
  }
  
  // downloadRequisition(id: number): void {
  //   const token = this.cookieService.get('authToken');
  //   if (!token) {
  //     this.showToast('Authorization token missing. Please log in again.');
  //     this.router.navigate(['/home']);
  //     return;
  //   }
  
  //   this.http.post(
  //     this.authService.DOWNLOAD_REQUISITION_URL,
  //     { id },
  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //       responseType: 'arraybuffer' // ← important for byte[]
  //     }
  //   ).subscribe({
  //     next: (arrayBuffer: ArrayBuffer) => {
  //       // Create a Blob from the byte array
  //       const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
  
  //       // Create a temporary link element
  //       const link = document.createElement('a');
  //       const url = URL.createObjectURL(blob);
  
  //       link.href = url;
  //       link.download = `Requisition_${id}.pdf`; // ⬅️ sets filename
  //       link.click(); // ⬅️ triggers download
  
  //       // Cleanup
  //       URL.revokeObjectURL(url);
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       console.error('Download failed:', error);
  //       this.showToast('Failed to download the requisition form.');
  //     }
  //   });
  // }

  // downloadRequisition(id: number): void {
  //   const token = this.cookieService.get('authToken');
  //   if (!token) {
  //     this.showToast('Authorization token missing. Please log in again.');
  //     this.router.navigate(['/home']);
  //     return;
  //   }
  
  //   this.http.post(
  //     this.authService.DOWNLOAD_REQUISITION_URL,
  //     { id },
  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //       responseType: 'arraybuffer',
  //       observe: 'response'
  //     }
  //   ).subscribe({
  //     next: (response) => {
  //       this.updateAuthToken(response); // ✅ Already handles token update
  //       const arrayBuffer = response.body as ArrayBuffer;
  
  //       const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
  //       const url = URL.createObjectURL(blob);
  
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = `Requisition_${id}.pdf`;
  //       link.click();
  
  //       URL.revokeObjectURL(url);
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       console.error('Download failed:', error);
  //       this.showToast('Failed to download the requisition form.');
  //     }
  //   });
  // }


  // downloadRequisition(id: number): void {
  //   const token = this.cookieService.get('authToken');
  //   if (!token) {
  //     this.showToast('Authorization token missing. Please log in again.');
  //     this.router.navigate(['/home']);
  //     return;
  //   }
  
  //   this.http.post(
  //     this.authService.DOWNLOAD_REQUISITION_URL,
  //     { id },
  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //       responseType: 'text', // 📌 Base64 is sent as text
  //       observe: 'response'
  //     }
  //   ).subscribe({
  //     next: (response) => {
  //       this.updateAuthToken(response);
  
  //       const base64Data = response.body || '';
  //       const byteCharacters = atob(base64Data); // 🔁 Decode base64
  //       const byteNumbers = new Array(byteCharacters.length);
  
  //       for (let i = 0; i < byteCharacters.length; i++) {
  //         byteNumbers[i] = byteCharacters.charCodeAt(i);
  //       }
  
  //       const byteArray = new Uint8Array(byteNumbers);
  //       const blob = new Blob([byteArray], { type: 'application/pdf' });
  
  //       const url = URL.createObjectURL(blob);
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = `Requisition_${id}.pdf`;
  //       link.click();
  //       URL.revokeObjectURL(url);
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       console.error('Download failed:', error);
  //       this.showToast('Failed to download the requisition form.');
  //     }
  //   });
  // }


  downloadRequisition(id: number): void {
    const token = this.cookieService.get('authToken');
    if (!token) {
      this.showToast('Authorization token missing. Please log in again.');
      this.router.navigate(['/home']);
      return;
    }
  
    this.http.post<any>(
      this.authService.DOWNLOAD_REQUISITION_URL,
      { id },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe({
      next: (response) => {
        const base64Data = response.data;  // Base64 string
        const byteCharacters = atob(base64Data); // Decode base64
        const byteNumbers = new Array(byteCharacters.length);
  
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
  
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
  
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Requisition_${id}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Download failed:', error);
        this.showToast('Failed to download the requisition form.');
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
  }
}
