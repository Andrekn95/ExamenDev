import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HuespedComponent } from './components/huesped/huesped';
import { RestauranteComponent } from './components/restaurante/restaurante';
import { TourComponent } from './components/tour/tour';
import { ResumenComponent } from './components/resumen/resumen';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HuespedComponent,
    RestauranteComponent,
    TourComponent,
    ResumenComponent
  ],
  templateUrl: './app.html',
})
export class App {

  pantallaActual = signal<
    'huesped' |
    'restaurante' |
    'tour' |
    'resumen'
  >('huesped');

  tituloAplicacion = signal('Reserva tu Aventura Amazónica');

  cambiarPantalla(
    pantalla: 'huesped' | 'restaurante' | 'tour' | 'resumen'
  ) {
    this.pantallaActual.set(pantalla);
  }

  // Eventos recibidos desde hijos (Output)
recibirEvento(evento: string) {
  if (this.pantallaActual() === 'huesped') {
    this.cambiarPantalla('restaurante');
  } else if (this.pantallaActual() === 'restaurante') {
    this.cambiarPantalla('tour');
  } else if (this.pantallaActual() === 'tour') {  
    this.cambiarPantalla('resumen');
  }
}
}