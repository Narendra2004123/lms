import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-otp-verification',
  standalone: false,
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  otp: string = '';
  email: string = '';
  user_type: string = '';
  authToken: string = '';

  otpExpired: boolean = false;
  timerMinutes: number = 2;
  timerSeconds: number = 0;
  countdown: any;

  constructor(
  private router: Router, 
  private http: HttpClient, 
  private authService: AuthService, 
  private snackBar: MatSnackBar,
  private cookieService:CookieService
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.email=this.cookieService.get('username') || '';
    }

    if (!this.email) {
      this.showToast('Session expired! Redirecting to login.', 'error');
      this.router.navigate(['/']);
      return;
    }

    this.startTimer();
  }

  ngOnDestroy() {
    if (this.countdown) {
      clearInterval(this.countdown);
    }
  }

  /** Start 2-minute countdown timer */
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

  /** Ensure OTP input is exactly 6 digits */
  checkOtp() {
    this.otp = this.otp.replace(/\D/g, '').slice(0, 6);
  }

  /** Verify the entered OTP */
  /** Verify the entered OTP */
verifyOtp() {
  if (this.otp.length !== 6) {
    this.showToast('Enter a 6-digit OTP', 'error');
    return;
  }

  if (this.otpExpired) {
    this.showToast('OTP expired! Request a new OTP.', 'error');
    return;
  }

  this.http.post<{ role: string; token: string; status: boolean; message: string }>(
    this.authService.OTP_LOGIN_VERIFY, 
    { email: this.email, otp: this.otp }
  ).subscribe(
    (response) => {
      if (response.status) {
        console.log('OTP verified successfully. Received role:', response.role);

      
        this.cookieService.set('user_type', response.role);
        this.cookieService.set('authToken', response.token); // Token is stored here

        this.showToast(response.message, 'success');

        // Redirect user with a slight delay
        setTimeout(() => {
          this.redirectUser(response.role);
        }, 500);
      } else {
        this.showToast(response.message, 'error');
      }
    },
    (error) => {
      console.error('OTP verification failed:', error);
      this.showToast('Error verifying OTP. Please try again.', 'error');
    }
  );
}


  /** Resend OTP and restart the timer */
  sendOtp() {
    this.http.post(this.authService.OTP_SEND_URL, { email: this.email })
      .subscribe(
        () => {
          this.showToast('New OTP sent!', 'success');
          this.startTimer();
        },
        (error) => {
          console.error('Error sending OTP:', error);
          this.showToast('Failed to send OTP. Try again later.', 'error');
        }
      );
  }

  /** Redirect user based on role */
  redirectUser(role: string) {
    const routes: Record<string, string> = {
      'sug': '/dashboard/student/profile',
      'r3': '/dashboard/faculty/profile',
      'r2': '/dashboard/management/profile'
    };

    const normalizedRole = role.trim().toLowerCase();
    console.log('Redirecting user with role:', normalizedRole);

    if (routes[normalizedRole]) {
      setTimeout(() => {
        this.router.navigateByUrl(routes[normalizedRole]).then(() => {
          console.log('Redirection successful');
        }).catch(err => {
          console.error('Redirection failed:', err);
        });
      }, 100);
    } else {
      this.showToast('Invalid role! Contact admin.', 'error');
      this.router.navigate(['/home']);
    }
  }

  /** Show toast message */
  private showToast(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }
}
