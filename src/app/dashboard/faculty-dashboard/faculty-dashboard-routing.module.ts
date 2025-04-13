import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../faculty-dashboard/F-components/profile/profile.component';
import { CoursesComponent} from '../faculty-dashboard/F-components/courses/courses.component';
import { ExamsComponent } from './F-components/exams/exams.component';
import { FeedbackComponent} from './F-components/feedback/feedback.component';
import { ClassroomComponent } from './F-components/classroom/classroom.component';
import { PurchaseComponent } from './F-components/purchase/purchase.component';
import { AttendanceComponent } from './F-components/attendance/attendance.component';
import { FAcademicsComponent } from './F-components/f-academics/f-academics.component';
import { ManageComponent } from './F-components/manage/manage.component';
import { CallenderComponent } from './F-components/callender/callender.component';
import { IndentreqComponent } from './F-components/indentreq/indentreq.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'exams', component: ExamsComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'classroom', component: ClassroomComponent },
  {path:'purchase',component:PurchaseComponent},
  {path:'attendance',component:AttendanceComponent},
  {path:'f-academic',component:FAcademicsComponent},
  {path:'manage',component:ManageComponent},
  {path:'callender',component:CallenderComponent},
  {path:'indent_requests',component:IndentreqComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacultyDashboardRoutingModule { }
