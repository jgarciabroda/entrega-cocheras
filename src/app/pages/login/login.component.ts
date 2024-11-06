import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Login } from '../../interfaces/login';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  datosLogin:Login = {
    username: 'admin',
    password:'admin'
  }

  router= inject(Router)
  auth = inject (AuthService)

  Login(){
    console.log("Login");
    this.auth.login(this.datosLogin)
    .then(res => {
      if(res.ok) {
        this.router.navigate(['/estado-cocheras']);
        res.json().then(resJson => {
          if(resJson.token)  localStorage.setItem('token',resJson.token)
        })
      }else
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Credenciales incorrectas",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
        
      
    });
  }
} 
