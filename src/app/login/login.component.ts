import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CityService } from 'src/app/shared/services/city.service';
import Swal from 'sweetalert2';
import { LoginService } from '../core/services/login.service';
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
  formlogin:FormGroup;
  carga=false; cargaModal=false;
  genero="";

  constructor(
    private modalService: BsModalService,
    private cityServices: CityService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private profileService:ProfileService,
    private router:Router,
    private loginService: LoginService
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
    this.formlogin = this.formBuilder.group({
      dni: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required]],
    })
  }

  loginUser(){
    if (this.formlogin.invalid == true) {
      this.toastr.error('Complete los campos requeridos', 'Error', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
      });
    }else{
      this.carga = true;
      let user = new Usuario();
      user.dni = this.formlogin.get('dni').value;
      user.password = this.formlogin.get('password').value;
      this.loginService.postLogin(user).subscribe(
        (userProfile) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Sesión Iniciada',
            text: `Bienvenido ${userProfile.nombre} ${userProfile.apellido_paterno} ${userProfile.apellido_materno}`,
            showConfirmButton: false,
            timer: 2000,
          });
          this.loginService.saveLogin(userProfile);
          this.limpiarCamposLogin();
          this.carga = false;
          this.router.navigateByUrl("/panel-usuario")
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

  registerUser(){
    if (this.formRegister.invalid == true || this.genero == "") {
      this.toastr.error('Complete los campos requeridos', 'Error', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
      });
    }
    else if(this.formRegister.get('password').value != this.formRegister.get('r_password').value){
      this.toastr.error('Las contraseñas no coinciden', 'Error', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
      });
    }
    else{
      this.cargaModal=true;
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
            title: 'Registro Completado',
            text: `Bienvenido a la familia ${userProfile.nombre} ${userProfile.apellido_paterno} ${userProfile.apellido_materno}`,
            showConfirmButton: false,
            timer: 2000,
          });
          this.cargaModal=false;
          this.closeModal();
          this.limpiarCamposRegister();
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,{id:1 ,class: 'modal-lg' });
  }

  closeModal(){
    this.modalRef?.hide();
  }

  limpiarCamposLogin() {
    this.formRegister.patchValue({
      dni: '',
      password: '',
    });
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
