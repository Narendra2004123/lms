import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-indentform',
  standalone: true,
  templateUrl: './indentform.component.html',
  styleUrls: ['./indentform.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class IndentFormComponent implements OnInit {
  indent: any = {
    department: '',
    asset_type: '',
    budget_head: '',
    date: '',
    indenterName: '',
    indenterDesignation: '',
    hodName: '',
    hodDesignation: '',
    purposeOfPurchase: '',
    itemName: '',
    quantity: '',
    cost: '',
    installationBy: '',
    deliveryPeriod: '',
    installationReady: '',
    purchaseMode: '',
    vendors: [{ vendorName: '', vendorMobile: '', vendorAddress: '', vendorEmail: '' }],
    inspectionDate: '',
    trainingRequired: '',
    operationalDate: '',
    emergencyPurchase: '',
    warrantyDetails: '',
    amcRequired: '',
    repeatOrder: '',
    certification1: false,
    certification2: false,
    certification3: false,
    expectedTime: '',
    trainingReason: '',
    undertaking: '',
    certified: false,
    remarks: '',
    submittedAt: ''
  };

  submitted = false;
  responseMessage = '';
  isError = false;
  authToken = '';

  showExpectedTime = false;
  showVendorDetails = false;
  showTrainingReason = false;
  showUndertakingUpload = false;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadAuthToken();
  }

  loadAuthToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authToken = this.cookieService.get('authToken') || '';
      console.log('🔐 Loaded authToken:', this.authToken);
    }
  }

  onSubmit(): void {
    const apiUrl = 'http://localhost:8081/api/indent-form/submit';

    this.indent.submittedAt = new Date().toISOString();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`
    });

    this.http.post(apiUrl, this.indent, {
      headers,
      responseType: 'text',
      observe: 'response'
    }).subscribe({
      next: (response: HttpResponse<any>) => {
        this.submitted = true;
        this.responseMessage = response.body || '';
        this.isError = false;
        this.updateAuthToken(response);
        this.showToast("Indent Form Submitted");
        this.resetForm();
      },
      error: (error) => {
        this.submitted = true;
        this.responseMessage = 'Error: ' + (error.error || error.message);
        this.isError = true;
        this.showToast('❌ Error submitting form: ' + error.message);
      }
    });
  }

  resetForm(): void {
    this.indent = {
      department: '',
      asset_type: '',
      budget_head: '',
      date: '',
      indenterName: '',
      indenterDesignation: '',
      hodName: '',
      hodDesignation: '',
      purposeOfPurchase: '',
      itemName: '',
      quantity: '',
      cost: '',
      installationBy: '',
      deliveryPeriod: '',
      installationReady: '',
      purchaseMode: '',
      vendors: [{ vendorName: '', vendorMobile: '', vendorAddress: '', vendorEmail: '' }],
      inspectionDate: '',
      trainingRequired: '',
      operationalDate: '',
      emergencyPurchase: '',
      warrantyDetails: '',
      amcRequired: '',
      repeatOrder: '',
      certification1: false,
      certification2: false,
      certification3: false,
      expectedTime: '',
      trainingReason: '',
      undertaking: '',
      certified: false,
      remarks: '',
      submittedAt: ''
    };
  }

  updateAuthToken(response: HttpResponse<any>): void {
    const authHeader = response.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const newToken = authHeader.split(' ')[1];
      if (newToken && isPlatformBrowser(this.platformId)) {
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 30);
        this.cookieService.set('authToken', newToken, expiryDate, '/', '', false, 'Strict');
        this.authToken = newToken;
        console.log('🔄 Token updated with expiry:', newToken);
      }
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

  addVendor(): void {
    this.indent.vendors.push({ vendorName: '', vendorMobile: '', vendorAddress: '', vendorEmail: '' });
  }

  removeVendor(index: number): void {
    if (this.indent.vendors.length > 1) {
      this.indent.vendors.splice(index, 1);
    }
  }

  onFieldChange(): void {
    this.showExpectedTime = this.indent.installationReady === 'No';
    this.showVendorDetails = this.indent.purchaseMode !== 'GeM';
    this.showTrainingReason = this.indent.trainingRequired === 'Yes';
    this.showUndertakingUpload = this.indent.repeatOrder === 'Yes';
  }
}
