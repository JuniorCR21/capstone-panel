import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: ' ', redirectTo:'', pathMatch:"full"
  },
  {
    path:'', component: LoginComponent
  },
  {
    path:'panel-usuario',
    loadChildren: () => import('./panel-user/panel-user.module').then(mod => mod.PanelUserModule)
  },
  {
    path:'**', redirectTo:''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
