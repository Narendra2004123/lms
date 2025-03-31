import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUsersComponent } from './M-components/manage-users/manage-users.component';
import { ReportsComponent } from './M-components/reports/reports.component';
import { CourseManagementComponent } from './M-components/course-management/course-management.component';
import { FeedbackComponent } from './M-components/feedback/feedback.component';

const routes: Routes = [
  { path: '', redirectTo: 'manage-users', pathMatch: 'full' },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'course-management', component: CourseManagementComponent },
  { path: 'feedback', component: FeedbackComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementDashboardRoutingModule { }
