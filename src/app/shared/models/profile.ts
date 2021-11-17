import { Direccion } from "./direccion";
import { Usuario } from "./usuario";

export class Profile{
  id:number;
  nombre:String;
  apellidoMaterno:String;
  apellidoPaterno:String;
  correo:String;
  celular:String;
  genero:String;
  fechaNacimiento:Date;
  direccion:Direccion;
  usuario:Usuario;
}
