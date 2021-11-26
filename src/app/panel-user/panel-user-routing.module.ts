import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitasComponent } from './citas/citas.component';
import { HomeComponent } from './home/home.component';
import { ResultadosComponent } from './resultados/resultados.component';

const routes: Routes = [{
  path:'',
  children:[
    {
      path:'',
      component:HomeComponent
    },
    {
      path:'citas',
      component: CitasComponent
    },
    {
      path:'resultados',
      component: ResultadosComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelUserRoutingModule { }
