import { Component, ChangeDetectorRef } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  otpSent: boolean = false;
  otpVerified: boolean = false;
  otpExpired: boolean = false;
  otpButtonDisabled: boolean = false; 
  timerMinutes: number = 2;
  timerSeconds: number = 0;
  interval: any;
  emailError: string = '';
  
  resendAttempts: number = 0;
  maxResendAttempts: number = 1000;

  // constructor(private cdr: ChangeDetectorRef) {}

  constructor(
  private cdr: ChangeDetectorRef, 
  private http: HttpClient, 
  private router: Router, 
  private snackBar:MatSnackBar,
  private authService:AuthService
  ) {}
  
  showToast(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-toast']
    });
  }

  // sendOtp() {
  //   if (!this.email.trim()) {
  //     this.emailError = 'Please enter your email';
  //     return;
  //   }
    
  //   // Validate email format to ensure it ends with "@iipe.ac.in"
  //   const emailPattern = /^[a-zA-Z0-9._%+-]+@iipe\.ac\.in$/;
  //   if (!emailPattern.test(this.email)) {
  //     this.emailError = 'Email must end with @iipe.ac.in';
  //     return;
  //   }
    
  //   this.emailError = '';  // Clear error if valid email
  //   this.otpSent = true;
  //   this.otpExpired = false;
  //   this.otpVerified = false;
  //   this.resendAttempts++;
  //   this.startTimer();
  // }
 
  
  
  sendOtp() {
    if (!this.email.trim()) {
      this.emailError = 'Please enter your email';
      return;
    }
  
    // Validate email format to ensure it ends with "@iipe.ac.in"
    // const emailPattern = /^[a-zA-Z0-9._%+-]+@iipe\.ac\.in$/;
    // if (!emailPattern.test(this.email)) {
    //   this.emailError = 'Email must end with @iipe.ac.in';
    //   return;
    // }
  
    this.emailError = ''; // Clear error if valid email
  
    // Prepare request payload
    const payload = { email: this.email };
    localStorage.setItem('username', this.email);
  
    // Disable the OTP button immediately
    this.otpSent = true;
    this.otpButtonDisabled = true; 
  
    // Send OTP request to backend
    this.http.post(this.authService.OTP_SEND_URL, payload).subscribe(
      (response) => {
        console.log('OTP sent successfully:', response);
        this.otpExpired = false;
        this.otpVerified = false;
        this.resendAttempts++;
        this.startTimer();
        this.showToast("OTP sent Successfully");
  
        // Enable button after 2 minutes
        setTimeout(() => {
          this.otpButtonDisabled = false;
          this.cdr.detectChanges(); // ✅ Force UI update
        }, 120000); // 2 minutes in milliseconds
      },
      (error) => {
        console.error('Error sending OTP:', error);
        this.otpSent = false;
        this.otpButtonDisabled = false;
        this.showToast('Failed to send OTP. Please try again.');
      }
    );
  }
  
  
  

  startTimer() {
    this.timerMinutes = 2;
    this.timerSeconds = 0;
    clearInterval(this.interval);

    this.interval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
      } else {
        if (this.timerMinutes > 0) {
          this.timerMinutes--;
          this.timerSeconds = 59;
        } else {
          clearInterval(this.interval);
          this.otpExpired = true;
          this.otpSent = false;
          this.showToast('OTP expired! Please request a new one.');
        }
      }
      this.cdr.detectChanges();  // ✅ Force UI update
    }, 1000);
  }

  verifyOtp() {
  if (!this.otp.trim()) {
    this.showToast('Please enter OTP');
    return;
  }
  if (this.otpExpired) {
    this.showToast('OTP expired! Please request a new one.');
    return;
  }

  const payload = { email: this.email, otp: this.otp };  // Prepare request data
  console.log("Sending OTP verification request:", payload);

  this.http.post(this.authService.OTP_SEND_URL, payload, { responseType: 'text' }).subscribe(
    (response) => {
      console.log('OTP verification successful:', response);
      this.otpVerified = true;
      this.showToast('OTP verified successfully!');
      this.router.navigate(['/reset-password']);  // Redirect after success
    },
    (error) => {
      console.error('OTP verification failed:', error);
      this.showToast('Invalid or expired OTP');
    }
  );
}
}
