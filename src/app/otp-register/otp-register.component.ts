import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-otp-verification',
  standalone: false,
  templateUrl: './otp-register.component.html',
  styleUrls: ['./otp-register.component.css']
})
export class OtpRegisterComponent implements OnInit {
  email: string = '';
  otp: string = '';
  errorMessage: string = '';
  isVerifying: boolean = false;
  resendCountdown: number = 0;
  countdownInterval: any;
  otpExpired: boolean = false;
  timerMinutes: number = 2;
  timerSeconds: number = 0;
  countdown: any;

  constructor(private router: Router, private http: HttpClient, private authService:AuthService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.email = localStorage.getItem('registeredEmail') || ''; 
    if (!this.email) {
      this.router.navigate(['/register']); 
    } else {
      this.startTimer(); // Start OTP expiration timer on page load
    }
  }

  showToast(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-toast']
    });
  }

  verifyOtp() {
    if (!this.otp || this.otp.length !== 6) {
      this.showToast('Please enter a valid 6-digit OTP.', 3000);
      return;
    }
    if (this.otpExpired) {
      this.showToast('OTP has expired. Please request a new one.', 3000);
      return;
    }

    this.isVerifying = true;
    const payload = { email: this.email, otp: this.otp };

    this.http.post<{ status: boolean, message?: string }>(this.authService.OTP_VERIFY_URL, payload)
      .subscribe(response => {
        this.isVerifying = false;
        if (response.status) {
          this.showToast('OTP verified successfully!', 3000);
          sessionStorage.removeItem('registeredEmail');
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = response.message || 'Invalid OTP! Please try again.';
          this.showToast(this.errorMessage, 3000);
        }
      }, error => {
        this.isVerifying = false;
        console.error('OTP Verification Error:', error);
        this.showToast('Error verifying OTP. Please try again.', 3000);
      });
  }

  resendOtp() {
    if (this.resendCountdown > 0) return;

    const payload = { email: this.email };
    this.http.post<{ status: boolean, message?: string }>(this.authService.OTP_SEND_URL, payload)
      .subscribe(response => {
        if (response.status) {
          this.showToast('New OTP sent to your email.', 3000);
          this.startResendCountdown();
          this.startTimer(); // Restart timer after resending OTP
        } else {
          this.showToast(response.message || 'Failed to resend OTP.', 3000);
        }
      }, error => {
        console.error('OTP Resend Error:', error);
        this.showToast('Error resending OTP. Please try again.', 3000);
      });
  }

  startResendCountdown() {
    this.resendCountdown = 30;
    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  startTimer() {
    this.otpExpired = false;
    this.timerMinutes = 2;
    this.timerSeconds = 0;

    this.countdown = setInterval(() => {
      if (this.timerMinutes === 0 && this.timerSeconds === 0) {
        clearInterval(this.countdown);
        this.otpExpired = true;
      } else {
        if (this.timerSeconds === 0) {
          this.timerMinutes--;
          this.timerSeconds = 59;
        } else {
          this.timerSeconds--;
        }
      }
    }, 1000);
  }
}
