import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './forgot-pwd/forgot-pwd.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { OtpRegisterComponent } from './otp-register/otp-register.component';
import { LandComponent } from './land/land.component';
import { RegisterAdminComponent } from './register-admin/register-admin.component';
import { FrontheadComponent } from './fronthead/fronthead.component';
import {LayoutComponent} from './layout/layout.component'
import { FooterComponent } from './footer/footer.component';
import {StudentDashboardComponent } from './dashboard/student-dashboard/student-dashboard.component';
import {FacultyDashboardComponent} from './dashboard/faculty-dashboard/faculty-dashboard.component';
import {ManagementDashboardComponent} from './dashboard/management-dashboard/management-dashboard.component';

//student components
import { ProfileComponent as StudentProfile } from './dashboard/student-dashboard/S-components/profile/profile.component';
import { SCoursesComponent as StudentCourses } from './dashboard/student-dashboard/S-components/Scourses/Scourses.component';
import { ClassroomsComponent } from './dashboard/student-dashboard/S-components/classrooms/classrooms.component';
import { CourseRegistrationComponent } from './dashboard/student-dashboard/S-components/courseregistration/courseregistration.component';
import { ExamsComponent as StudentExams } from './dashboard/student-dashboard/S-components/exams/exams.component';
import { FeedbackComponent as StudentFeedback } from './dashboard/student-dashboard/S-components/feedback/feedback.component';
import { QuizComponent } from './dashboard/student-dashboard/S-components/quiz/quiz.component';
import { RequisitionFormComponent } from './dashboard/student-dashboard/S-components/requisition-form/requisition-form.component';
import { AchieveComponent } from './dashboard/student-dashboard/S-components/achieve/achieve.component';
import { RequestComponent } from './dashboard/student-dashboard/S-components/request/request.component';
import { SAttendanceComponent } from './dashboard/student-dashboard/S-components/s-attendance/s-attendance.component';
// Faculty Components
import { ProfileComponent as FacultyProfile } from './dashboard/faculty-dashboard/F-components/profile/profile.component';
import { CoursesComponent as FacultyCourses } from './dashboard/faculty-dashboard/F-components/courses/courses.component';
import { ExamsComponent as FacultyExams } from './dashboard/faculty-dashboard/F-components/exams/exams.component';
import { FeedbackComponent as FacultyFeedback } from './dashboard/faculty-dashboard/F-components/feedback/feedback.component';
import { PurchaseComponent } from './dashboard/faculty-dashboard/F-components/purchase/purchase.component';
import { AttendanceComponent } from './dashboard/faculty-dashboard/F-components/attendance/attendance.component';
import { FAcademicsComponent } from './dashboard/faculty-dashboard/F-components/f-academics/f-academics.component';
import { ManageComponent } from './dashboard/faculty-dashboard/F-components/manage/manage.component';
import { StockregisterComponent } from './dashboard/faculty-dashboard/F-components/stockregister/stockregister.component';


// Management Components
import { MprofileComponent } from './dashboard/management-dashboard/M-components/mprofile/mprofile.component';
import { ManageUsersComponent } from './dashboard/management-dashboard/M-components/manage-users/manage-users.component';
import { ReportsComponent } from './dashboard/management-dashboard/M-components/reports/reports.component';
import { CourseManagementComponent } from './dashboard/management-dashboard/M-components/course-management/course-management.component';
import { FeedbackComponent as ManagementFeedback } from './dashboard/management-dashboard/M-components/feedback/feedback.component';
import { ListComponent } from './dashboard/student-dashboard/S-components/list/list.component';
import { CallenderComponent } from './dashboard/faculty-dashboard/F-components/callender/callender.component';
import { RequestlistComponent } from './dashboard/management-dashboard/M-components/requestlist/requestlist.component';
import { IndentformComponent } from './dashboard/management-dashboard/M-components/indentform/indentform.component';


// Student Components


const routes: Routes = [
  { path: '', redirectTo: '/land', pathMatch: 'full' },
  {
    path: '',component: LayoutComponent, // The main layout (with header/sidebar)
    children: [
      { path: 'dashboard/student', component: StudentDashboardComponent },
      { path: 'dashboard/student/profile', component: StudentProfile },
      { path: 'dashboard/student/Scourses', component: StudentCourses },
      {path:'dashboard/student/s-attendance',component:SAttendanceComponent},
      {path:'dashboard/student/request',component:RequestComponent},
      {path:"dashboard/student/acheive",component:AchieveComponent},
      { path: 'dashboard/student/courseregistration', component:CourseRegistrationComponent },
      { path: 'dashboard/student/classrooms', component: ClassroomsComponent },
      { path: 'dashboard/student/exams', component: StudentExams },
      { path: 'dashboard/student/feedback', component: StudentFeedback },
      {path: 'dashboard/student/quiz', component:QuizComponent },
      {path:'dashboard/student/requist',component:RequisitionFormComponent},
      { path: 'dashboard/student/list', component: ListComponent },


      // Faculty Routes
      { path: 'dashboard/faculty', component: FacultyDashboardComponent },
      { path: 'dashboard/faculty/profile', component: FacultyProfile },
      { path: 'dashboard/faculty/courses', component: FacultyCourses },
      { path: 'dashboard/faculty/exams', component: FacultyExams },
      { path: 'dashboard/faculty/feedback', component: FacultyFeedback },
      {path:'dashboard/faculty/purchase',component:PurchaseComponent},
      {path:'dashboard/faculty/attendance',component:AttendanceComponent},
      {path:'dashboard/faculty/f-academic',component:FAcademicsComponent},
      {path:'dashboard/faculty/manage',component:ManageComponent},
      {path:'dashboard/faculty/stock-register',component:StockregisterComponent},
      {path:'dashboard/faculty/callender',component:CallenderComponent},
      
      // Management Routes
      { path: 'dashboard/management', component: ManagementDashboardComponent },
      {path:'dashboard/management/mprofile',component:MprofileComponent},
      { path: 'dashboard/management/manage-users', component: ManageUsersComponent },
      { path: 'dashboard/management/reports', component: ReportsComponent },
      { path: 'dashboard/management/course-management', component: CourseManagementComponent },
      { path: 'dashboard/management/feedback', component: ManagementFeedback },
      {path:'dashboard/management/requisitionform',component:RequestlistComponent},
      {path:'dashboard/management/indentform',component:IndentformComponent},
    ]
  },
  {path:'header',component:FrontheadComponent},
  {path:'land',component:LandComponent},// Default route
  { path: 'home', component: HomeComponent },
  { path: 'register',component:RegisterComponent},
  {path:'footer',component:FooterComponent},
  { path: 'forgot-pwd', component: ForgotPasswordComponent },
  {path:'otp-verification',component:OtpVerificationComponent},
  {path:'otp-register',component:OtpRegisterComponent},
  {path:'reset-password',component:ResetPasswordComponent},
  {path:'register-admin',component:RegisterAdminComponent},
  { path: '**', redirectTo: '/land' }, // Wildcard route for invalid paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
