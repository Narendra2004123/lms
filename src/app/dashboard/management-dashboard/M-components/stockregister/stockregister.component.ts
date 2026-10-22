import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth.service';


@Component({
  selector: 'app-stockregister',
  standalone: true,
  templateUrl: './stockregister.component.html',
  styleUrl: './stockregister.component.css',
  imports: [FormsModule, CommonModule, HttpClientModule],
})
export class StockregisterComponent implements OnInit {
  formData: any = {
    description: '',
    assetNumber: '',
    quantity: null,
    uom: '',
    unitRate: null,
    gstPercentage: 18,
    gstAmount: null,
    unitRateWithGST: null,
    totalValue: null,
    serialNumber: '',
    capitalizationCost: null,
    capitalizationDate: '',
    poNumber: '',
    poDate: '',
    supplier: '',
    stockRegister: '',
    indentor: '',
    purchaseChannel: '',
    indentNumber: '',
    purchaseDate: '',
    remarks: '',
    dateOfReceiving: '',
    gatePass: null,
    supplierName: '',
    supplierAddress: '',
    supplierEmail: '',
    supplierPhone: '',
    supplierGST: '',
    warranty: '',
    warrantyYears: '',
    warrantyFromDate: '',
    warrantyToDate: '',
    warrantyCertificate: null,
    amc: '',
    amcYears: '',
    amcFromDate: '',
    amcToDate: '',
    amcCertificate: '',
    categoryClass: '',
    stockRegisterPageNo: '',
    stockRegisterSerialNo: '',
    location: '',
    deployedPlace: '',
    user: '',
    status: ''
  };
  
  authToken: string = '';
  
  isDirectPurchase = false;
  isOtherPurchase = false;
  showWarrantyDetails = false;
  showAMCDetails = false;
  showOtherFields = false;
  uploadedFileName = '';

  warrantyYearsList = Array.from({ length: 11 }, (_, i) => i);
  amcYearsList = Array.from({ length: 11 }, (_, i) => i);
  locationOptions = ['IT Stock', 'Others'];
  statusOptions = ['Working', 'Not Working', 'Under Maintenance', 'Retained', 'Transferred', 'Disposed'];
  uomOptions = ['Litre(ltr)', 'Meter(m)', 'Centimeter(cm)', 'LOT', 'Lumpsum'];

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService,
    private snackBar:MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadAuthToken();
  }

  loadAuthToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authToken = this.cookieService.get('authToken') || '';
      console.log('🔑 Loaded authToken:', this.authToken);
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

  calculateGST() {
    const unitRate = this.formData.unitRate || 0;
    const gstPercentage = this.formData.gstPercentage || 18;
    const quantity = this.formData.quantity || 1;

    const gstAmount = (unitRate * gstPercentage) / 100;
    const unitRateWithGST = unitRate + gstAmount;
    const totalValue = unitRateWithGST * quantity;

    this.formData.gstAmount = gstAmount.toFixed(2);
    this.formData.unitRateWithGST = unitRateWithGST.toFixed(2);
    this.formData.totalValue = totalValue.toFixed(2);
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedExtensions = ['doc', 'docx', 'jpg', 'png', 'pdf'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (allowedExtensions.includes(fileExtension!)) {
        this.uploadedFileName = file.name;
        this.formData.gatePass = file;
      } else {
        this.showToast('Invalid file format. Only DOC, DOCX, JPG, PNG, and PDF are allowed.');
        this.uploadedFileName = '';
        this.formData.gatePass = null;
      }
    }
  }

  toggleWarranty(isWarrantySelected: boolean) {
    this.showWarrantyDetails = isWarrantySelected;
    if (!isWarrantySelected) {
      this.formData.warrantyYears = '';
      this.formData.warrantyFromDate = '';
      this.formData.warrantyToDate = '';
      this.formData.warrantyCertificate = null;
    }
  }

  onAMCChange(value: string) {
    this.showAMCDetails = value === 'yes';
    if (!this.showAMCDetails) {
      this.formData.amcYears = '';
      this.formData.amcFromDate = '';
      this.formData.amcToDate = '';
      this.formData.amcCertificate = '';
    }
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      if (type === 'warranty') {
        this.formData.warrantyCertificate = file.name;
      } else if (type === 'amc') {
        this.formData.amcCertificate = file.name;
      }
    }
  }

  onLocationChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.showOtherFields = selectElement.value === 'Others';

    if (!this.showOtherFields) {
      this.formData.deployedPlace = '';
      this.formData.user = '';
    }
  }

  onPurchaseChannelChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.isDirectPurchase = selectedValue === 'Direct Purchase';
    this.isOtherPurchase = ['PAC', 'GEM', 'LPC'].includes(selectedValue);
  }

  submitForm() {
    const requiredFields = [
      'description', 'assetNumber', 'quantity', 'uom', 'unitRate', 'gstPercentage',
      'serialNumber', 'capitalizationCost', 'capitalizationDate', 'supplier', 'stockRegister',
      'indentor', 'purchaseChannel', 'dateOfReceiving', 'gatePass', 'supplierName',
      'supplierAddress', 'supplierEmail', 'supplierPhone', 'supplierGST', 'warranty', 'amc',
      'categoryClass', 'stockRegisterPageNo', 'stockRegisterSerialNo', 'location', 'status'
    ];

    const missingFields = requiredFields.filter(key => !this.formData[key]);

    if (missingFields.length > 0) {
      this.showToast(
        'Please fill in the required fields marked with (*):\n\n' +
        missingFields.map(this.formatLabel).join('\n')
      );
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`
    });

    const apiUrl = this.authService.STOCKREGISTER_URL; // 🔁 Define this URL in your AuthService

    this.http.post(apiUrl, this.formData, {
      headers,
      observe: 'response'
    }).subscribe({
      next: (response: HttpResponse<any>) => {
        this.showToast('✅ Form submitted successfully!');
        this.updateAuthToken(response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.showToast('❌ Error submitting form:\n' + (error.error || error.message));
      }
    });
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
        console.log('🔄 Auth token refreshed:', newToken);
      }
    }
  }

  formatLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
}