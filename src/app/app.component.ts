import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from './main/breadcrumb/breadcrumb.component';
import { MenuComponent } from './main/menu/menu.component';
import { Router } from '@angular/router';
import { LoginService, RespuestaLoginStatusRequest } from './services/login/login.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private app = 'SBRP';
  constructor(private router: Router, private loginService: LoginService) {

  }
  ngOnInit() {
    const token = localStorage.getItem('token');
    this.router.navigate(['/main']);
    return;
    if (token) {
      this.loginService.token_handshake(token)
      .subscribe((resp: RespuestaLoginStatusRequest) => {
        if (resp.token_valido) {
          this.router.navigate(['/main']);
        } else {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      }, (err: HttpErrorResponse) => { alert('error al connectar con el backend \n' + err.message); });
    } else {
      this.router.navigate(['/login']);
    }
  }

}
