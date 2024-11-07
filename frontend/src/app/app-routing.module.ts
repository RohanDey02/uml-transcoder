import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UmlDiagramComponent } from './pages/uml-diagram/uml-diagram.component';

const routes: Routes = [
  {
    path: '',
    component: UmlDiagramComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
