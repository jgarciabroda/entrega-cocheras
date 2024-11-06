import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heade',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './heade-component.component.html',
  styleUrl: './heade-component.component.scss'
})
export class HeadeComponentComponent {
  esAdmin: boolean = false;
  auth = inject(AuthService);
  reselutadoInput: string="";

  abrirModal(){
    Swal.fire({
      title: 'Enter your IP adress',
      input: 'text',
      inputLabel: 'Your IP address',
      inputValue: "",
      showCancelButton: true
    }).then((result)=> {
      this.reselutadoInput = result.value;
    });
  }
}
