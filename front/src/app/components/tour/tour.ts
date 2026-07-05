import {
  Component,
  inject,
  output,
  signal,
  computed,
  effect
} from '@angular/core';
import {
  FormField,
  form,
  required
} from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { TourDataService } from '../../services/tour-data.service';

@Component({
  selector: 'app-tour',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './tour.html',
})
export class TourComponent {

  formularioCompletado = output<string>();
  private tourService = inject(TourDataService);

  huesped = this.tourService.huesped;
  restaurante = this.tourService.restaurante;

  protected datos = signal({
    actividad: 'caminata',
    alojamiento: 'eco_lodge',
    aceptaCompromiso: false
  });

  protected tourForm = form(
    this.datos,
    (path) => [
      required(path.actividad),
      required(path.alojamiento),
    ]
  );

  formValido = computed(() => {
    const valor = this.tourForm().value();
    if (!valor.actividad) return false;
    if (!valor.alojamiento) return false;
    if (!valor.aceptaCompromiso) return false;
    return true;
  });

  constructor() {
    const t = this.tourService.tour();
    this.datos.set({
      actividad: t.actividad,
      alojamiento: t.alojamiento,
      aceptaCompromiso: t.aceptaCompromiso
    });

    effect(() => {
      const valor = this.tourForm().value();
      if (this.formValido()) {
        this.tourService.actualizarTour({
          actividad: valor.actividad as 'caminata' | 'kayak' | 'inmersion_cultural',
          alojamiento: valor.alojamiento as 'Eco Lodge' | 'Camping' | 'Cabaña',
          aceptaCompromiso: valor.aceptaCompromiso
        });
      }
    });
  }

  siguiente() {
    if (!this.formValido()) {
      alert('Complete todos los campos requeridos');
      return;
    }
    this.formularioCompletado.emit('Datos del tour guardados');
  }
}