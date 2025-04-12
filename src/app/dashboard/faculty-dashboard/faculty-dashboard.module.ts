import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacultyDashboardRoutingModule } from './faculty-dashboard-routing.module';
import { FacultyDashboardComponent } from './faculty-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../faculty-dashboard/F-components/profile/profile.component';
import { CoursesComponent} from '../faculty-dashboard/F-components/courses/courses.component';
import { ExamsComponent } from './F-components/exams/exams.component';
import { FeedbackComponent} from './F-components/feedback/feedback.component';
import { ClassroomComponent } from './F-components/classroom/classroom.component';
import { FormsModule } from '@angular/forms';
import { AttendanceComponent } from './F-components/attendance/attendance.component';
import { FAcademicsComponent } from './F-components/f-academics/f-academics.component';
import { ManageComponent } from './F-components/manage/manage.component';
import { IndentFormComponent } from './F-components/indentform/indentform.component';
import { StockregisterComponent } from './F-components/stockregister/stockregister.component';
import { CallenderComponent } from './F-components/callender/callender.component';
const routes: Routes = [
  { path: '', component: FacultyDashboardComponent  }
];

@NgModule({
  declarations: [
    FacultyDashboardComponent,
    ProfileComponent,
    CoursesComponent,
    ExamsComponent,
    FeedbackComponent,
    ClassroomComponent,
    AttendanceComponent,
    FAcademicsComponent,
    ManageComponent,
    IndentFormComponent,
    StockregisterComponent,
    CallenderComponent,
  ],
  imports: [
    CommonModule,
    FacultyDashboardRoutingModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class FacultyDashboardModule { }
