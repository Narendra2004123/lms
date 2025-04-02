import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone:false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userRole: string = ''; // Role dynamically fetched from localStorage
  menuItems: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedRole = localStorage.getItem('user_type');
      if (storedRole) {
        this.userRole = storedRole.trim();
      }
      this.setMenuItems();
    } else {
      console.warn('localStorage is not available in this environment.');
    }
  }

  setMenuItems() {
    if (this.userRole === 'r4') {
      this.menuItems = [
        { label: 'Profile', route: '/dashboard/student/profile', icon: 'user' },
        { label: 'Courses', route: '/dashboard/student/Scourses', icon: 'book' },
        { label: 'Classrooms', route: '/dashboard/student/classrooms', icon: 'chalkboard' },
        { label: 'Course Registration', route: '/dashboard/student/courseregistration', icon: 'clipboard-list' },
        { label: 'Exams', route: '/dashboard/student/exams', icon: 'file-alt' },
        { label: 'Feedback', route: '/dashboard/student/feedback', icon: 'comment-dots' },
        { label: 'Quiz/Online Test', route: '/dashboard/student/quiz', icon: 'question-circle' },
        {label:'requist',route:'dashboard/student/requist',icon:'answer'}
      ];
    } else if (this.userRole === 'r3') {
      this.menuItems = [
        { label: 'Profile', route: '/dashboard/faculty/profile', icon: 'user' },
        { label: 'Courses', route: '/dashboard/faculty/courses', icon: 'book' },
        { label: 'Schedule', route: '/dashboard/faculty/schedule', icon: 'calendar-alt' },
        { label: 'Exams', route: '/dashboard/faculty/exams', icon: 'file-alt' },
        { label: 'Feedback', route: '/dashboard/faculty/feedback', icon: 'comment-dots' },
        { label: 'Classroom', route: '/dashboard/faculty/classroom', icon: 'chalkboard-teacher' },
        { label: 'Indent', route: '/dashboard/faculty/indent', icon: 'file-invoice' },
        { label: 'Purchase', route: '/dashboard/faculty/purchase', icon: 'shopping-cart' }
      ];
    } else if (this.userRole === 'r2') {
      this.menuItems = [
        { label: 'Manage Users', route: '/dashboard/management/manage-users', icon: 'users-cog' },
        { label: 'Reports', route: '/dashboard/management/reports', icon: 'chart-bar' },
        { label: 'Course Management', route: '/dashboard/management/course-management', icon: 'tasks' },
        { label: 'Feedback', route: '/dashboard/management/feedback', icon: 'comment-dots' }
      ];
    } else {
      console.warn('Invalid user role:', this.userRole);
    }
  }
}
