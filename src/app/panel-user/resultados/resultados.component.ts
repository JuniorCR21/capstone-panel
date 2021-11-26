import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CitaResponse } from '../shared/models/cita-response';
import { CitaService } from '../shared/services/cita.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {

  day: Date = new Date();
  carga=false;
  citas:CitaResponse[];
  constructor(private citaService:CitaService, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.listarCitas();
  }

  listarCitas(){
    this.carga=true;
    this.citaService.getCitasAtendidas().subscribe(
      response => {
        this.citas = response;
        this.carga = false;
      },(error) => {
        this.carga = false;
        this.toastr.error('Vuelva a intentar', 'Error', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing',
        });
      }
    )
  }

}
