import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../faculty-dashboard/F-components/profile/profile.component';
import { CoursesComponent} from '../faculty-dashboard/F-components/courses/courses.component';
import { ScheduleComponent} from './F-components/schedule/schedule.component';
import { ExamsComponent } from './F-components/exams/exams.component';
import { FeedbackComponent} from './F-components/feedback/feedback.component';
import { ClassroomComponent } from './F-components/classroom/classroom.component';
import { IndentformComponent } from './F-components/indentform/indentform.component';
import { PurchaseComponent } from './F-components/purchase/purchase.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'exams', component: ExamsComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'classroom', component: ClassroomComponent },
  {path: 'indent',component:IndentformComponent},
  {path:'purchase',component:PurchaseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacultyDashboardRoutingModule { }
