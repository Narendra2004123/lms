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
  loading: boolean = false; // 🔁 Loader flag

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.email = this.cookieService.get('username') || '';
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

  checkOtp() {
    this.otp = this.otp.replace(/\D/g, '').slice(0, 6);
  }

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
          this.cookieService.set('user_type', response.role);
          this.cookieService.set('authToken', response.token);
          this.showToast(response.message, 'success');

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

  sendOtp() {
    this.loading = true; // 👈 Show loader

    this.http.post(this.authService.OTP_SEND_URL, { email: this.email })
      .subscribe(
        () => {
          this.showToast('New OTP sent!', 'success');
          this.startTimer();
          this.loading = false; // 👈 Hide loader
        },
        (error) => {
          console.error('Error sending OTP:', error);
          this.showToast('Failed to send OTP. Try again later.', 'error');
          this.loading = false; // 👈 Hide loader on error
        }
      );
  }

  redirectUser(role: string): void {
    const roleRoutes: Record<string, string> = {
      'SUG': '/dashboard/student',
      'ETF': '/dashboard/faculty',
      'r2': '/dashboard/management/profile'
    };

    const normalizedRole = role?.trim();
    const targetRoute = roleRoutes[normalizedRole];

    if (targetRoute) {
      setTimeout(() => {
        this.router.navigateByUrl(targetRoute)
          .then(() => console.log(`Redirected to ${targetRoute}`))
          .catch(error => {
            console.error('Navigation error:', error);
            this.showToast('Navigation failed. Try again.', 'error');
          });
      }, 100);
    } else {
      this.showToast('Invalid role detected! Contact admin.', 'error');
      this.router.navigate(['/home']);
    }
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }
}
