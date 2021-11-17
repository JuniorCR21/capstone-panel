import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CitaRequest } from '../shared/models/cita-request';
import { CitaResponse } from '../shared/models/cita-response';
import { TipoAtencion } from '../shared/models/tipo-atencion';
import { TipoUsuario } from '../shared/models/tipo-usuario';
import { CitaService } from '../shared/services/cita.service';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {

  day: Date = new Date();
  modalRef?: BsModalRef;
  lUsuario:TipoUsuario[];
  lAtencion:TipoAtencion[];
  citas:CitaResponse[];
  lCovid:string[] = ["Seleccionar opción","Rápida","Antigena", "Molecular", "Cuantitativa", "Sin prueba COVID"];
  paciente=0;
  tipoAtencion=0;
  covid="";
  carga=false;
  formCita:FormGroup;
  fechaCita:Date = new Date(); date:Date = new Date();
  constructor(private modalService: BsModalService,
              private citaService: CitaService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.carga=true;
    this.formCita = this.formBuilder.group({
      responsable: [''],
      consulta: [''],
    })
    let fecha:Date = new Date();
    this.fechaCita.setDate(fecha.getDate()+1);
    this.listarCitas();
    this.listarTipoAtencion();
    this.listarTipoUsuario();
  }

  listarTipoAtencion(){
    this.citaService.getTipoAtencion().subscribe(
      response => {
        this.lAtencion = response;
      }
    )
  }

  listarTipoUsuario(){
    this.citaService.getTipoUsuario().subscribe(
      response =>{
        this.lUsuario = response;
      }
    )
  }

  listarCitas(){
    this.citaService.getCitasUsuario().subscribe(
      response => {
        this.citas = response;
        this.carga = false;
      }
    )
  }

  registrarCita(){
    if (this.formCita.invalid == true || this.paciente<0  || this.tipoAtencion<0) {
      this.toastr.error('Complete los campos requeridos', 'Error', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
      });
    }else{
      this.carga = true;
      let cita = new CitaRequest();
      let profile = JSON.parse(localStorage.getItem('profile'));
      cita.id_perfil = profile.id;
      cita.comentario = this.formCita.get('consulta').value;
      cita.fecha= this.date;
      cita.id_tipousuario = this.paciente;
      cita.id_tipoatencion= this.tipoAtencion;
      cita.nombre = profile.nombre + profile.apellido_paterno;
      cita.prueba_covid = this.covid;
      cita.responsable = this.formCita.get('responsable').value;
      console.log(cita)
      this.citaService.postCita(cita).subscribe(
        response =>{
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Registrada',
            text: `Cita registrada para ${response.fecha}`,
            showConfirmButton: false,
            timer: 2000,
          });
          this.listarCitas();
          this.closeModal();
          this.carga = false;
          this.limpiarCamposCita();
        },(error) => {
          this.carga=false;
          this.toastr.error('Vuelva a intentar', 'Error', {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: 'increasing',
          });
        }
      )
    }
  }

  limpiarCamposCita() {
    this.formCita.patchValue({
      responsable:'',
      consulta:''
    });
    this.paciente=0;
    this.covid="";
    this.tipoAtencion=0;
  }

  openModal(template: TemplateRef<any>) {
    this.paciente=0;
    this.modalRef = this.modalService.show(template, Object.assign({}, { backdrop: true }));
  }

  closeModal(){
    this.modalRef?.hide();
  }

  capturar(select:any){
    this.paciente= select.target.value;
  }

  capturarAtencion(select:any){
    this.tipoAtencion= select.target.value;
    console.log(this.tipoAtencion)
  }

  capturarCovid(select:any){
    this.covid= select.target.value;
    console.log(this.covid)
  }

  changedDate(e){
    this.date = e.target.value;
    console.log(this.date)
  }
}
