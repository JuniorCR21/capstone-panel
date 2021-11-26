import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';
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
    canActivate: [AuthGuard],
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
