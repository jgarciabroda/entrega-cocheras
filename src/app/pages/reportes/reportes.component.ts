import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent {
  filas: { nro: number; mes: string; uso: number; cobranza: number; }[] = [];
  siguienteNumero: number = 1;

  agregarFila() {
    Swal.fire({
      title: 'Ingrese el mes',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor, ingrese un mes válido';
        }
        return null;
      }
    }).then((mesResult) => {
      if (mesResult.isConfirmed && mesResult.value) {
        Swal.fire({
          title: 'Ingrese la cantidad de usos',
          input: 'number',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Por favor, ingrese una cantidad válida';
            }
            return null;
          }
        }).then((usoResult) => {
          if (usoResult.isConfirmed) {
            Swal.fire({
              title: 'Ingrese la cobranza',
              input: 'number',
              showCancelButton: true,
              inputValidator: (value) => {
                if (!value) {
                  return 'Por favor, ingrese una cobranza válida';
                }
                return null;
              }
            }).then((cobranzaResult) => {
              if (cobranzaResult.isConfirmed) {
                const nuevaFila = {
                  nro: this.siguienteNumero++,
                  mes: mesResult.value,
                  uso: usoResult.value,
                  cobranza: cobranzaResult.value
                };
                this.filas.push(nuevaFila);
                Swal.fire('Fila agregada', 'El reporte ha sido registrado con éxito.', 'success');
              }
            });
          }
        });
      }
    });
  }

  eliminarFila(index: number, event: Event) {
    event.stopPropagation();
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
        this.filas.splice(index, 1);
        Swal.fire('Eliminado', 'La fila ha sido eliminada.', 'success');
      }
    });
  }
}
