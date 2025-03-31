import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-indentform',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './indentform.component.html',
  styleUrls: ['./indentform.component.css']
})

export class IndentformComponent implements OnInit {
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
    undertaking: null
  };

  showExpectedTime: boolean = false;
  showVendorDetails: boolean = false;
  showTrainingReason: boolean = false;
  showUndertakingUpload: boolean = false;
  selectedFile: File | null = null;
  maxChars = 500;
  remainingChars = 500;
  isSubmitted: boolean = false;
  isEditing: boolean = false;
  autoSaveInterval: any;

  ngOnInit(): void {
    this.loadDraft();
    // this.startAutoSave();
  }

  // startAutoSave() {
  //   this.autoSaveInterval = setInterval(() => {
  //     if (!this.isSubmitted) {
  //       this.saveDraft(false);
  //     }
  //   }, 30000);
  // }

  // saveDraft(showAlert: boolean = true) {
  //   try {
  //     localStorage.setItem('indentDraft', JSON.stringify(this.indent));
  //     if (showAlert) alert('Draft saved successfully!');
  //     this.isEditing = true;
  //   } catch (error) {
  //     console.error('Error saving draft:', error);
  //     alert('Failed to save draft. Please try again.');
  //   }
  // }

  loadDraft() {
    const savedData = localStorage.getItem('indentDraft');
    if (savedData) {
      try {
        this.indent = JSON.parse(savedData);
        this.isEditing = true;
        alert('Draft loaded successfully.');
      } catch (error) {
        console.error('Error loading draft:', error);
        alert('Failed to load draft. Please try again.');
      }
    }
  }

  onSubmit() {
    if (!this.indent.department || !this.indent.indenterName || !this.indent.itemName) {
      alert('Please fill in all required fields.');
      return;
    }
    alert('Form submitted successfully!');
    this.isSubmitted = true;
    localStorage.removeItem('indentDraft');
    clearInterval(this.autoSaveInterval);
  }

  enableEdit() {
    this.isSubmitted = false;
    this.isEditing = true;
    // this.startAutoSave();
  }

  resetForm() {
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
      undertaking: null
    };
    this.isSubmitted = false;
    this.isEditing = false;
    this.remainingChars = this.maxChars;
    alert('Form reset successfully.');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.indent.undertaking = file;
    }
  }

  updateCharCount() {
    this.remainingChars = this.maxChars - (this.indent.purposeOfPurchase.length || 0);
  }

  addVendor() {
    this.indent.vendors.push({ vendorName: '', vendorMobile: '', vendorAddress: '', vendorEmail: '' });
  }

  removeVendor(index: number) {
    this.indent.vendors.splice(index, 1);
  }
}