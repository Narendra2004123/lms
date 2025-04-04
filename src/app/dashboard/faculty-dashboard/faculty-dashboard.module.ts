import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacultyDashboardRoutingModule } from './faculty-dashboard-routing.module';
import { FacultyDashboardComponent } from './faculty-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../faculty-dashboard/F-components/profile/profile.component';
import { CoursesComponent} from '../faculty-dashboard/F-components/courses/courses.component';
import { ScheduleComponent} from './F-components/schedule/schedule.component';
import { ExamsComponent } from './F-components/exams/exams.component';
import { FeedbackComponent} from './F-components/feedback/feedback.component';
import { ClassroomComponent } from './F-components/classroom/classroom.component';
import { FormsModule } from '@angular/forms';
const routes: Routes = [
  { path: '', component: FacultyDashboardComponent  }
];

@NgModule({
  declarations: [
    FacultyDashboardComponent,
    ProfileComponent,
    CoursesComponent,
    ScheduleComponent,
    ExamsComponent,
    FeedbackComponent,
    ClassroomComponent,
  ],
  imports: [
    CommonModule,
    FacultyDashboardRoutingModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class FacultyDashboardModule { }
