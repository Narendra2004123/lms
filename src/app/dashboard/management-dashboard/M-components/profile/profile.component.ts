import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class NtprofileComponent implements OnInit {
    staff: any = {
      name: 'Rajesh Kumar',
      Emp_id: 'NT12345',
      designation: 'Office Superintendent - Admin',
      department: 'Administration',
  
      dob: '1980-05-12',
      gender: 'Male',
      contact_number: '+91-9876543210',
      email: 'rajesh.kumar@iipe.ac.in',
      nationality: 'Indian',
  
      joining_date: '2010-07-01',
      employment_type: 'Permanent',
      reporting_authority: 'Registrar',
      location: 'Main Campus',
  
      section: 'Admin Section',
      functional_area: 'Administrative Management',
      responsibilities: 'Overseeing office operations, record maintenance, coordination with departments',
  
      qualification: 'M.A. in Public Administration',
      certifications: 'Office Procedures, Government Accounting',
      Experience: '10 years',
      previous_experience: 'Worked as Admin Assistant at XYZ University for 5 years',
  
      permanent_address: '123, New Colony, Visakhapatnam, Andhra Pradesh - 530001',
      current_address: 'Staff Quarters, Block B, IIPE Campus, Visakhapatnam, Andhra Pradesh - 530003'
    };
  
    constructor() { }
  
    ngOnInit(): void {}
  
    editProfile(): void {
      alert('Redirecting to profile edit form...');
      // Navigate to an edit page or open a modal form (implement based on your routing)
    }
  }