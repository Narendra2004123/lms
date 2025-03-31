import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

interface Department {
  departmentId: string;
  department: string;
}

interface Role {
  roleId: string;
  roleName: string;
}

interface Program {
  programId: string;
  program: string;
}

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userType: string = '';
  selectedProgramId: string = '';
  identifier: string = '';
  identifierLabel: string = 'Roll No';
  email: string = '';
  gender: string = '';
  dob: string = '';
  dateOfJoining: string = '';
  departmentId: string = '';
  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  password: string = '';
  programId: string = '';
  confirmPassword: string = '';
  captchaImage: string = ''; 
  captchaTokenFront: string = ''; 
  captchaInput: string = '';  
  captchaError: string = ''; 
  academicYear: string = '';
 

  departments: Department[] = [];
  programs: Program[] = [];
  roles: Role[] = [];

  constructor(private router: Router, private http: HttpClient, private authService:AuthService,private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadCaptcha();
    this.fetchRoles();
    this.fetchPrograms();
    this.fetchDepartments();
    this.setCurrentAcademicYear();
  }

  fetchRoles() {
    this.http.get<{ status: boolean, data: Role[] }>(this.authService.ROLES_URL)
      .subscribe(
        (response) => {
          if (response.status && response.data) {
            this.roles = response.data;
            console.log(this.roles);
          } else {
            console.error('Invalid response format:', response);
          }
        },
        (error) => console.error('Error fetching roles:', error)
      );
  }
  
  fetchDepartments() {
    this.http.get<{ status: boolean, data: Department[] }>(this.authService.DEPARTMENT_URL)
      .subscribe(
        (response) => {
          if (response.status && response.data) {
            this.departments = response.data;
            console.log(this.departments);
          } else {
            console.error('Invalid department response format:', response);
          }
        },
        (error) => console.error('Error fetching departments:', error)
      );
  }
  updateDepartments() {
    console.log("In update Department");
    if (this.programs) {
      this.fetchDepartments();
      console.log("after");// Refresh departments based on the selected programme
    }console.log("return");
  }
  setCurrentAcademicYear() {
    const currentYear = new Date().getFullYear();
    this.academicYear = `${currentYear}-${currentYear + 1}`;
  }

  incrementAcademicYear() {
    let [start, end] = this.academicYear.split("-").map(Number);
    const currentYear = new Date().getFullYear();
    
    if (end < currentYear + 1) { // Limit up to the current year
      this.academicYear = `${start + 1}-${end + 1}`;
    }
  }

  decrementAcademicYear() {
    let [start, end] = this.academicYear.split("-").map(Number);
    
    if (start > 2000) { // Limit lower bound to a reasonable year
      this.academicYear = `${start - 1}-${end - 1}`;
    }
  }
  
  
  fetchPrograms() {
    this.http.get<{ status: boolean, data: Program[] }>(this.authService.PROGRAM_URL)
      .subscribe(
        (response) => {
          if (response.status && response.data) {
            this.programs = response.data;
          } else {
            console.error('Invalid program response format:', response);
          }
        },
        (error) => console.error('Error fetching programs:', error)
      );
  }
  
  updateUserType() {
    this.identifierLabel = this.userType === 'r3' ? 'Roll No' :
                           this.userType === 'r2' ? 'Employee ID' : 'Management ID';
  }
  
  
  showToast(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-toast']
    });
  }

  loadCaptcha() {
    this.http.get<{ captchaToken: string; image: string }>(this.authService.CAPTCHA_GENERATE_URL)
      .subscribe(
        (response) => {
          this.captchaImage = response.image;
          this.captchaTokenFront = response.captchaToken;
        },
        (error) => console.error('Error fetching CAPTCHA:', error)
      );
  }

  validateInputs(): boolean {
    const requiredFields = [
      this.userType, this.email, this.identifier, this.gender, this.dob, this.dateOfJoining,
      this.academicYear, this.departmentId, this.firstName, this.lastName, this.programId,
      this.phoneNumber, this.password, this.confirmPassword, this.captchaInput
    ];

    if (requiredFields.some(field => !field?.trim())) {
      this.showToast('Please fill all fields.', 3000);
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.showToast('Invalid email format.', 3000);
      return false;
    }

    if (!/^\d{10}$/.test(this.phoneNumber)) {
      this.showToast('Invalid phone number. It should be 10 digits.', 3000);
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.showToast('Passwords do not match!', 3000);
      return false;
    }

    return true;
  }

  register() {
    if (!this.validateInputs()) return;
    
    console.log("In registration method");

    const userData = {
      role: this.userType,
      identifier: this.identifier.trim(),
      email: this.email.trim(),
      firstName: this.firstName.trim(),
      middleName: this.middleName.trim() || '',
      lastName: this.lastName.trim(),
      gender: this.gender,
      dob: this.dob,
      dateOfJoining: this.dateOfJoining,
      academicYear: this.academicYear,
      departmentId: this.departmentId,
      phoneNumber: this.phoneNumber.trim(),
      password: this.password,
      programId: this.programId,
      captchaToken: this.captchaTokenFront,
      captchaValue: this.captchaInput.trim()
    };

    this.http.post<{ status: string; message: string }>(this.authService.REGISTER_URL, userData)
      .subscribe(
        response => {
          if (response.status === "true") {
            localStorage.setItem('registeredEmail', this.email);
            this.showToast('Registration successful! Sending OTP...', 3000);
            this.sendOtp();
          } else {
            this.captchaError = response.message || 'Invalid CAPTCHA or registration details!';
            this.loadCaptcha();
            this.showToast(this.captchaError, 3000);
          }
        },
        error => {
          console.error('Registration error:', error);
          this.showToast('Error registering. Please try again.', 3000);
          this.loadCaptcha();
        }
      );
  }

  sendOtp() {
    if (!this.email.trim()) {
      this.showToast('Invalid email for OTP.', 3000);
      return;
    }

    const payload = { email: this.email.trim() };

    this.http.post<{ status: boolean, message?: string }>(this.authService.OTP_SEND_URL, payload)
      .subscribe(
        response => {
          if (response.status) {
            this.showToast('OTP sent to your registered email.', 3000);
            this.router.navigate(['/otp-register']);
          } else {
            this.showToast(response.message || 'Failed to send OTP. Please try again.', 3000);
          }
        },
        error => {
          console.error('OTP sending error:', error);
          this.showToast('Error sending OTP. Please try again.', 3000);
        }
      );
  }
}