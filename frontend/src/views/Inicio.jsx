/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, createSearchParams } from "react-router-dom";
import "../styles/Inicio.css";
import { useAuth } from "../contexts/useAuth";
import { useEffect, useState, useCallback, useRef } from "react"; 
import { usePlanta } from "../contexts/usePlanta";
import toast from 'react-hot-toast'; 
import api from "../shared/api";       

export default function Inicio() {
  const { user, fetchUserData, updateUserMunicipio } = useAuth();
  const { filterPlant } = usePlanta();
  const navigate = useNavigate();
  
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  // Usamos useRef para el "seguro" (latch), esto sobrevive a los re-renders de StrictMode
  const locationCheckStarted = useRef(false);

  // --- LÓGICA DE GEOLOCALIZACIÓN (Más robusta) ---

  const handleLocationError = useCallback((error, toastId) => {
    setIsLoadingLocation(false);
    let message = "No pudimos obtener tu ubicación. Por favor, selecciona manualmente.";
    if (error.code === error.PERMISSION_DENIED) {
      message = "Permiso de ubicación denegado. Selecciona manualmente.";
    }
    toast.error(message, { id: toastId, duration: 4000 });
  }, []); 

  const handleLocationSuccess = useCallback(async (position, toastId) => {
    const { latitude, longitude } = position.coords;
    try {
      toast.loading("Ubicación encontrada. Verificando municipio...", { id: toastId });
      
      // 1. Obtenemos NUESTRA lista de municipios PRIMERO
      const municipiosResponse = await api.get("/municipio");
      if (!municipiosResponse.data || municipiosResponse.data.length === 0) {
        throw new Error("No se pudo cargar la lista de municipios desde la base de datos.");
      }
      
      // 2. Creamos un Set (mapa) para búsqueda rápida
      const municipiosMap = new Map();
      municipiosResponse.data.forEach(m => {
        municipiosMap.set(m.name.toLowerCase(), m);
      });

      // 3. Obtenemos los datos de geolocalización
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (!geoResponse.ok) throw new Error("Error al consultar el servicio de ubicación.");
      
      const geoData = await geoResponse.json();
      const address = geoData.address || {};

      // 4. Buscamos una coincidencia en CUALQUIER campo de la dirección
      let matchedMunicipio = null;
      
      // Lista de campos de Nominatim en orden de prioridad
      const fieldsToSearch = ['city', 'town', 'village', 'county', 'state_district', 'suburb', 'state'];
      let foundGeoName = null;
      
      for (const field of fieldsToSearch) {
        const geoName = address[field];
        if (geoName) {
          const cleanGeoName = geoName.replace(/^(Municipio de|Departamento de)\s/i, "").trim().toLowerCase();
          
          if (municipiosMap.has(cleanGeoName)) {
            matchedMunicipio = municipiosMap.get(cleanGeoName);
            foundGeoName = address[field];
            break; 
          }
        }
      }
      
      // 5. Verificamos si encontramos una coincidencia
      if (matchedMunicipio) {
        await updateUserMunicipio(user._id, matchedMunicipio._id);
        toast.success(`¡Ubicación guardada: ${matchedMunicipio.name}!`, { id: toastId, duration: 4000 });
      } else {
        console.error("No se encontró coincidencia. Respuesta de Nominatim:", address);
        throw new Error(`Tu ubicación (${foundGeoName || 'desconocida'}) no coincide con un municipio de nuestra base de datos. Ajusta manualmente.`);
      }
      // --- FIN DE CORRECCIÓN ---

    } catch (error) {
      toast.error(error.message, { id: toastId, duration: 4000 });
    } finally {
      setIsLoadingLocation(false);
    }
  }, [user, updateUserMunicipio]); 
  
  const findUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización. Ajusta tus filtros manualmente.");
      return;
    }
    setIsLoadingLocation(true);
    // Este es el ÚNICO toast.loading que se crea
    const locationToastId = toast.loading("Detectando tu ubicación para personalizar tu experiencia...");
    navigator.geolocation.getCurrentPosition(
      (position) => handleLocationSuccess(position, locationToastId),
      (error) => handleLocationError(error, locationToastId)
    );
  }, [handleLocationSuccess, handleLocationError]);


  // --- useEffect MODIFICADO CON EL "SEGURO" ---
  useEffect(() => {
    // 1. Si el usuario no existe, búscalo.
    if (!user) {
      fetchUserData();
      return;
    }

    // 2. Si el usuario existe, no tiene municipio, Y NO hemos empezado la búsqueda...
    if (user && !user.municipio && !locationCheckStarted.current) {
      // ...entonces activamos el "seguro" y empezamos la búsqueda.
      locationCheckStarted.current = true;
      findUserLocation();
    }
    
  }, [user, fetchUserData, findUserLocation]); 
  // --- FIN useEffect MODIFICADO ---


  const handleContinue = () => {
    if (!user?.municipio) {
      toast.error("Aún no tienes una ubicación. Por favor, ajusta los filtros manualmente.");
      navigate("/preferencias");
      return;
    }
    
    const filter = {
      municipio_id: user.municipio._id,
    };

    filterPlant(filter);
    navigate({
      pathname: "/resultados",
      search: `?${createSearchParams(filter)}`,
    });
  };
  
  // --- Lógica de Renderizado ---
  if (!user || (isLoadingLocation && !user.municipio)) {
    return (
      <main className="main-content">
        <h1>{isLoadingLocation ? "Detectando ubicación..." : "Cargando datos..."}</h1>
        <p className="info-text">Por favor, espera un momento.</p>
      </main>
    );
  }

  const locationText = user.municipio 
    ? <strong>{user.municipio.name}</strong> 
    : <strong style={{ color: '#e74c3c' }}>desconocida (por favor, ajusta los filtros)</strong>;

  const suelo = user.municipio?.tipo_suelo || "No definido";
  const agua = user.municipio?.frecuencia_agua || "No definido";
  const luz = user.municipio?.exposicion_luz || "No definido";

  return (
    <main className="main-content">
      <h1>Recomendación de especies para tu jardín</h1>

      <p className="info-text">
        Basado en tu ubicación {locationText} <br />
        ¿Deseas ajustar los filtros manualmente?
      </p>

      <div className="toggle-buttons">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/preferencias")}
        >
          Sí, ajustar filtros
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleContinue}
          disabled={!user.municipio} 
        >
          No, continuar
        </button>
      </div>

      <form className="reco-form">
        <label htmlFor="suelo">Tipo de suelo</label>
        <input type="text" id="suelo" value={suelo} readOnly />

        <label htmlFor="agua">Disponibilidad de agua</label>
        <input type="text" id="agua" value={agua} readOnly />

        <label htmlFor="luz">Exposición a la luz</label>
        <input type="text" id="luz" value={luz} readOnly />
      </form>
    </main>
  );
}