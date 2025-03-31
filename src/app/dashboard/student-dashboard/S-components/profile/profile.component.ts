import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../auth.service';
import { isPlatformBrowser,CommonModule } from '@angular/common';

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
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}


  ngOnInit() {
    this.loadAuthToken();
    console.log("In ngOnInit");
    console.log(this.authToken);
    if (!this.authToken) {
      this.handleError('Auth token is missing! Please log in again.');
      return;
    }
    this.fetchProfile();
  }
  
  loadAuthToken() {
    if (isPlatformBrowser(this.platformId)) {
      this.authToken = localStorage.getItem('authToken') || '';
      console.log('Loaded authToken:', this.authToken);
    }
  }
  
  fetchProfile() {
    console.log(this.authToken);
    this.http.get(this.authService.STU_URL, {
      observe: 'response', // Get full response (headers + body)
      headers: { Authorization: `Bearer ${this.authToken}` } 
    }).subscribe(
      (response) => {
        const authHeader = response.headers.get('Authorization');
        console.log("In if before");
        console.log(authHeader);
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
          console.log(authHeader.startsWith('Bearer '));
          console.log("In resposne before assigning token");
          console.log(this.authToken);
          const newToken = authHeader.split(' ')[1]; // Extract token
          localStorage.setItem('authToken', newToken); // Store in localStorage
          this.authToken = localStorage.getItem('authToken') || '';
          console.log("In resposne after assigning token");
          console.log(this.authToken);
        }
        this.handleSuccess(response.body);
      },
      (error: HttpErrorResponse) => this.handleError(error.message || 'Failed to load profile.')
    );
  }

  handleSuccess(response: any) {
    if (response && response.profile) {
      this.profileData = response.profile;
      this.isLoading = false;
    }
  }
  
  updateAuthToken(response: any) {
    const authHeader = response.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const newToken = authHeader.split(' ')[1];
      if (newToken && isPlatformBrowser(this.platformId)) {
        this.authToken = newToken; // Update in-memory token
        localStorage.setItem('authToken', newToken); // Update localStorage
        console.log('Updated authToken:', newToken);
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