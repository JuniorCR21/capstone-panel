import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Profile } from '../models/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private url:string = environment.url_dev;
  private httpHeaders = new  HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpCliente: HttpClient) { }

  guardarPerfil(profile:Profile):Observable<any>{
    return this.httpCliente.post<any>(`${this.url}/profile/`, profile, {headers: this.httpHeaders});
  }
}
