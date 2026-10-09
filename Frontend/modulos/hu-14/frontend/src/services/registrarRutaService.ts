import { apiRequest } from '@tracelog/api-client';
import type { CentroDistribucion, RutaTransporte } from '../types/ruta';

export const registrarRutaService = {
  obtenerCentros(): Promise<CentroDistribucion[]> {
    return apiRequest<CentroDistribucion[]>('/api/centros-distribucion');
  },

  // Endpoint propuesto para el frontend; confirmar contrato con Spring.
  registrarRuta(ruta: RutaTransporte): Promise<void> {
    return apiRequest<void>('/api/rutas', {
      method: 'POST',
      body: JSON.stringify(ruta),
    });
  },
};
