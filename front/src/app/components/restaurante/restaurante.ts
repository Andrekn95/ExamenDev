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
  selector: 'app-restaurante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurante.html',
})
export class RestauranteComponent {

  formularioCompletado = output<string>();
  private tourService = inject(TourDataService);

  huesped = this.tourService.huesped;

  bebidas = ['Café', 'Jugo', 'Gaseosa'];

  protected datos = signal({
    desayuno: '',
    bebidaDesayuno: '',
    almuerzo: '',
    bebidaAlmuerzo: '',
    tieneAlergias: false,
    alergias: ''
  });

  protected restauranteForm = form(
    this.datos,
    (path) => [
      required(path.desayuno),
      required(path.bebidaDesayuno),
      required(path.almuerzo),
      required(path.bebidaAlmuerzo)
    ]
  );

  formValido = computed(() => {
    const valor = this.restauranteForm().value();
    if (!valor.bebidaDesayuno) return false;
    if (!valor.bebidaAlmuerzo) return false;
    if (valor.tieneAlergias && valor.alergias.trim().length === 0) return false;
    return true;
  });

  constructor() {
    const r = this.tourService.restaurante();
    this.datos.set({
      desayuno: r.desayuno,
      bebidaDesayuno: r.bebidaDesayuno?.[0] ?? '',
      almuerzo: r.almuerzo,
      bebidaAlmuerzo: r.bebidaAlmuerzo?.[0] ?? '',
      tieneAlergias: r.tieneAlergias,
      alergias: r.alergias
    });

    effect(() => {
      const valor = this.restauranteForm().value();
      if (this.formValido()) {
        this.tourService.actualizarRestaurante({
          desayuno: valor.desayuno as 'Encebollado' | 'Tigrillo' | 'Continental',
          bebidaDesayuno: [valor.bebidaDesayuno],
          almuerzo: valor.almuerzo as 'Seco de pollo' | 'Churrasco' | 'Tilapia',
          bebidaAlmuerzo: [valor.bebidaAlmuerzo],
          tieneAlergias: valor.tieneAlergias,
          alergias: valor.alergias
        });
      }
    });
  }

  siguiente() {
    if (!this.formValido()) {
      alert('Complete todos los campos requeridos');
      return;
    }
    this.formularioCompletado.emit('Datos del restaurante guardados');
  }
}