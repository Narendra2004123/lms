import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementDashboardRoutingModule } from './management-dashboard-routing.module';
import { ManagementDashboardComponent } from './management-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { ManageUsersComponent } from './M-components/manage-users/manage-users.component';
import { ReportsComponent } from './M-components/reports/reports.component';
import { CourseManagementComponent } from './M-components/course-management/course-management.component';
import { FeedbackComponent } from './M-components/feedback/feedback.component';
import { ProfileComponent } from './M-components/profile/profile.component';

const routes: Routes = [
  { path: '', component: ManagementDashboardComponent  }
];

@NgModule({
  declarations: [
    ManagementDashboardComponent,
    ManageUsersComponent,
    ReportsComponent,
    CourseManagementComponent,
    FeedbackComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ManagementDashboardRoutingModule,
    RouterModule.forChild(routes)

  ]
})
export class ManagementDashboardModule { }
