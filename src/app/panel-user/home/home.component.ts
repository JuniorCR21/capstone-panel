import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario:any;
  day: Date = new Date();
  constructor(private loginService:LoginService) { }

  ngOnInit(): void {
    this.usuario = this.loginService.getUser();
  }

}
