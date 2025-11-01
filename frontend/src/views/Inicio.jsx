/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, createSearchParams } from "react-router-dom";
import "../styles/Inicio.css";
import { useAuth } from "../contexts/useAuth";
import { useEffect, useState, useCallback } from "react"; // <-- IMPORTANTE: Importar useCallback
import { usePlanta } from "../contexts/usePlanta";
import toast from 'react-hot-toast';
import api from "../shared/api";

export default function Inicio() {
  const { user, fetchUserData, updateUserMunicipio } = useAuth();
  const { filterPlant } = usePlanta();
  const navigate = useNavigate();
  
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  // --- INICIO DE LA CORRECCIÓN ---
  // 1. Añadimos el "seguro" (latch) para evitar el bucle
  const [locationCheckStarted, setLocationCheckStarted] = useState(false);
  // --- FIN DE LA CORRECCIÓN ---


  // --- LÓGICA DE GEOLOCALIZACIÓN ---
  // (Envolvemos las funciones en useCallback para estabilizarlas)

  const handleLocationError = useCallback((error, toastId) => {
    setIsLoadingLocation(false);
    let message = "No pudimos obtener tu ubicación. Por favor, selecciona manualmente.";
    if (error.code === error.PERMISSION_DENIED) {
      message = "Permiso de ubicación denegado. Selecciona manualmente.";
    }
    // Solo actualiza el toast de "cargando", no crea uno nuevo
    toast.error(message, { id: toastId, duration: 4000 });
  }, []); // Sin dependencias

  const handleLocationSuccess = useCallback(async (position, toastId) => {
    const { latitude, longitude } = position.coords;
    try {
      toast.loading("Ubicación encontrada. Verificando municipio...", { id: toastId });
      
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (!geoResponse.ok) throw new Error("Error al consultar el servicio de ubicación.");
      
      const geoData = await geoResponse.json();
      const geoMunicipioName = geoData.address.city || geoData.address.town || geoData.address.village;

      if (!geoMunicipioName) {
        throw new Error("No se pudo determinar un municipio desde tu ubicación.");
      }

      const municipiosResponse = await api.get("/municipio");
      const matchedMunicipio = municipiosResponse.data.find(
        (m) => m.name.toLowerCase() === geoMunicipioName.toLowerCase()
      );

      if (matchedMunicipio) {
        // user._id está disponible porque este 'handler' solo se llama si 'user' existe
        await updateUserMunicipio(user._id, matchedMunicipio._id);
        toast.success(`¡Ubicación guardada: ${matchedMunicipio.name}!`, { id: toastId, duration: 4000 });
        // fetchUserData() se llama automáticamente desde updateUserMunicipio en el contexto
      } else {
        throw new Error(`Tu ubicación (${geoMunicipioName}) no está en nuestra base de datos. Ajusta manualmente.`);
      }

    } catch (error) {
      // Actualiza el toast de "cargando" con el mensaje de error
      toast.error(error.message, { id: toastId, duration: 4000 });
    } finally {
      setIsLoadingLocation(false);
    }
  }, [user, updateUserMunicipio]); // Depende de estas props/contexto

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

  // --- FIN LÓGICA DE GEOLOCALIZACIÓN ---


  // --- useEffect MODIFICADO CON EL "SEGURO" ---
  useEffect(() => {
    // 1. Si el usuario no existe, búscalo.
    if (!user) {
      fetchUserData();
      return;
    }

    // 2. Si el usuario existe, no tiene municipio, Y NO hemos empezado la búsqueda...
    if (user && !user.municipio && !locationCheckStarted) {
      // ...entonces activamos el "seguro" y empezamos la búsqueda.
      setLocationCheckStarted(true);
      findUserLocation();
    }
    
    // 3. El 'eslint-disable' es necesario porque 'fetchUserData' y 'findUserLocation'
    // no están envueltas en useCallback en su origen (AuthContext) o aquí,
    // pero nuestro "seguro" (locationCheckStarted) previene el bucle.
  }, [user, locationCheckStarted]); 
  // --- FIN useEffect MODIFICADO ---


  const handleContinue = () => {
    if (!user?.municipio) {
      toast.error("Aún no tienes una ubicación. Por favor, ajusta los filtros manualmente.");
      navigate("/preferencias");
      return;
    }
    
    const filter = {
      tipo_suelo: user.municipio.tipo_suelo || "",
      frecuencia_agua: user.municipio.frecuencia_agua || "",
      exposicion_luz: user.municipio.exposicion_luz || "",
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