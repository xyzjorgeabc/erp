import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService, User } from './services/login/login.service';
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
    if (token) {
      this.loginService.token_handshake(token)
      .subscribe((resp: User) => {
        localStorage.setItem('user', JSON.stringify(resp));
        this.router.navigate(['/main']);
      }, (err: HttpErrorResponse) => {
        if (err.status === 500) {
          alert('error al connectar con el backend \n' + err.message);
        } else if (err.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
