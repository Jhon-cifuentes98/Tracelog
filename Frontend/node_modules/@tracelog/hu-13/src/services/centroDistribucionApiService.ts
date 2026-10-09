import { apiRequest } from '@tracelog/api-client';
import type {
  CentroDistribucion,
  CentroDistribucionInput,
  RespuestaServicio,
} from '../types';

export const CIUDADES_COLOMBIA: string[] = [
  'Medellín',
  'Bogotá',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Bucaramanga',
  'Pereira',
  'Manizales',
  'Santa Marta',
  'Cúcuta',
  'Ibagué',
  'Pasto',
  'Villavicencio',
  'Armenia',
  'Montería',
  'Valledupar',
  'Neiva',
  'Popayán',
  'Sincelejo',
  'Tunja',
];

const baseUrl = '/api/centros-distribucion';

export const centroDistribucionService = {
  obtenerCentros(): Promise<CentroDistribucion[]> {
    return apiRequest<CentroDistribucion[]>(baseUrl);
  },

  registrarCentro(input: CentroDistribucionInput): Promise<RespuestaServicio<CentroDistribucion>> {
    return apiRequest<RespuestaServicio<CentroDistribucion>>(baseUrl, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  eliminarCentro(id: string): Promise<void> {
    return apiRequest<void>(`${baseUrl}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
