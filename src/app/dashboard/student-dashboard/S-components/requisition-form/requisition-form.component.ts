import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth.service';

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
    requiredSoftware: '',
    licenseOs: '',
    fromDate: '',
    toDate: '',
    submittedAt: ''
  };
  softwareList: string[] = [];
  submitted = false;
  responseMessage: string = '';
  isError: boolean = false;
  authToken: string = '';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private snackBar: MatSnackBar,
    private router:Router,
    private authService:AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadAuthToken();
    this.fetchUserData();
  }

  loadAuthToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authToken = this.cookieService.get('authToken') || '';
      console.log('Loaded authToken:', this.authToken);
    }
  }
  
  fetchUserData(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`
    });

    this.http.get<any>(this.authService.DATA_URL, {
      headers,
      observe: 'response'
    })
    .subscribe({
      next: (response) => {
        console.log("Before update of cookie");
        console.log(this.cookieService.get('authToken'));
        
        this.updateAuthToken(response); // ✅ now response.headers will exist
        
        console.log("In fetch user data method");
        console.log("\n\n\n");
        console.log(this.cookieService.get('authToken'));
    
        const responseBody = response.body;
        if (responseBody && responseBody.data) {
          this.user.email = responseBody.data.email || ''; 
          this.softwareList = responseBody.data.requiredSoftware || [];
        } else {
          this.showToast('No data received from server');
        }
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.showToast('❌ Error fetching user data');
      }
    });
  }
  
  onsent() {
    this.router.navigate(['dashboard/student/list']);
  }
  

  onSubmit(): void {
    const apiUrl = this.authService.REQUIST_URL;

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
      requiredSoftware: '',
      licenseOs: '',
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
