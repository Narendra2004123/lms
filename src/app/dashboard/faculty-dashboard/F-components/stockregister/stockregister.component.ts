import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-stockregister',
  standalone: false,
  templateUrl: './stockregister.component.html',
  styleUrl: './stockregister.component.css'
})
export class StockregisterComponent {
registerForm: FormGroup;
isDirectPurchase:boolean=false;
isOtherPurchase: boolean = false; 
uploadedFileName:string='';
showWarrantyDetails = false;
showAMCDetails: boolean = false;
warrantyYearsList: number[] = Array.from({ length: 11 }, (_, i) => i); 
amcYearsList: number[] = Array.from({ length: 11 }, (_, i) => i);
showOtherFields: boolean = false;
locationOptions = ['IT Stock', 'Others'];
statusOptions = ['Working', 'Not Working', 'Under Maintenance', 'Retained', 'Transferred', 'Disposed'];
uomOptions = [ 'Piece', 'Meter', 'Box', 'Set', 'Packet'];


  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      description: ['', Validators.required],
      assetNumber: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      uom: ['', Validators.required],
      unitRate: [null, [Validators.required, Validators.min(0)]],
      gstpercentage: [18, [Validators.required,Validators.min(0)]],
      gstamount: [{ value: null, disabled: true }],
      unitRateWithGST: [{value:null, disabled:true}],
      totalValue: [{value:null, disabled:true}],
      serialNumber: ['', Validators.required],
      capitalizationCost: [null, Validators.required],
      capitalizationDate: ['', Validators.required],
      poNumber: [''],
      poDate:[''],
      supplier: ['', Validators.required],
      stockRegister: ['', Validators.required],
      indentor: ['', Validators.required],
      purchaseChannel: ['', Validators.required],
      indentNumber: [''], 
      purchaseDate: [''], 
      remarks: [''],
     
      dateOfReceiving:['',Validators.required],
      gatePass:[null,Validators.required],
     
