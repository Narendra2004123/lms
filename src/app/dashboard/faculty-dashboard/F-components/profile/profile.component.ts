import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../../auth.service';
import { Router } from '@angular/router';

interface Address {
  address1?: string;
  address2?: string;
  address3?: string;
  district?: string;
  current_state?: string;
  country?: string;
  pincode?: string;
}

interface FacultyProfile {
  facultyCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  departmentCode: string;
  programCode: string;
  designation: string;
  qualification: string;
  specialization: string;
  researchArea: string;
  experienceYears: number;
  employmentType: string;
  permanentAddress?: Address;
  currentAddress?: Address;
}

@Component({
  selector: 'app-faculty-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule],
})
export class ProfileComponent implements OnInit {
  authToken: string = '';
  profileData: FacultyProfile | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private authService: AuthService,
    private router:Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.loadAuthToken();
    if (!this.authToken) {
      this.handleError('Auth token is missing! Please log in again.');
      this.router.navigate(['/home']);
      return;
    }
    this.fetchFacultyProfile();
  }

  loadAuthToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authToken = this.cookieService.get('authToken') || '';
      console.log('Loaded authToken:', this.authToken);
    }
  }

  fetchFacultyProfile(): void {
    const currentToken = this.cookieService.get('authToken') || '';
    this.http.get<{ profile: FacultyProfile }>(`${this.authService.FAC_URL}`, {
      headers: { Authorization: `Bearer ${currentToken}` },
      observe: 'response',
    }).subscribe({
      next: (response) => {
        this.updateAuthToken(response);
        this.handleSuccess(response.body);
      },
      error: (error: HttpErrorResponse) => {
        this.handleError(error.message || 'Failed to load faculty profile.');
      }
    });
  }

  updateAuthToken(response: any): void {
    const authHeader = response.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const newToken = authHeader.split(' ')[1];
      if (newToken && isPlatformBrowser(this.platformId)) {
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 30);
        this.cookieService.set('authToken', newToken, expiry, '/', '', false, 'Strict');
        console.log('🔄 Token updated with expiry:', newToken);
      }
    }
  }

  handleSuccess(response: any): void {
    if (response && response.profile) {
      this.profileData = response.profile;
      this.isLoading = false;
    }
  }

  handleError(message: string): void {
    console.error('Error fetching faculty profile:', message);
    this.errorMessage = message;
    this.isLoading = false;
  }

  editProfile(): void {
    alert('Edit profile functionality will be implemented soon!');
  }
}
