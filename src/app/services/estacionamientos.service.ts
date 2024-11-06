import { inject, Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';

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
}

