import { Component, OnInit } from '@angular/core';
import { LoginService, RespuestaLoginRequest, RespuestaLoginStatusRequest} from '../services/login/login.service';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.css'],
})
export class LoginCardComponent implements OnInit {

  loginForm = new FormGroup({
    usuario:  new FormControl('', {
      updateOn: 'blur',
    }),
    contrasena: new FormControl('', {
      updateOn: 'blur',
    }),
    recordarEmail: new FormControl('', {
      updateOn: 'submit'
    })
  });
  constructor(private router: Router, private loginService: LoginService) {
  }
  ngOnInit() {
  }
  public loginRequest(e: Event): void {
    const c = this.loginForm.controls;
    if (this.loginForm.pristine || this.loginForm.invalid) {
      return;
    }
    const loginData = {
      usuario:       c.usuario.value ,
      contrasena:    c.contrasena.value,
      recordarEmail: !!c.recordarEmail.value
    };

    this.loginService.requestLogin(loginData)
    .subscribe((resp: RespuestaLoginRequest) => {
      if (resp.token.length) {
        localStorage.setItem('token', resp.token);
        this.router.navigate(['/main']);
      }
    });
  }
}
