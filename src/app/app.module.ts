import { NgModule} from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // For forms
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Components
import { AppComponent } from './app.component';
import { ForgotPasswordComponent } from './forgot-pwd/forgot-pwd.component';
import { HomeComponent } from './home/home.component';

// Routing Module
import { LayoutModule } from './layout/layout.module';
import { RouterModule,Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { OtpRegisterComponent } from './otp-register/otp-register.component';
import { FrontheadComponent } from './fronthead/fronthead.component';
import { LandComponent } from './land/land.component';
import { RegisterAdminComponent } from './register-admin/register-admin.component';
import { FooterComponent } from './footer/footer.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';




@NgModule({
  declarations: [
    AppComponent,
    ForgotPasswordComponent, // Forgot Password Component
    HomeComponent, RegisterComponent, OtpVerificationComponent, ResetPasswordComponent, OtpRegisterComponent,FrontheadComponent, LandComponent, RegisterAdminComponent,    // Home Component
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    AppRoutingModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
    LayoutModule,FooterComponent, MatProgressSpinnerModule // For routing
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideClientHydration(withEventReplay())
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