      supplierName: ['', Validators.required],
      supplierAddress: ['', Validators.required],
      supplierEmail: ['', [Validators.required, Validators.email]],
      supplierPhone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      supplierGST: ['', [Validators.required, Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$")]],
     
      warranty: ['', Validators.required],
      warrantyYears: [''],
      warrantyFromDate: [''],
      warrantyToDate: [''],
      warrantyCertificate: [null],

      amc: ['', Validators.required],
      amcYears: [''],
      amcFromDate: [''],
      amcToDate: [''],
      amcCertificate: [''],

      categoryClass: ['', Validators.required],
      stockRegisterPageNo: ['', Validators.required],
      stockRegisterSerialNo: ['', Validators.required],

      location: ['', Validators.required],
      deployedPlace: [''],
      user: [''],

      status: ['', Validators.required]
    });
  }
    ngOnInit() {
      this.registerForm.get('gst percentage')?.valueChanges.subscribe(gstPercentage => {
        this.calculateGST();
      });
    
      this.registerForm.get('unitRate')?.valueChanges.subscribe(unitRate => {
        this.calculateGST();
      });
      this.registerForm.get('purchaseChannel')?.valueChanges.subscribe(value => {
        this.isDirectPurchase = value === 'Direct Purchase';
  
        if (this.isDirectPurchase) {
          this.registerForm.get('indentNumber')?.setValidators([Validators.required]);
          this.registerForm.get('purchaseDate')?.setValidators([Validators.required]);
        } else {
          this.registerForm.get('indentNumber')?.clearValidators();
          this.registerForm.get('purchaseDate')?.clearValidators();
        }
        this.registerForm.get('indentNumber')?.updateValueAndValidity();
        this.registerForm.get('purchaseDate')?.updateValueAndValidity();
      });

      this.registerForm.get('purchaseChannel')?.valueChanges.subscribe(value => {
        this.isDirectPurchase = value === 'Direct Purchase';
        this.isOtherPurchase = value === 'PAC' || value === 'GEM' || value === 'LPC';
  
        if (this.isDirectPurchase) {
          this.registerForm.get('indentNumber')?.setValidators([Validators.required]);
          this.registerForm.get('purchaseDate')?.setValidators([Validators.required]);
          this.registerForm.get('poNumber')?.clearValidators();
          this.registerForm.get('poDate')?.clearValidators();
        } 
        else if (this.isOtherPurchase) {
          this.registerForm.get('indentNumber')?.setValidators([Validators.required]);
          this.registerForm.get('poNumber')?.setValidators([Validators.required]);
          this.registerForm.get('poDate')?.setValidators([Validators.required]);
          this.registerForm.get('purchaseDate')?.clearValidators();
        } 
        else {
          this.registerForm.get('indentNumber')?.clearValidators();
          this.registerForm.get('poNumber')?.clearValidators();
          this.registerForm.get('poDate')?.clearValidators();
          this.registerForm.get('purchaseDate')?.clearValidators();
        }
  
        this.registerForm.get('indentNumber')?.updateValueAndValidity();
        this.registerForm.get('poNumber')?.updateValueAndValidity();
        this.registerForm.get('poDate')?.updateValueAndValidity();
        this.registerForm.get('purchaseDate')?.updateValueAndValidity();
      });

    }
    
    calculateGST() {
      const unitRate = this.registerForm.get('unitRate')?.value || 0;
      const gstPercentage = this.registerForm.get('gst percentage')?.value || 18; 
      const quantity = this.registerForm.get('quantity')?.value || 1; 
    
      const gstAmount = (unitRate * gstPercentage) / 100;
      const unitRateWithGST = unitRate + gstAmount;
      const totalValue = unitRateWithGST * quantity;
    
      this.registerForm.patchValue({
        gst2: gstAmount.toFixed(2),
        unitRateWithGST: unitRateWithGST.toFixed(2),
        totalValue: totalValue.toFixed(2),
      });
    }
    handleFileUpload(event: any) {
      const file = event.target.files[0];
      if (file) {
        const allowedExtensions = ['doc', 'docx', 'jpg', 'png', 'pdf'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
        if (allowedExtensions.includes(fileExtension!)) {
          this.uploadedFileName = file.name;
          this.registerForm.patchValue({ gatePass: file });
        } else {
          alert('Invalid file format. Only DOC, DOCX, JPG, PNG, and PDF are allowed.');
          this.uploadedFileName = '';
          this.registerForm.patchValue({ gatePass: null });
        }
      }
    }
    toggleWarranty(isWarrantySelected: boolean) {
      this.showWarrantyDetails = isWarrantySelected;
  
      if (!isWarrantySelected) {
        this.registerForm.patchValue({
          warrantyYears: '',
          warrantyFromDate: '',
          warrantyToDate: '',
          warrantyCertificate: null
        });
      }
    }
    onAMCChange(value: string) {
      this.showAMCDetails = value === 'yes';
      if (!this.showAMCDetails) {
        this.registerForm.patchValue({
          amcYears: '',
          amcFromDate: '',
          amcToDate: '',
          amcCertificate: ''
        });
      }
    }
  
    // Handle file selection
    onFileSelected(event: any, type: string) {
      const file = event.target.files[0];
      if (file) {
        if (type === 'warranty') {
          this.registerForm.patchValue({ warrantyCertificate: file.name });
        } else if (type === 'amc') {
          this.registerForm.patchValue({ amcCertificate: file.name });
        }
      }
    }
    onLocationChange(event: Event) {
      const selectElement = event.target as HTMLSelectElement;
      this.showOtherFields = selectElement.value === 'Others';
  
      // Reset deployedPlace and user fields when 'IT Stock' is selected
      if (!this.showOtherFields) {
        this.registerForm.patchValue({ deployedPlace: '', user: '' });
      }
      
    }
  
    generatePDF(): void {
      const doc = new jsPDF();
    
      doc.setFontSize(16);
      doc.text('Stock Register Form', 14, 20);
    
      const formData = this.registerForm.getRawValue(); // includes disabled fields too
    
      const data = Object.entries(formData).map(([key, value]) => {
        let displayValue = '';
      
        if (value instanceof File) {
          displayValue = value.name; // File name
        } else if (typeof value === 'string' || typeof value === 'number') {
          displayValue = String(value); // Convert string/number to string
        } else if (value !== null && value !== undefined) {
          displayValue = JSON.stringify(value); // fallback for arrays, objects
        }
      
        return [this.formatLabel(key), displayValue];
      });
      autoTable(doc, {
        head: [['Field', 'Value']],
        body: data,
        startY: 30,
        styles: { fontSize: 10, cellWidth: 'wrap', lineColor: [0, 0, 0],       // Black line
          lineWidth: 0.1, },
        headStyles: { fillColor: [0, 123, 255] },
      });
    
      doc.save('stock-register.pdf');
    }
    
    // Optional: Format camelCase to readable label
    formatLabel(key: string): string {
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
        
    }
    
    

    submitForm() {
      if (this.registerForm.valid) {
        alert('Form submitted successfully!\n' + JSON.stringify(this.registerForm.value, null, 2));
      } else {
        const missingRequiredFields: string[] = [];
    
        Object.keys(this.registerForm.controls).forEach(key => {
          const control = this.registerForm.get(key);
          if (control && control.errors?.['required']) {
            missingRequiredFields.push(this.formatLabel(key));
          }
        });
    
        if (missingRequiredFields.length > 0) {
          alert(
            'Please fill in the required fields marked with (*):\n\n' +
            missingRequiredFields.join('\n')
          );
        } else {
          alert('Please fill in all required fields correctly.');
        }
      }
    }
    
}