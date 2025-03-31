import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { StudentDashboardComponent } from './student-dashboard.component';
import { ProfileComponent } from './S-components/profile/profile.component';
import { SCoursesComponent } from './S-components/Scourses/Scourses.component';
import { ClassroomsComponent } from './S-components/classrooms/classrooms.component';
import { CourseRegistrationComponent } from './S-components/courseregistration/courseregistration.component';
import { ExamsComponent } from './S-components/exams/exams.component';
import { FeedbackComponent } from './S-components/feedback/feedback.component';
import { QuizComponent } from './S-components/quiz/quiz.component';
import { FormsModule } from '@angular/forms';
import { RequisitionFormComponent } from './S-components/requisition-form/requisition-form.component';

const routes: Routes = [
  { path: '', component: StudentDashboardComponent }
];

@NgModule({
  declarations: [
    StudentDashboardComponent,
    ProfileComponent,
    SCoursesComponent,
    ClassroomsComponent,
    CourseRegistrationComponent,
    ExamsComponent,
    FeedbackComponent,
    QuizComponent,
    RequisitionFormComponent,
  ],
  imports: [
    CommonModule,
    StudentDashboardRoutingModule,
    RouterModule.forChild(routes),
    FormsModule
    
  ]
})
export class StudentDashboardModule { }
