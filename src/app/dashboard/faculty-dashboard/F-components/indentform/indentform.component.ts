import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  
    constructor( private snackBar: MatSnackBar) {}
  
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
    this.startAutoSave();
  }

  startAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      if (!this.isSubmitted) {
        this.saveDraft(false);
      }
    }, 30000);
  }
  
  saveDraft(showAlert: boolean = true) {
    try {
      const newDraft = JSON.stringify(this.indent);
      const existingDraft = localStorage.getItem('indentDraft');
  
      // Prevent unnecessary saves
      if (existingDraft === newDraft) {
        return; // No changes, so don't save
      }
  
      localStorage.setItem('indentDraft', newDraft);
      localStorage.setItem('isDraftSaved', 'true'); // Mark draft as explicitly saved
  
      if (showAlert) {
        this.showToast('Draft saved successfully!');
      }
  
      this.isEditing = true;
    } catch (error) {
      console.error('Error saving draft:', error);
      if (showAlert) {
        this.showToast('Failed to save draft. Please try again.');
      }
    }
  }
  

  loadDraft() {
    const savedData = localStorage.getItem('indentDraft');
    const isDraftSaved = localStorage.getItem('isDraftSaved'); // Track if user explicitly saved
    
    if (savedData && isDraftSaved === 'true') {
      try {
        this.indent = JSON.parse(savedData);
        this.isEditing = true;
        this.showToast('Draft loaded successfully.');
      } catch (error) {
        console.error('Error loading draft:', error);
        this.showToast('Failed to load draft. Please try again.');
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
    this.showToast('Form reset successfully.');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.indent.undertaking = file;
    }
  }
  toggleVendorDetails() {
    this.showVendorDetails = this.indent.purchaseMode !== 'GeM';
    if (!this.showVendorDetails) {
      this.indent.vendors = [{ vendorName: '', vendorMobile: '', vendorAddress: '', vendorEmail: '' }];
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
  
  onSubmit() {
    if (!this.indent.department || !this.indent.indenterName || !this.indent.itemName) {
      this.showToast('Please fill in all required fields.');
      return;
    }
    this.showToast('Form submitted successfully!');
    this.isSubmitted = true;
    this.isEditing = false;
    localStorage.removeItem('indentDraft');
    clearInterval(this.autoSaveInterval);
    this.generatePDF(); // Generate PDF on submit
  }

  enableEdit() {
    this.isSubmitted = false;
    this.isEditing = true;
  }

  generatePDF() {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Indent Form Details', 14, 20);

    const headers = ['Field', 'Value'];
    const rows = [
      ['Department', this.indent.department],
      ['Asset Type', this.indent.asset_type],
      ['Budget Head', this.indent.budget_head],
      ['Date', this.indent.date],
      ['Indenter Name', this.indent.indenterName],
      ['Indenter Designation', this.indent.indenterDesignation],
      ['HOD Name', this.indent.hodName],
      ['HOD Designation', this.indent.hodDesignation],
      ['Purpose of Purchase', this.indent.purposeOfPurchase],
      ['Item Name', this.indent.itemName],
      ['Quantity', this.indent.quantity],
      ['Estimated Cost (₹)', this.indent.cost],
      ['Installation By', this.indent.installationBy],
      ['Delivery Period', this.indent.deliveryPeriod],
      ['Installation Requirements Ready', this.indent.installationReady],
      ['Purchase Mode', this.indent.purchaseMode],
      ['Inspection Date', this.indent.inspectionDate],
      ['Warranty Details', this.indent.warrantyDetails],
      ['Operational Availability Date', this.indent.operationalDate]
    ];

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      theme: 'grid'
    });

    doc.save('IndentForm.pdf'); // Save as PDF
  }

  viewPDF() {
    const pdfData = localStorage.getItem('indentPDF');
    if (pdfData) {
      const pdfWindow = window.open('');
      pdfWindow?.document.write(`<iframe width="100%" height="100%" src="${pdfData}"></iframe>`);
    } else {
      this.showToast('No PDF available. Submit the form first.');
    }
  }
}