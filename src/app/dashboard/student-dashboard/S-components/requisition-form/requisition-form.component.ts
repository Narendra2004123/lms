import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-requisition-form',
  standalone: true,
  templateUrl: './requisition-form.component.html',
  styleUrls: ['./requisition-form.component.css'], // Fixed `styleUrls`
  imports: [FormsModule, CommonModule], // Correct import placement
})
export class RequisitionFormComponent implements OnInit {
  user = {
    name: '',
    programme: '',
    rollNo: '',
    branch: '',
    specialization: '',
    email: '',
    mobile:'',
    accommodation: '',
    purpose: '',
    remoteAccess: '',
    licenseOS: '',
    fromDate: '',
    toDate: ''
  };

  submitted = false;

  ngOnInit(): void {
    // Removed `onSubmit()` from here
  }

  onSubmit() {
    this.submitted = true;
    console.log('Form Data:', this.user);
  }
}
