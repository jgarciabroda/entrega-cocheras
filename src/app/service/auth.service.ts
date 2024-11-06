import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  estaLogueado(): boolean {
    if (this.getToken())
      return true;
    else
    return false;
  }

  login(datosLogin:Login ){
  return fetch("http://localhost:4000/login", {
    method:"POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datosLogin)
  });
 }
}