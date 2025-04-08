import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

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
    submittedAt:''
  };

  submitted = false;
  responseMessage: string = '';
  isError: boolean = false;
  authToken: string = '';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
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
        this.updateAuthToken(response); // In case token is rotated
        console.log('✅ Form submitted:', response);
      },
      error: (error) => {
        this.submitted = true;
        this.responseMessage = 'Error: ' + (error.error || error.message);
        this.isError = true;
        console.error('❌ Error submitting form:', error);
      }
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
