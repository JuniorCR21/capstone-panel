import { Injectable } from '@angular/core';
import listaDepartamentos from '../../../assets/json/departamentos.json';
import listaProvincias from '../../../assets/json/provincias.json';
import listaDistritos from '../../../assets/json/distritos.json';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  lDepartamentos:any = listaDepartamentos;
  lProvincias:any = listaProvincias;
  lDistritos:any = listaDistritos;

  constructor() { }

  getDepartamentos():any[]{
    return this.lDepartamentos;
  }

  getProvincias():any[]{
    return this.lProvincias;
  }

  getDistritos():any[]{
    return this.lDistritos;
  }

}
