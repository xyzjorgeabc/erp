import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginData {
  usuario: string;
  contrasena: string;
  recordarEmail: boolean;
}
export interface RespuestaLoginRequest {
  token: string;
}
export interface RespuestaLoginStatusRequest {
  token_valido: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private static SERVER = 'http://localhost:3000';
  public LogIn: Observable<RespuestaLoginRequest>;
  constructor( private http: HttpClient) {
    this.LogIn = new Observable<RespuestaLoginRequest>();
  }
  public token_handshake(token: string) {
    return this.http.post(
       LoginService.SERVER + '/handshake',
      JSON.stringify({token: token}),
      {headers: new HttpHeaders({'Content-type': 'application/json'}),
      responseType: 'json'});
  }
  public requestLogin(data: LoginData) {
    console.log(JSON.stringify(data));
    return this.http.post(
      LoginService.SERVER + '/login',
      JSON.stringify(data),
      {headers: new HttpHeaders({'Content-type': 'application/json'}),
      });
  }
}
