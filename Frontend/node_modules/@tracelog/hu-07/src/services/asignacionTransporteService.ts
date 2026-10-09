import { apiRequest } from '@tracelog/api-client';

export type EstadoEnvio = 'Pendiente de recolección' | 'Entregado' | 'Devuelto';

export interface EnvioAsignable {
  numeroGuia: string;
  estadoActual: EstadoEnvio;
}

export interface RutaTransporte {
  id: string;
  nombre: string;
  origen: string;
  destino: string;
}

export interface VehiculoDisponible {
  id: string;
  nombre: string;
  placa: string;
}

export interface AsignacionTransporteInput {
  rutaId: string;
  vehiculoId: string;
}

// Rutas propuestas para el frontend; acordar sus contratos con Spring antes de implementar el backend.
export const asignacionTransporteService = {
  consultarEnvio(numeroGuia: string): Promise<EnvioAsignable> {
    const guia = encodeURIComponent(numeroGuia.trim().toUpperCase());
    return apiRequest<EnvioAsignable>(`/api/envios/${guia}`);
  },

  obtenerRutas(): Promise<RutaTransporte[]> {
    return apiRequest<RutaTransporte[]>('/api/rutas');
  },

  obtenerVehiculosDisponibles(): Promise<VehiculoDisponible[]> {
    return apiRequest<VehiculoDisponible[]>('/api/vehiculos/disponibles');
  },

  asignar(numeroGuia: string, asignacion: AsignacionTransporteInput): Promise<void> {
    const guia = encodeURIComponent(numeroGuia.trim().toUpperCase());
    return apiRequest<void>(`/api/envios/${guia}/asignacion`, {
      method: 'POST',
      body: JSON.stringify(asignacion),
    });
  },
};
