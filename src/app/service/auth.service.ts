import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getToken(): string {
    const token = localStorage.getItem('token') ?? '';
    console.log(token); 
    return token;
  }
  

  estaLogueado(): boolean {
    if (this.getToken())
      return true;
    else
    return false;
  }

  login(datosLogin: Login) {
    return fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosLogin)
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) { // O el campo exacto donde se devuelva el token
        localStorage.setItem('token', data.token); // Guarda el token
      }
      return data;
    });
  }
  
}