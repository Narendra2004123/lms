import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../auth.service';
import { isPlatformBrowser,CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

// Define the structure of the profile data
interface Profile {
  studentId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: number;
  email: string;
  contactDetails?: ContactDetails;
  permanentAddress?: Address;
  temporaryAddress?: Address;
  bloodGroup?: string;
  fatherDetails?: ParentDetails;
  motherDetails?: ParentDetails;
  guardianDetails?: GuardianDetails;
  nationality?: string;
  religion?: string;
  citizenshipStatus?: string;
  quota?: string;
  programCode?: string;
  departmentCode?: string;
  academicYear?: string;
  section?: string;
  dateOfAdmission?: string;
  cetRank?: number;
  admissionType?: string;
  academicStatus?: string;
  identityMark1?: string;
  identityMark2?: string;
  dob?: string;
}

interface Address {
  address1: string;
  address2?: string;
  address3?: string;
  district: string;
  current_state: string;
  country: string;
  pincode: string;
}

interface ContactDetails {
  work_email?: string;
  personal_email?: string;
  personal_mobile?: string;
  alternative_mobile?: string;
}

interface ParentDetails {
  name: string;
  mobile?: string;
  email?: string;
  occupation?: string;
  income?: string | null;
}

interface GuardianDetails {
  name?: string;
  mobile?: string;
  email?: string;
  relation?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true, // Keep it standalone
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule,] // Import FooterComponent here
})
export class ProfileComponent implements OnInit {
  authToken: string = '';
  profileData: Profile | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private cookieService:CookieService,
    private http: HttpClient,
    private router:Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}


  ngOnInit() {
    this.loadAuthToken();
    console.log("In ngOnInit");
    console.log(this.authToken);
    console.log(this.cookieService.get('authToken'));
    if (!this.authToken) {
      this.handleError('Auth token is missing! Please log in again.');
      this.router.navigate(['\home']);
      this.clearSession();
      return;
    }
    this.fetchProfile();
  }
  
  private clearSession() {
  
    this.cookieService.delete('authToken');
    this.cookieService.delete('userData');
    this.cookieService.delete('indentDraft');
    this.router.navigate(['\home']);
  }
  
  loadAuthToken() {
    if (isPlatformBrowser(this.platformId)) {
      this.authToken = this.cookieService.get('authToken') || '';
      console.log('Loaded authToken:', this.authToken);
    }
  }
  
  fetchProfile(): void {
    const currentToken = this.cookieService.get('authToken') || '';
    console.log("In fetch prfile method");
    console.log(currentToken);
    this.http.get(this.authService.STU_URL, {
      headers: { Authorization: `Bearer ${currentToken}` },
      observe: 'response'
    }).subscribe({
      next: (response) => {
        this.updateAuthToken(response); // Token might get rotated
        this.handleSuccess(response.body);
      },
      error: (error: HttpErrorResponse) => this.handleError(error.message || 'Failed to load profile.')
    });
  }
  

  handleSuccess(response: any) {
    if (response && response.profile) {
      this.profileData = response.profile;
      this.isLoading = false;
  
      if (this.profileData) {
        const { firstName, middleName, lastName, departmentCode } = this.profileData;
      
        // Build full name without undefined/null parts
        const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
      
        // Cookie expiry date (1 day from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);
      
        // Set cookies
        this.cookieService.set('studentName', fullName, expiryDate, '/');
        this.cookieService.set('Department', departmentCode || '', expiryDate, '/');
      }
      
    }
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
  
  

  handleError(message: string) {
    console.error('Error fetching profile:', message);
    this.errorMessage = message;
    this.isLoading = false;
  }
  editProfile() {
    console.log('Edit Profile Clicked');
    alert('Edit functionality will be added later!');
  }

}