import { inject, Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Cochera } from '../interfaces/conchera';

@Injectable({
  providedIn: 'root'
})
export class CocherasService {
  auth = inject(AuthService);

  // Obtener todas las cocheras
  cocheras() {
    return fetch('http://localhost:4000/cocheras', {
      method: 'GET',
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? ''),
      }
    }).then(r => r.json());
  }

  // Agregar una cochera (POST)
  agregarCochera(cochera: Cochera) {
    const token = this.auth.getToken();
    console.log('Token en agregarCochera:', token);  // Verifica que el token esté presente
    
    return fetch('http://localhost:4000/cocheras', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(cochera)
    }).then(response => response.json());
}


  // Eliminar cochera (DELETE)
  eliminarCochera(id: number) {
    const token = this.auth.getToken();
    console.log('Token en eliminarCochera:', token);  // Verifica que el token esté presente
    
    return fetch(`http://localhost:4000/cocheras/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: "Bearer " + token
      }
    }).then(response => response.json());
}

  
}
