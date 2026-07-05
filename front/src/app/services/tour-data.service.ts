import { Injectable, computed, effect, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Huesped {
  nombreCompleto: string;
  acompanantes: number;
  correo: string;
  telefono: string;
}

export interface Restaurante {
  desayuno: 'Encebollado' | 'Tigrillo' | 'Continental';
  bebidaDesayuno: string[];
  almuerzo: 'Seco de pollo' | 'Churrasco' | 'Tilapia';
  bebidaAlmuerzo: string[];
  tieneAlergias: boolean;
  alergias: string;
}

export interface Tour {
  actividad: 'caminata' | 'kayak' | 'inmersion_cultural';
  alojamiento: 'Eco Lodge' | 'Camping' | 'Cabaña'; // Ojo: mantengo el typo original de tu propiedad si así está en tu front
  aceptaCompromiso: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TourDataService {
  // Inyectamos HttpClient al estilo Angular moderno
  private http = inject(HttpClient);
  
  // URL local de tu backend en Flask (luego en Docker cambiará a rutas relativas)
  private API_URL = 'http://localhost:5000/api';

  huesped = signal<Huesped>({
    nombreCompleto: '',
    acompanantes: 2,
    correo: '',
    telefono: ''
  });

  restaurante = signal<Restaurante>({
    desayuno: 'Encebollado',
    bebidaDesayuno: [],
    almuerzo: 'Seco de pollo',
    bebidaAlmuerzo: [],
    tieneAlergias: false,
    alergias: ''
  });

  tour = signal<Tour>({
    actividad: 'caminata',
    alojamiento: 'Eco Lodge',
    aceptaCompromiso: false
  });

  resumen = computed(() => ({
    huesped: this.huesped(),
    restaurante: this.restaurante(),
    tour: this.tour()
  }));

  constructor() {
    const huespedGuardado = localStorage.getItem('huesped');
    const restauranteGuardado = localStorage.getItem('restaurante');
    const tourGuardado = localStorage.getItem('tour');

    if (huespedGuardado) this.huesped.set(JSON.parse(huespedGuardado));
    if (restauranteGuardado) this.restaurante.set(JSON.parse(restauranteGuardado));
    if (tourGuardado) this.tour.set(JSON.parse(tourGuardado));

    effect(() => {
      localStorage.setItem('huesped', JSON.stringify(this.huesped()));
    });

    effect(() => {
      localStorage.setItem('restaurante', JSON.stringify(this.restaurante()));
    });

    effect(() => {
      localStorage.setItem('tour', JSON.stringify(this.tour()));
    });
  }

  actualizarHuesped(datos: Huesped) {
    this.huesped.set(datos);
  }

  actualizarRestaurante(datos: Restaurante) {
    this.restaurante.set(datos);
  }

  actualizarTour(datos: Tour) {
    this.tour.set(datos);
  }

  // 🚀 NUEVO MÉTODO: Enviar los 3 formularios al Backend y guardar en DB
  guardarRegistroCompleto(): Observable<any> {
    const h = this.huesped();
    const r = this.restaurante();
    const t = this.tour();

    // Mapeamos los objetos al formato snake_case exacto que espera Flask
    const payload = {
      huesped: {
        nombres_completos: h.nombreCompleto,
        telefono: h.telefono,
        correo_electronico: h.correo,
        acompanantes: h.acompanantes
      },
      restaurante: {
        desayuno: r.desayuno,
        bebida_desayuno: r.bebidaDesayuno,
        almuerzo: r.almuerzo,
        bebida_almuerzo: r.bebidaAlmuerzo,
        tiene_alergias: r.tieneAlergias,
        detalle_alergia: r.tieneAlergias ? r.alergias : null
      },
      tour: {
        actividad: t.actividad,
        tipo_alojamiento: t.alojamiento,
        acepta_terminos: t.aceptaCompromiso
      }
    };

    // Enviamos todo junto al backend (usaremos un endpoint unificado en Flask)
    return this.http.post(`${this.API_URL}/registro-completo`, payload);
  }

  limpiarTodo() {
    this.huesped.set({
      nombreCompleto: '',
      acompanantes: 2,
      correo: '',
      telefono: ''
    });

    this.restaurante.set({
      desayuno: 'Encebollado',
      bebidaDesayuno: [],
      almuerzo: 'Seco de pollo',
      bebidaAlmuerzo: [],
      tieneAlergias: false,
      alergias: ''
    });

    this.tour.set({
      actividad: 'caminata',
      alojamiento: 'Eco Lodge',
      aceptaCompromiso: false
    });

    localStorage.removeItem('huesped');
    localStorage.removeItem('restaurante');
    localStorage.removeItem('tour');
  }
}