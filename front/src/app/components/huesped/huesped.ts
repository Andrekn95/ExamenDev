import {  Component,input,output,inject,signal,effect} from '@angular/core';
import { FormField, form, required, pattern } from '@angular/forms/signals';


import { TourDataService } from '../../services/tour-data.service';


@Component({
  selector: 'app-huesped',
  standalone: true,
  templateUrl: './huesped.html',
  imports: [FormField]
})
export class HuespedComponent {

  titulo = input('');
  formularioCompletado = output<string>();
  private tourService = inject(TourDataService);

  protected datos = signal({
    nombreCompleto: '',
    telefono: '',
    correo: '',
    acompanantes: '2'
  });

  protected huespedForm = form(this.datos, (path) => [
    required(path.nombreCompleto),
    pattern(path.nombreCompleto, /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,30}$/),
    required(path.telefono),
    pattern(path.telefono, /^09\d{8}$/),
    required(path.correo),
    pattern(path.correo, /^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  ]);

  constructor() {
  
    const h = this.tourService.huesped();
    if (h.nombreCompleto) {
      this.datos.set({
        nombreCompleto: h.nombreCompleto,
        telefono: h.telefono,
        correo: h.correo,
        acompanantes: String(h.acompanantes)
      });
    }

    // Guardar automáticamente al  cuando el form cambie y sea válido
    effect(() => {
      const valor = this.huespedForm().value();
      if (this.huespedForm().valid()) {
        this.tourService.actualizarHuesped({
          nombreCompleto: valor.nombreCompleto,
          telefono: valor.telefono,
          correo: valor.correo,
          acompanantes: Number(valor.acompanantes),
        });
      }
    });
  }

  siguiente() {
    if (!this.huespedForm().valid()) {
      alert('Revise los datos ingresados');
      return;
    }
    this.formularioCompletado.emit('Datos del huésped guardados');
  }
}