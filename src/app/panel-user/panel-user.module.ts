import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelUserRoutingModule } from './panel-user-routing.module';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { CitasComponent } from './citas/citas.component';
import { CitaService } from './shared/services/cita.service';
import { ResultadosComponent } from './resultados/resultados.component';


@NgModule({
  declarations: [FooterComponent, NavbarComponent, HomeComponent, CitasComponent, ResultadosComponent],
  imports: [
    CommonModule,
    PanelUserRoutingModule
  ],
  providers:[
    CitaService
  ]
})
export class PanelUserModule { }
