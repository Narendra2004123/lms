import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-admin',
  standalone: false,
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css'] // Fixed styleUrls issue
})
export class RegisterAdminComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      student_id: ['', Validators.required],
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      gender: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      blood_group: [''],
      nationality: ['', Validators.required],
      religion: [''],
      citizenship_status: [''],

      // Contact Details
      email: ['', [Validators.required, Validators.email]],
      primary_contact: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      alternate_contact: ['', Validators.pattern('[0-9]{10}')],
      emergency_contact: ['', Validators.pattern('[0-9]{10}')],

      // Permanent Address
      permanent_street: ['', Validators.required],
      permanent_village: ['', Validators.required],
      permanent_city: ['', Validators.required],
      permanent_district: ['', Validators.required],
      permanent_state: ['', Validators.required],
      permanent_pincode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],

      // Current Address
      current_street: ['', Validators.required],
      current_village: ['', Validators.required],
      current_city: ['', Validators.required],
      current_district: ['', Validators.required],
      current_state: ['', Validators.required],
      current_pincode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],

      // Admission Details
      date_of_admission: ['', Validators.required],
      cet_rank: ['', Validators.pattern('[0-9]+')],
      admission_type: [''],

      // Academic Details
      program_code: ['', Validators.required],
      department_code: ['', Validators.required],
      academic_year: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[0-9]{4}$')]], // Ensures valid year range
      section: [''],

      // Identity Marks
      identity_mark1: [''],
      identity_mark2: [''],

      // Document Details
      doc_id: ['', Validators.required],
      doc_type: ['', Validators.required],
      status: [''],
      doc: [null] // File input is handled separately
    });
  }

  ngOnInit() {
    this.setCurrentAcademicYear();
  }

  // Function to set the default academic year
  setCurrentAcademicYear() {
    const currentYear = new Date().getFullYear();
    this.registrationForm.patchValue({ academic_year: `${currentYear}-${currentYear + 1}` });
  }

  // Function to increment academic year
  incrementAcademicYear() {
    let academicYear = this.registrationForm.get('academic_year')?.value;
    if (academicYear) {
      let [start, end] = academicYear.split("-").map(Number);
      const currentYear = new Date().getFullYear();
      
      if (end < currentYear + 1) { // Limit up to the current year
        this.registrationForm.patchValue({ academic_year: `${start + 1}-${end + 1}` });
      }
    }
  }

  // Function to decrement academic year
  decrementAcademicYear() {
    let academicYear = this.registrationForm.get('academic_year')?.value;
    if (academicYear) {
      let [start, end] = academicYear.split("-").map(Number);
      
      if (start > 2000) { // Limit lower bound to 2000
        this.registrationForm.patchValue({ academic_year: `${start - 1}-${end - 1}` });
      }
    }
  }

  // Function to handle file input
  handleFileInput(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.registrationForm.patchValue({ doc: file });
      this.registrationForm.get('doc')?.updateValueAndValidity(); // Ensure form validation updates
    }
  }

  // Function to submit the form
  submitForm() {
    if (this.registrationForm.valid) {
      const formData = new FormData();
      Object.keys(this.registrationForm.value).forEach(key => {
        const value = this.registrationForm.value[key];
        if (value instanceof File) {
          formData.append(key, value, value.name); // Handle file separately
        } else {
          formData.append(key, value);
        }
      });

      console.log('Form Submitted', formData);
      // Here, you would typically send formData to the backend via an HTTP request
    } else {
      console.log('Form Invalid');
    }
  }
}
