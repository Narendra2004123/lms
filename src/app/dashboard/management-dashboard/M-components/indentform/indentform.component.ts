import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../auth.service';

@Component({
  selector: 'app-indentform',
  standalone: true,
  templateUrl: './indentform.component.html',
  styleUrls: ['./indentform.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class IndentformComponent implements OnInit {
  indent: any = {
    department: '',
    email: '',
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
    repeatOrderFile: null,
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

  departments: { departmentId: string, department: string }[] = [];
  defaultEmail: string = '';
  submitted = false;
  responseMessage = '';
  isError = false;
  authToken = '';

  showExpectedTime = false;
  showVendorDetails = false;
  showTrainingReason = false;
  showUndertakingUpload = false;
  remainingChars: number = 500;

  isSubmitted: boolean = false;
  isEditing: boolean = false;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private snackBar: MatSnackBar,
    private authService:AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadAuthToken();
    this.fetchDepartments();
  }
  
  updateCharCount() {
    this.remainingChars = 500 - this.indent.purposeOfPurchase.length;
  }
  fetchDepartments(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`
    });
  
    this.http.get<any>(this.authService.FETCH_DEPT, { headers, observe: 'response' }).subscribe({
      next: (response) => {
        const res = response.body;
        if (res?.status && res.data?.departments) {
          this.departments = res.data.departments;
          this.defaultEmail = res.data.email;
          this.indent.email = this.defaultEmail;
          console.log('📋 Departments:', this.departments);
          console.log('📧 Default Email:', this.defaultEmail);
          this.updateAuthToken(response);
        }
      },
      error: (err) => {
        console.error('❌ Error fetching departments:', err);
        this.showToast('Failed to load departments');
      }
    });
  }

  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file);
      this.indent.repeatOrderFile = file;
    }
  }

  saveDraft() {
    console.log('Form saved as draft:', this.indent);
    this.isEditing = false;
    this.isSubmitted = false;
  }

  editForm() {
    console.log('Form is now editable');
    this.isEditing = true;
    this.isSubmitted = false;
  }

  loadAuthToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authToken = this.cookieService.get('authToken') || '';
      console.log('🔐 Loaded authToken:', this.authToken);
    }
  }

  onSubmit() {

    this.indent.submittedAt = new Date().toISOString();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`
    });

    this.http.post(this.authService.SUBMIT_INDENT_URL, this.indent, {
      headers,
      responseType: 'text',
      observe: 'response'
    }).subscribe({
      next: (response: HttpResponse<any>) => {
        this.submitted = true;
        this.responseMessage = response.body || '';
        this.isError = false;
        this.updateAuthToken(response);
        this.showToast("✅ Indent Form Submitted");
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
      repeatOrderFile: null,
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
    this.remainingChars = 500;
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
    this.showExpectedTime = this.indent.installationReady?.toLowerCase() === 'no';
    this.showVendorDetails = this.indent.purchaseMode?.toLowerCase() !== 'gem';
    this.showTrainingReason = this.indent.trainingRequired?.toLowerCase() === 'yes';
    this.showUndertakingUpload = !!this.indent.repeatOrderFile;
    this.indent.email = this.defaultEmail;
  }

}
