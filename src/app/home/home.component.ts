import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: string = '';
  password: string = '';
  captchaImage: string = '';
  captchaTokenFront: string = '';
  captchaInput: string = '';
  captchaError: string = '';
  loading: boolean = false; // Loader state

  constructor(private cookieService:CookieService,private router: Router, private http: HttpClient, private authService: AuthService, private snackBar: MatSnackBar) {}

  showToast(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-toast']
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  ngOnInit() {
    this.loadCaptcha();
  }

  loadCaptcha() {
    this.http.get<{ captchaToken: string; image: string }>(this.authService.CAPTCHA_GENERATE_URL)
      .subscribe(
        (response) => {
          this.captchaImage = response.image;
          this.captchaTokenFront = response.captchaToken;
        },
        (error) => {
          console.error('Error fetching CAPTCHA:', error);
        }
      );
  }

  reloadCaptcha() {
    this.http.post<{ image: string; captchaToken: string }>(
      this.authService.CAPTCHA_RELOAD_URL,
      { captchaToken: this.captchaTokenFront }
    ).subscribe(
      (response) => {
        this.captchaImage = response.image;
        this.captchaTokenFront = response.captchaToken;
        this.captchaInput = ''; // Clear input field
        this.captchaError = ''; // Clear error message
      },
      (error) => {
        console.error('Error refreshing CAPTCHA:', error);
      }
    );
  }

  login() {
    if (!this.username || !this.password || !this.captchaInput) {
      this.showToast('Please fill all fields.');
      return;
    }
  
    this.loading = true; // Show loader and blur background
  
    this.http.post<{ status: boolean; message: string }>(
      this.authService.LOGIN_URL,
      {
        username: this.username,
        password: this.password,
        captchaToken: this.captchaTokenFront,
        captchaValue: this.captchaInput
      }
    ).subscribe(
      (response) => {
        if (response.status) {
          this.cookieService.set('username', this.username);
          this.sendOtp();
        } else {
          this.loading = false; // Hide loader
          this.captchaError = response.message;
          this.loadCaptcha();
        }
      },
      (error) => {
        this.loading = false; // Hide loader on error
        console.error('Login error:', error);
        this.showToast(error.error.message);
        this.loadCaptcha();
      }
    );
  }
  
  sendOtp() {
    this.http.post(this.authService.OTP_SEND_URL, { email: this.username })
      .subscribe(
        () => {
          this.showToast('OTP sent successfully to your email.');
          setTimeout(() => {
            this.router.navigate(['/otp-verification']); // Redirect after loader
          }, 1000);
        },
        (error) => {
          this.loading = false; // Hide loader on error
          console.error('Error sending OTP:', error);
        }
      );
  }
}