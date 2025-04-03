import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service'; 
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  check:boolean=false;
  email: string = ''; // Assume email is stored in localStorage after OTP verification

  constructor( private cookieService: CookieService, private router: Router, private cdr: ChangeDetectorRef, private authService: AuthService,private http: HttpClient, private snackBar:MatSnackBar) {}
  
  showToast(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-toast']
    });
  }

  ngOnInit() {
    this.email = this.cookieService.get('username') || '';
    if (!this.email) {
      this.showToast('Session expired! Redirecting to login.');
      this.router.navigate(['/']);
      return;
    }
  }

  resetPassword() {
    if (!this.newPassword.trim() || !this.confirmPassword.trim()) {
      this.showToast('Please enter a new password.');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.showToast('Passwords do not match.');
      return;
    }

    // API request body
    const requestBody = { username: this.email, password: this.newPassword };

    this.http.post<{ status: boolean; message?: string; error?: string }>(
      this.authService.RESET_PASSWORD_URL,  
      requestBody
    ).subscribe(
      (response) => {
        if (response.status) {
          alert(response.message);
          this.check = true;
          this.cdr.detectChanges(); // Force UI update
          setTimeout(() => {
            this.check = false;
            this.router.navigate(['/home']); // Navigate to the home page
          }, 2000);
        } else {
          this.showToast(response.error || 'Password reset failed.');
        }
      },
      (error) => {
        console.error('Password reset error:', error);
        this.showToast('Error resetting password. Please try again.');
      }
    );
  }
}
