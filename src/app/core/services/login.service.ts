import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/app/shared/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url:string = environment.url_dev;
  private httpHeaders = new  HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpCliente: HttpClient) { }

  postLogin(user:Usuario):Observable<any>{
    return this.httpCliente.post<any>(`${this.url}/user/login`, user, {headers: this.httpHeaders});
  }

  saveLogin(profile){
    localStorage.removeItem('profile');
    localStorage.setItem('profile',JSON.stringify(profile));
  }

  getUser(){
    let user = JSON.parse(localStorage.getItem('profile'));
    return user;
  }
}
