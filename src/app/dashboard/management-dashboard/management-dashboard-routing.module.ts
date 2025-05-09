import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUsersComponent } from './M-components/manage-users/manage-users.component';
import { ReportsComponent } from './M-components/reports/reports.component';
import { CourseManagementComponent } from './M-components/course-management/course-management.component';
import { FeedbackComponent } from './M-components/feedback/feedback.component';
import { MprofileComponent } from './M-components/mprofile/mprofile.component';
import { RequestlistComponent } from './M-components/requestlist/requestlist.component';
import { IndentformComponent } from './M-components/indentform/indentform.component';
import { StockregisterComponent } from './M-components/stockregister/stockregister.component';
import { List11Component } from './M-components/list11/list11.component';

const routes: Routes = [
  { path: '', redirectTo: 'manage-users', pathMatch: 'full' },
  { path: 'manage-users', component: ManageUsersComponent },
  {path:'mprofile',component:MprofileComponent},
  { path: 'reports', component: ReportsComponent },
  { path: 'course-management', component: CourseManagementComponent },
  { path: 'feedback', component: FeedbackComponent },
  {path:'requisitionform',component:RequestlistComponent},
  {path:'indentform',component:IndentformComponent},
  {path:'stock-register',component:StockregisterComponent},
  {path:'list11',component:List11Component},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementDashboardRoutingModule { }
