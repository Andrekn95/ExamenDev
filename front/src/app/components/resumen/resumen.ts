import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourDataService } from '../../services/tour-data.service';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen.html',
})
export class ResumenComponent {
  formularioCompletado = output<string>();
  private tourService = inject(TourDataService);

  // Tus señales del servicio siguen igual
  huesped = this.tourService.huesped;
  restaurante = this.tourService.restaurante;
  tour = this.tourService.tour;

  guardar() {
    // 🚀 Llamamos al método que envía todo el JSON estructurado a Flask
    this.tourService.guardarRegistroCompleto().subscribe({
      next: (respuesta) => {
        // Si la base de datos responde OK (Status 201)
        alert(`🎉 ${respuesta.message}`);
        
        // Avisamos al componente padre que todo se guardó con éxito
        this.formularioCompletado.emit('Formulario guardado exitosamente');
        
        // Limpiamos los formularios y el localStorage
        this.tourService.limpiarTodo();
      },
      error: (err) => {
        // Por si acaso la base de datos o el backend están apagados localmente
        console.error('Error al conectar con la API:', err);
        alert('❌ Error: No se pudo guardar en la base de datos. Asegúrate de tener Flask y Postgres corriendo.');
      }
    });
  }

  limpiar() {
    this.tourService.limpiarTodo();
  }
}