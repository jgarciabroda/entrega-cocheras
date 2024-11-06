import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/conchera';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';
import { CocherasService } from '../../services/cocheras.service';
import { EstacionamientosService } from '../../services/estacionamientos.service';
import { Estacionamiento } from '../../interfaces/estacionamiento';


@Component({
  selector: 'app-estado-concheras',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './estado-concheras.component.html',
  styleUrls: ['./estado-concheras.component.scss']
})
export class EstadoConcherasComponent {

  titulo = 'Estado de la cochera';
  header:{nro:string, disponibilidad:string, ingreso: string, acciones: string} = {
    nro: 'Nro',
    disponibilidad: 'Disponibilidad',
    ingreso: 'Ingreso',
    acciones: 'Acciones',
  };

  filas: Cochera [] = [];
  siguienteNumero: number = 1;
  estacionamientos = inject(EstacionamientosService)
  auth = inject(AuthService);
  cocheras = inject(CocherasService)

  ngOnInit(){
    this.traerCocheras();
  }

  traerCocheras(){
    return this.cocheras.cocheras().then((cocheras:Cochera[]) =>{
      this.filas = [];

      for (let cochera of cocheras){
        this.estacionamientos.buscarEstacionamientoActivo(cochera.id).then(estacionamiento => {
          this.filas.push({
            ...cochera,
            activo: estacionamiento,
          });
        })
      }
    })
  }
  
  agregarFila() {
    Swal.fire({
      title: 'Ingrese la patente del vehículo',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor, ingrese una patente válida';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const nuevaFila: Cochera = {
          id: this.siguienteNumero,
          descripcion: result.value, 
          deshabilitada: false,
          eliminada: false,
          activo: null,
        };
        this.filas.push(nuevaFila);
        this.siguienteNumero += 1;
        
        Swal.fire('Fila agregada', 'La cochera ha sido registrada con éxito.', 'success');
      }
    });
  }
  
  eliminarFila(numeroFila: number, event: Event) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.filas.splice(numeroFila, 1);
        Swal.fire('Eliminado', 'La fila ha sido eliminada.', 'success');
      }
    });
  }

  cambiarDisponibilidadCochera(numeroFila: number, event: MouseEvent) {
    this.filas[numeroFila].deshabilitada = !this.filas[numeroFila].deshabilitada;
    Swal.fire({
      title: 'Disponibilidad actualizada',
      text: this.filas[numeroFila].deshabilitada ? 'Cochera marcada como disponible.' : 'Cochera marcada como no disponible.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }

  abrirModalNuevoEstacionamiento(idCochera: number) {
    console.log("Abriendo modal cochera", idCochera);
    Swal.fire({
      title: "Ingrese la patente del vehículo",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Ingrese una patente válida";
        }
        return;
      }
    }).then(res => {
      if (res.isConfirmed) {
        console.log("Tengo que estacionar la patente", res.value);
        this.estacionamientos.estacionarAuto(res.value, idCochera).then(() => {
        });
      }
    });
  }
  
}