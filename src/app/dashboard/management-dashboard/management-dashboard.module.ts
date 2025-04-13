import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementDashboardRoutingModule } from './management-dashboard-routing.module';
import { ManagementDashboardComponent } from './management-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { ManageUsersComponent } from './M-components/manage-users/manage-users.component';
import { ReportsComponent } from './M-components/reports/reports.component';
import { CourseManagementComponent } from './M-components/course-management/course-management.component';
import { FeedbackComponent } from './M-components/feedback/feedback.component';
import { MprofileComponent } from './M-components/mprofile/mprofile.component';
import { RequestlistComponent } from './M-components/requestlist/requestlist.component';
import { IndentformComponent } from './M-components/indentform/indentform.component';
import { FormsModule } from '@angular/forms';
import { StockregisterComponent } from './M-components/stockregister/stockregister.component';
import { List11Component } from './M-components/list11/list11.component';

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
    MprofileComponent,
    RequestlistComponent,
    IndentformComponent,
    StockregisterComponent,
    List11Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ManagementDashboardRoutingModule,
    RouterModule.forChild(routes)

  ]
})
export class ManagementDashboardModule { }
