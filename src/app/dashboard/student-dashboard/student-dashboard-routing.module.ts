import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './S-components/profile/profile.component';
import { SCoursesComponent } from './S-components/Scourses/Scourses.component';
import { ClassroomsComponent } from './S-components/classrooms/classrooms.component';
import { CourseRegistrationComponent } from './S-components/courseregistration/courseregistration.component';
import { ExamsComponent } from './S-components/exams/exams.component';
import { FeedbackComponent } from './S-components/feedback/feedback.component';
import { QuizComponent } from './S-components/quiz/quiz.component';
import { RequisitionFormComponent } from './S-components/requisition-form/requisition-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'courses', component: SCoursesComponent },
  { path: 'classrooms', component: ClassroomsComponent },
  { path: 'course-registration', component: CourseRegistrationComponent },
  { path: 'exams', component: ExamsComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'quiz', component: QuizComponent },
  {path:'requist',component:RequisitionFormComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentDashboardRoutingModule { }
