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
      method: 'POST',
      headers: {
        authorization: "Bearer " + (this.auth.getToken() ?? ''),
        "content-type":"application/json"
      },
      body: JSON.stringify({
        patente: patenteAuto,
        idCochera: idCochera,
        idUsaarioIngreso: "admin"
      })
    }).then(r=>r.json())
  }

  cobrarEstacionamiento(idCochera: number, patente: string, precio: number) {
    return fetch(`http://localhost:4000/cocheras/${idCochera}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth.getToken(),
      },
      body: JSON.stringify({
        idCochera: idCochera,
        patente: patente,
        precio: precio
      })
    }).then(response => response.json())
      .then(data => {
        return data;
      }).catch(error => {
        console.error('Error al cobrar el estacionamiento:', error);
        throw error;
      });
  }

  liberarCochera(idCochera: number) {
    return fetch ('http://localhost:4000/estacionamientos/cerrar', {
      method: 'PATCH',
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + (this.auth.getToken() ?? ""),
      
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