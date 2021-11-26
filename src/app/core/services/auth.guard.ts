import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService:LoginService, private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.loginService.getUser()){
      return true
    }
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Error',
      text: `No existe una sesión activa, inicie sesión`,
      showConfirmButton: false,
      timer: 2000,
    });
    this.router.navigateByUrl('')
    return false;
  }
}
