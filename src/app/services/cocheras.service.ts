import { inject, Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Cochera } from '../interfaces/conchera';

@Injectable({
  providedIn: 'root'
})
export class CocherasService {
  updateCochera(id: number, fila: Cochera) {
    throw new Error('Method not implemented.');
  }

  auth = inject(AuthService);
  http: any;

  cocheras() {
    return fetch('http://localhost:4000/cocheras', {
      method: 'GET',
      headers: {
        Authorization: "Bearer" + (this.auth.getToken() ?? ''),
      }
    }).then(r => r.json());
   }

   agregarCochera(cochera: Cochera){
    return this.http.post('http://localhost:4000/cocheras', cochera).toPromise();
   }

   eliminarCochera(id: number) {
    return this.http.delete(`http://localhost:4000/cocheras/${id}`).toPromise();
  }

  cambiarDisponibilidadCochera(cochera: Cochera, opcion: string) {
    throw new Error('Method not implemented.');
  }
  
}