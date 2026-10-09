import { useEffect, useState, type FormEvent } from 'react';
import {
  asignacionTransporteService,
  type EstadoEnvio,
  type RutaTransporte,
  type VehiculoDisponible,
} from '../services/asignacionTransporteService';

export const AsignacionTransporte = () => {
  const [numeroGuia, setNumeroGuia] = useState('');
  const [estadoEnvio, setEstadoEnvio] = useState<EstadoEnvio | null>(null);
  const [rutas, setRutas] = useState<RutaTransporte[]>([]);
  const [vehiculos, setVehiculos] = useState<VehiculoDisponible[]>([]);
  const [ruta, setRuta] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [consultando, setConsultando] = useState(false);
  const [asignando, setAsignando] = useState(false);
  const [errorServicio, setErrorServicio] = useState('');
  const [mostrarError, setMostrarError] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);

  const asignacionBloqueada = estadoEnvio === 'Entregado' || estadoEnvio === 'Devuelto';

  useEffect(() => {
    let activo = true;
    Promise.all([
      asignacionTransporteService.obtenerRutas(),
      asignacionTransporteService.obtenerVehiculosDisponibles(),
    ])
      .then(([rutasDisponibles, vehiculosDisponibles]) => {
        if (!activo) return;
        setRutas(rutasDisponibles);
        setVehiculos(vehiculosDisponibles);
      })
      .catch((error: unknown) => {
        if (activo) setErrorServicio(error instanceof Error ? error.message : 'No se pudieron cargar rutas y vehículos.');
      })
      .finally(() => {
        if (activo) setCargandoCatalogos(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const handleConsultarEnvio = async (event: FormEvent) => {
    event.preventDefault();
    if (!numeroGuia.trim()) return;

    setConsultando(true);
    setErrorServicio('');
    setEstadoEnvio(null);
    try {
      const envio = await asignacionTransporteService.consultarEnvio(numeroGuia);
      setEstadoEnvio(envio.estadoActual);
    } catch (error: unknown) {
      setErrorServicio(error instanceof Error ? error.message : 'No se pudo consultar el envío.');
    } finally {
      setConsultando(false);
    }
  };

  const handleAsignar = async (event: FormEvent) => {
    event.preventDefault();
    setMostrarExito(false);
    setMostrarError(false);

    if (!numeroGuia.trim() || !estadoEnvio || !ruta || !vehiculo) {
      setMostrarError(true);
      return;
    }
    if (asignacionBloqueada) return;

    setAsignando(true);
    setErrorServicio('');
    try {
      await asignacionTransporteService.asignar(numeroGuia, {
        rutaId: ruta,
        vehiculoId: vehiculo,
      });
      setMostrarExito(true);
    } catch (error: unknown) {
      setErrorServicio(error instanceof Error ? error.message : 'No se pudo asignar el transporte.');
    } finally {
      setAsignando(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-white p-8 font-sans">
      <div className="bg-white w-full max-w-2xl p-10 shadow-lg flex flex-col items-center">
        
        <h1 className="text-4xl font-normal text-black mb-4">Asignación de transporte</h1>
        
        <div className="w-full text-left mb-2">
          <p className="text-sm text-gray-800">Detalles del envío:</p>
          <p className="text-sm">
            <span className="text-gray-800">ID: {numeroGuia || 'Sin consultar'} | </span>
            <span className={estadoEnvio ? 'text-green-500' : 'text-gray-500'}>
              Estado: {estadoEnvio ?? 'No consultado'}.
            </span>
          </p>
          <form onSubmit={handleConsultarEnvio} className="mt-4 flex flex-wrap items-end gap-2">
            <label className="text-sm text-black">
              Número de guía
              <input
                value={numeroGuia}
                onChange={(event) => {
                  setNumeroGuia(event.target.value);
                  setEstadoEnvio(null);
                  setMostrarError(false);
                }}
                className="mt-1 block w-full rounded border border-gray-500 px-3 py-2"
                placeholder="Ingrese una guía"
              />
            </label>
            <button type="submit" disabled={consultando || !numeroGuia.trim()} className="rounded border border-black bg-gray-200 px-4 py-2 text-sm disabled:opacity-50">
              {consultando ? 'Consultando...' : 'Consultar envío'}
            </button>
          </form>
        </div>
        
        <hr className="w-full border-gray-400 mb-8" />

        {/* Formulario */}
        <form onSubmit={handleAsignar} className="w-full flex flex-col items-center gap-6">
          
          <div className="w-full max-w-sm flex flex-col items-start">
            <label className="text-sm text-black mb-1">
              Seleccione ruta de transporte:<span className="text-red-600">*</span>
            </label>
            <select 
              value={ruta}
              onChange={(e) => { setRuta(e.target.value); setMostrarError(false); }}
              disabled={asignacionBloqueada || !estadoEnvio || cargandoCatalogos}
              className={`w-full border p-1 text-sm outline-none bg-white 
                ${asignacionBloqueada ? 'text-gray-400 border-gray-300' : 'text-black border-black'} 
                ${mostrarError && !ruta ? 'border-red-600 border-2' : ''}`}
            >
              <option value="">Seleccione una opción...</option>
              {rutas.map((opcionRuta) => (
                <option key={opcionRuta.id} value={opcionRuta.id}>
                  {opcionRuta.nombre}: {opcionRuta.origen} - {opcionRuta.destino}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full max-w-sm flex flex-col items-start">
            <label className="text-sm text-black mb-1">
              Selecciones Vehículo:<span className="text-red-600">*</span>
            </label>
            <select 
              value={vehiculo}
              onChange={(e) => { setVehiculo(e.target.value); setMostrarError(false); }}
              disabled={asignacionBloqueada || !estadoEnvio || cargandoCatalogos}
              className={`w-full border p-1 text-sm outline-none bg-white 
                ${asignacionBloqueada ? 'text-gray-400 border-gray-300' : 'text-black border-black'} 
                ${mostrarError && !vehiculo ? 'border-red-600 border-2' : ''}`}
            >
              <option value="">Seleccione una opción...</option>
              {vehiculos.map((opcionVehiculo) => (
                <option key={opcionVehiculo.id} value={opcionVehiculo.id}>
                  {opcionVehiculo.nombre} - Placa {opcionVehiculo.placa}
                </option>
              ))}
            </select>
            
            {/* Mensaje de Error (CA-07-B) */}
            {mostrarError && (
              <p className="text-red-600 text-[10px] mt-1 text-center w-full">
                *!Debes seleccionar una ruta y un vehículo válidos¡
              </p>
            )}
          </div>

          {/* Mensaje de Bloqueo (CA-07-C) */}
          {asignacionBloqueada && (
            <div className="bg-[#a8b8ff] border border-blue-600 rounded-lg px-4 py-2 mt-2 w-full max-w-sm text-center">
              <p className="text-black text-xs leading-tight">
                El estado actual del envío no permite nuevas<br/>asignaciones
              </p>
            </div>
          )}

          {/* Botón de Acción */}
          <button 
            type="submit" 
            disabled={asignacionBloqueada || cargandoCatalogos || consultando || asignando || !estadoEnvio}
            className={`mt-4 px-6 py-1.5 text-sm border border-black 
              ${asignacionBloqueada ? 'bg-gray-200 text-gray-400 border-gray-300' : 'bg-teal-500 text-black hover:bg-teal-600 cursor-pointer'}`}
          >
            {cargandoCatalogos ? 'Cargando opciones...' : asignando ? 'Asignando...' : 'Asignar Transporte'}
          </button>

          {errorServicio && <p role="alert" className="text-center text-xs text-red-700">{errorServicio}</p>}

          {/* Mensaje de Éxito (CA-07-A) */}
          {mostrarExito && !asignacionBloqueada && (
            <div className="bg-green-500 border border-black rounded-full px-4 py-1 mt-2">
              <p className="text-black text-xs">Envío asignado a la ruta exitosamente</p>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};