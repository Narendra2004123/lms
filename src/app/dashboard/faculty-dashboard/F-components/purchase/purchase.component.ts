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
  indentNumber: string = '';
  budgetHeadChecked: boolean = false;
  budgetHead: string = '';
  fundsAvailableChecked: boolean = false;
  natureOfItem: string = '';
  budgetAllocated: number | null = null;
  totalAmount: number | null = null;
  balanceAvailable: number | null = null;

  ngOnInit(): void {
    // You can place any initialization logic here
    // Example: Resetting or loading from a service
    this.resetForm();
  }

  resetForm(): void {
    this.indentNumber = '';
    this.budgetHeadChecked = false;
    this.budgetHead = '';
    this.fundsAvailableChecked = false;
    this.natureOfItem = '';
    this.budgetAllocated = null;
    this.totalAmount = null;
    this.balanceAvailable = null;
  }

  onSubmit(form: any): void {
    if (form.valid) {
      const formData = {
        indentNumber: this.indentNumber,
        budgetHeadChecked: this.budgetHeadChecked,
        budgetHead: this.budgetHeadChecked ? this.budgetHead : 'N/A',
        fundsAvailableChecked: this.fundsAvailableChecked,
        natureOfItem: this.natureOfItem,
        budgetAllocated: this.budgetAllocated,
        totalAmount: this.totalAmount,
        balanceAvailable: this.balanceAvailable
      };
      console.log('Form Data:', formData);
      alert('Form submitted successfully!');
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
  
}
