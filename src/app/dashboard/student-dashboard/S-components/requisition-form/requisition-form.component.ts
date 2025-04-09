import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-requisition-form',
  standalone: true,
  templateUrl: './requisition-form.component.html',
  styleUrls: ['./requisition-form.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule],
})
export class RequisitionFormComponent implements OnInit {
  user = {
    name: '',
    programme: '',
    rollNo: '',
    branch: '',
    specialization: '',
    email: '',
    mobile: '',
    accommodation: '',
    purpose: '',
    remoteAccess: '',
    required_software: '',
    licenseOS: '',
    fromDate: '',
    toDate: '',
    submittedAt: ''
  };

  submitted = false;
  responseMessage: string = '';
  isError: boolean = false;
  authToken: string = '';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadAuthToken();
  }

  loadAuthToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authToken = this.cookieService.get('authToken') || '';
      console.log('🔐 Loaded authToken:', this.authToken);
    }
  }

  onSubmit(): void {
    const apiUrl = 'http://localhost:8081/api/requisition-form/submit';

    this.user.submittedAt = new Date().toISOString();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`
    });

    this.http.post(apiUrl, this.user, {
      headers,
      responseType: 'text',
      observe: 'response'
    }).subscribe({
      next: (response: HttpResponse<any>) => {
        this.submitted = true;
        this.responseMessage = response.body || '';
        this.isError = false;
        this.updateAuthToken(response);
        console.log('✅ Form submitted:', response);
        this.showToast("Form Submitted");

        // ✅ Reset form after submission
        this.resetForm();
      },
      error: (error) => {
        this.submitted = true;
        this.responseMessage = 'Error: ' + (error.error || error.message);
        this.isError = true;
        this.showToast('❌ Error submitting form: ' + error.message);
      }
    });
  }

  resetForm(): void {
    this.user = {
      name: '',
      programme: '',
      rollNo: '',
      branch: '',
      specialization: '',
      email: '',
      mobile: '',
      accommodation: '',
      purpose: '',
      remoteAccess: '',
      required_software: '',
      licenseOS: '',
      fromDate: '',
      toDate: '',
      submittedAt: ''
    };
  }

  showToast(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-toast']
    });
  }

  updateAuthToken(response: HttpResponse<any>): void {
    const authHeader = response.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const newToken = authHeader.split(' ')[1];
      if (newToken && isPlatformBrowser(this.platformId)) {
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 30);

        this.cookieService.set('authToken', newToken, expiryDate, '/', '', false, 'Strict');
        this.authToken = newToken;
        console.log('🔄 Token updated with expiry:', newToken);
      }
    }
  }
}
