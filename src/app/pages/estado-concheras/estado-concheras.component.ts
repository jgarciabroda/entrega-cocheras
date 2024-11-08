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
            deshabilitada: !estacionamiento,  // Si hay estacionamiento activo, la cochera está ocupada
            activo: estacionamiento,
            patente: estacionamiento ? estacionamiento.patente : undefined,
            fechaIngreso: estacionamiento ? new Date(estacionamiento.horaIngreso).toLocaleDateString() : undefined,
            horaIngreso: estacionamiento ? new Date(estacionamiento.horaIngreso).toLocaleTimeString() : undefined,
          });
        })
      }
    })
  }
  
  agregarFila() {
    console.log('Botón de agregar fila presionado');

    Swal.fire({
      title: 'Ingrese el nombre de la cochera',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor, ingrese un nombre válido';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const now = new Date ();
        const nuevaFila: Cochera = {
          id: this.siguienteNumero,
                descripcion: result.value,
                patente: '',
                deshabilitada: false,
                eliminada: false,
                activo: null,
                fechaIngreso: now.toLocaleDateString(), 
                horaIngreso: now.toLocaleTimeString(),   
        };
        this.filas.push(nuevaFila);
        this.siguienteNumero += 1;
        
        Swal.fire('Fila agregada', 'La cochera ha sido registrada con éxito.', 'success');
      }
    });
  }
  
  eliminarFila(id: number) {
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
        this.filas = this.filas.filter(fila => fila.id !== id);
        Swal.fire('Eliminado', 'La fila ha sido eliminada.', 'success');
      }
    });
  }
  

  cambiarDisponibilidadCochera(fila: Cochera) {
    const now = new Date();
    
    if (fila.deshabilitada) {

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
          console.log("Ingresando patente: ", result.value);
          this.estacionamientos.estacionarAuto(result.value, fila.id).then(() => {
            fila.patente = result.value;
            fila.deshabilitada = false;
            fila.fechaIngreso = now.toLocaleDateString();
            fila.horaIngreso = now.toLocaleTimeString();
            Swal.fire('Patente registrada', 'La cochera ahora está ocupada.', 'success');
          }).catch(error => {
            console.error("Error al ocupar la cochera:", error);
            Swal.fire("Error", "Hubo un problema al ocupar la cochera en el sistema.", "error");
          });
        }
      });
    } else {
      
      this.estacionamientos.liberarCochera(fila.id).then(() => {
        fila.deshabilitada = true;
        fila.patente = undefined;
        fila.fechaDeshabilitado = now.toLocaleDateString();
        fila.horaDeshabilitado = now.toLocaleTimeString();
        Swal.fire('Cochera liberada', 'La cochera ahora está disponible.', 'success');
      }).catch((error: any) => {
        console.error("Error al liberar la cochera", error);
        Swal.fire("Error", "Hubo un problema al liberar la cochera en el sistema.", "error");
      });
    }
  }

  cobrarEstacionamiento(idCochera: number) {
    this.estacionamientos.buscarEstacionamientoActivo(idCochera).then(estacionamiento => {
      if (!estacionamiento) {
        Swal.fire({
          title: "Error",
          text: "No se encontró un estacionamiento activo para la cochera",
          icon: "error"
        });
        return;
      }
  
      const horaIngreso = new Date(estacionamiento.horaIngreso);
      console.log("Hora de ingreso:", horaIngreso);  // Verifica que la fecha esté correctamente asignada

    if (isNaN(horaIngreso.getTime())) {
      // Si la hora de ingreso no es válida, mostramos un error
      Swal.fire({
        title: "Error",
        text: "La hora de ingreso es inválida.",
        icon: "error"
      });
      return;
    }
      const tiempoTranscurridoMs = new Date().getTime() - horaIngreso.getTime();
      const horas = Math.floor(tiempoTranscurridoMs / (1000 * 60 * 60));
      const minutos = Math.floor((tiempoTranscurridoMs % (1000 * 60 * 60)) / (1000 * 60));
      const precio = (tiempoTranscurridoMs / 1000 / 60 / 60); 
  
      Swal.fire({
        title: "Cobrar estacionamiento",
        text: `Tiempo transcurrido: ${horas}hs ${minutos}mins - Precio: $${precio.toFixed(2)}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#00c98d",
        cancelButtonColor: "#d33",
        confirmButtonText: "Cobrar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.estacionamientos.cobrarEstacionamiento(idCochera, estacionamiento.patente, precio).then(() => {
            Swal.fire("Estacionamiento cobrado", "El estacionamiento ha sido cobrado correctamente.", "success");
            this.traerCocheras();
          }).catch(error => {
            console.error("Error al cobrar el estacionamiento:", error);
            Swal.fire("Error", "Hubo un error al cobrar el estacionamiento.", "error");
          });
        }
      });
    }).catch(error => {
      console.error("Error al buscar el estacionamiento activo:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al buscar el estacionamiento.",
        icon: "error"
      });
    });
  }
}


  
  