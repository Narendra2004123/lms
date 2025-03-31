import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase',
  standalone:true,
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
  imports:[FormsModule,CommonModule]
})
export class PurchaseComponent implements OnInit {
  purchaseFormData: any = {
    approvalStatus: '',
    indentNumber: '',
    budgetHeadChecked: false,
    budgetHead: '',
    fundsAvailableChecked: false,
    natureOfItem: '',
    budgetAllocated: '',
    totalAmount: '',
    balanceAvailable: ''
  };

  constructor() {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.isFormValid()) {
      console.log('Form Data:', this.purchaseFormData);
      alert('Form submitted successfully!');
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  isFormValid(): boolean {
    return (
      this.purchaseFormData.approvalStatus &&
      this.purchaseFormData.indentNumber.match(/^[A-Za-z0-9/._-]+$/) &&
      this.purchaseFormData.natureOfItem &&
      this.purchaseFormData.budgetAllocated >= 0 &&
      this.purchaseFormData.totalAmount >= 0 &&
      this.purchaseFormData.balanceAvailable >= 0
    );
  }
  
  isValidIndentNumber(): boolean {
    return /^[A-Za-z0-9/._-]+$/.test(this.purchaseFormData.indentNumber);
  }
  
}
