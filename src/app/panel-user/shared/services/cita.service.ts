import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoAtencion } from '../models/tipo-atencion';
import { TipoUsuario } from '../models/tipo-usuario';
import { CitaResponse } from '../models/cita-response';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private url:string = environment.url_dev;
  private httpHeaders = new  HttpHeaders({'Content-Type': 'application/json'});
  constructor(private httpCliente: HttpClient) { }

  getTipoAtencion():Observable<TipoAtencion[]>{
    return this.httpCliente.get<TipoAtencion[]>(`${this.url}/atencion/`, {headers: this.httpHeaders})
  }

  getTipoUsuario():Observable<TipoUsuario[]>{
    return this.httpCliente.get<TipoUsuario[]>(`${this.url}/tusuario/`, {headers: this.httpHeaders})
  }

  getCitasUsuario():Observable<CitaResponse[]>{
    let profile = JSON.parse(localStorage.getItem('profile'));
    let headers = new HttpHeaders()
    headers=headers.append('content-type','application/json');
    headers=headers.append('Authorization', `Bearer ${profile.token}`);
    return this.httpCliente.get<CitaResponse[]>(`${this.url}/citas/${profile.id}`, {headers: headers})
  }

  postCita(cita):Observable<CitaResponse>{
    let profile = JSON.parse(localStorage.getItem('profile'));
    let headers = new HttpHeaders()
    headers=headers.append('content-type','application/json');
    headers=headers.append('Authorization', `Bearer ${profile.token}`);
    return this.httpCliente.post<CitaResponse>(`${this.url}/citas/`, cita, {headers: headers})
  }

}
