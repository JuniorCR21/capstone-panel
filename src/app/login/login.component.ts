import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CityService } from 'src/app/shared/services/city.service';
import Swal from 'sweetalert2';
import { Direccion } from '../shared/models/direccion';
import { Profile } from '../shared/models/profile';
import { Usuario } from '../shared/models/usuario';
import { ProfileService } from '../shared/services/profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  modalRef?: BsModalRef;
  departamentos: any = []; departamento:any;
  provincias: any = []; provincia:any;
  distritos: any = []; distrito:any;
  formRegister:FormGroup;
  carga=false;
  genero="";

  constructor(
    private modalService: BsModalService,
    private cityServices: CityService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private profileService:ProfileService,
    private router:Router,
    ) { }

  ngOnInit(): void {
    this.departamentos = this.cityServices.getDepartamentos();
    this.formRegister = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellidoMaterno: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      correo: ['', [Validators.required , Validators.email]],
      celular: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      password: ['', [Validators.required]],
      r_password: ['', [Validators.required]],
    });
  }

  registerUser(){
    if (this.formRegister.invalid == true || this.genero == "") {
      this.toastr.error('Complete los campos requeridos', 'Error', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
      });
    }
    else if(this.formRegister.get('password').value != this.formRegister.get('r_password').value){
      this.toastr.error('Las contraseñas no coinciden', 'Error', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
      });
    }
    else{
      this.carga=true;
      let profile = new Profile();
      let user = new Usuario();
      let dir = new Direccion();
      user.dni = this.formRegister.get('dni').value;
      user.password = this.formRegister.get('password').value;
      dir.direccion = this.formRegister.get('direccion').value;
      dir.departamento = this.departamento;
      dir.provincia = this.provincia;
      dir.distrito = this.distrito;
      profile.usuario = user;
      profile.direccion = dir;
      profile.nombre = this.formRegister.get('nombre').value;
      profile.apellidoMaterno = this.formRegister.get('apellidoMaterno').value;
      profile.apellidoPaterno = this.formRegister.get('apellidoPaterno').value;
      profile.celular = this.formRegister.get('celular').value;
      profile.correo = this.formRegister.get('correo').value;
      profile.fechaNacimiento = this.formRegister.get('fechaNacimiento').value;
      profile.genero = this.genero;
      this.profileService.guardarPerfil(profile).subscribe(
        (userProfile) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Enviado',
            text: `Usuario Creado`,
            showConfirmButton: false,
            timer: 1500,
          });
          this.carga=false;
          this.closeModal();
          this.limpiarCamposRegister();
        },(error) => {
          this.carga=false;
          this.toastr.error('Vuelva a intentar', 'Error', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
          });
        }
      )
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,{id:1 ,class: 'modal-lg' , backdrop:'static'});
  }

  closeModal(){
    this.modalRef?.hide();
  }

  limpiarCamposRegister() {
    this.formRegister.patchValue({
      nombre: '',
      apellidoMaterno: '',
      apellidoPaterno: '',
      dni: '',
      correo: '',
      celular: '',
      fechaNacimiento: '',
      direccion: '',
      password: '',
      r_password: '',
    });
  }

  onSelectGenero(any){
    this.genero = any;
  }

  onSelectDepartamento(any) {
    if (any == '0') {
      this.provincias = [];
      this.distritos = [];
    } else{
      let aux:any[]= this.departamentos;
      aux.filter((p:any) => {
        if(p.id_ubigeo == any){
          this.departamento = p.nombre_ubigeo
        }
      })
      this.provincias = this.cityServices.getProvincias()[any];
    };
  }

  onSelectProvincia(any) {
    let aux:any[] = this.provincias;
    aux.filter((p:any) => {
      if(p.id_ubigeo == any){
        this.provincia = p.nombre_ubigeo
      }
    })
    this.distritos = this.cityServices.getDistritos()[any];
  }

  onSelectDistrito(any){
    let aux:any[] = this.distritos;
    aux.filter((p:any) => {
      if(p.id_ubigeo == any){
        this.distrito = p.nombre_ubigeo
      }
    })
  }

}
