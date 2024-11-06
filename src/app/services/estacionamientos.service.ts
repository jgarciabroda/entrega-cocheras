import { inject, Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EstacionamientosService {

  auth = inject(AuthService);

  estacionamiento(): Promise<Estacionamiento[]> {
    return fetch('http://localhost:4000/estacionamiento', {
      method: 'GET',
      headers: {
        Authorization: "Bearer" + (this.auth.getToken() ?? ''),
      }
    }).then(r => r.json());
   }

   buscarEstacionamientoActivo(cocheraId:number){
    return this.estacionamiento().then(estacionamientos => {
      let buscado = null;
      for(let estacionamiento of estacionamientos){
        if (estacionamiento.idCochera === cocheraId &&
          estacionamiento.horaEgreso === null) {
        buscado = estacionamiento;
          }
      }
      return buscado;
    });
   }

   estacionarAuto(patenteAuto: string, idCochera: number){
    return fetch('http://localhost:4000/cocheras', {
      method: 'GET',
      headers: {
        authorization: "Bearer" + (this.auth.getToken() ?? ''),
        "content-type":"application/json"
      },
      body: JSON.stringify({
        patente: patenteAuto,
        idCochera: 2 
      })
    }).then(r=>r.json())
  }

  cobrarEstacionamiento(idCochera: number, patente: string, costo: number) {
    return fetch("http://localhost:4000/estacionamientos/cerrar/", {
      method: 'PATCH',
      headers: {
        Authorization: "Bearer " + this.auth.getToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patente: patente,
        idCochera: idCochera,
        costo: costo 
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error(error.message);
        });
      }
      return response.json();
    });
}

liberarCochera(idCochera: number) {
  return fetch ('http://localhost:4000/cocheras/liberar', {
    method: 'POST',
    headers: {
      'content-Type': 'application/json',
      Authorization: 'Bearer ' + (this.auth.getToken()),
    
    body: JSON.stringify({idCochera})
  }}

).then(response => {
  if(response.ok){
    Swal.fire('Cochera liberada', 'La cochera se libero con exito', 'success');
  } else {
    Swal.fire('Error', 'No se pudo liberar la cochera. Intente nuevamente', 'error');
  }
})
}

}