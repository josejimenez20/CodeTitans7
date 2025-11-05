import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; 
import "../styles/Resultados.css";
import { usePlanta } from "../contexts/usePlanta";
import { HeartFilledIcon, HeartIcon } from "../components/icons/Icons";
import { useAuth } from "../contexts/useAuth";
import api from "../shared/api";
import toast from 'react-hot-toast'; 

export default function Resultados() {
  const { user, fetchUserData } = useAuth();
  const navigate = useNavigate();
  const { filterPlanta, filterPlant } = usePlanta();
  const [searchParams] = useSearchParams();

  // --- ¡CORRECCIÓN DE LÓGICA! ---
  // El filtro debe leer 'municipio_id' si viene, 
  // o los otros filtros si no.
  const municipioId = searchParams.get("municipio_id");
  
  const filters = municipioId 
    ? { municipio_id: municipioId }
    : {
        frecuencia_agua: searchParams.get("frecuencia_agua") || "",
        tipo_suelo: searchParams.get("tipo_suelo") || "",
        exposicion_luz: searchParams.get("exposicion_luz") || "",
        tamano_espacio: searchParams.get("tamano_espacio") || "",
      };
  // --- FIN DE CORRECCIÓN ---

  useEffect(() => {
    if (user === null) {
      fetchUserData();
    }
    filterPlant(filters); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user]); // Añadimos 'user' por si acaso


  const agregarFavorito = async (plantaId) => {
    if (!user) {
      toast.error("Debes iniciar sesión para agregar favoritos."); 
      return;
    }
    
    try {
      const response = await api.post("/favoritas", {
        userId: user._id,
        plantaId: plantaId,
      });
      if (response) {
        if (response.data.message === 'La planta ya está en favoritos') {
          toast('Esta planta ya estaba en tus favoritos.'); 
        } else {
          toast.success('Añadida a favoritos.'); 
        }
        fetchUserData();
      } else {
        toast.error("No se pudo agregar a favoritos."); 
      }
    } catch (error) {
      console.error("Error al agregar favorito:", error);
      toast.error("Hubo un problema al agregar a favoritos."); 
    }
  };

  const isFavorito = (plantaId) => {
    for (let i = 0; i < user?.favorites?.length; i++) {
      if (user.favorites[i]._id === plantaId) {
        return true;
      }
    }
    return false;
  };
  const verDetalle = (plantaId) => {
    navigate(`/planta/${plantaId}`);
  };

  return (
    <main className="resultados-main">
      <h1>Recomendaciones de Plantas</h1>
      <p className="info-text">
        Estas son las plantas que mejor se adaptan a tus preferencias de jardín.
      </p>

      <div className="plant-grid">
        
        {
          filterPlanta?.data?.length === 0 && (
            <p>No se encontraron plantas que coincidan con los filtros seleccionados.</p>
          )
        }

        {
          filterPlanta?.data?.map((planta) => (
          <div className="plant-card" key={planta._id}>
            <div 
              className="plant-image" 
              onClick={() => verDetalle(planta._id)}
              style={{ cursor: "pointer" }}
            >
              <img
                // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
                src={planta.imagen?.url || "/default-avatar.png"}
                alt={planta.nombre}
                width="300"
                height="160"
              />
            </div>
            <div className="plant-info" onClick={() => verDetalle(planta._id)} style={{ cursor: "pointer" }}>
              <div className="plant-name">{planta.nombre}</div>
              <div className="plant-scientific">
                <em>{planta.nombre_cientifico}</em>
              </div>
              <div className="plant-tags">
                <span className="plant-tag">{planta.exposicion_luz}</span>
                <span className="plant-tag">{planta.tipo_suelo}</span>
                <span className="plant-tag">{planta.frecuencia_agua} agua</span>
              </div>
            </div>
            <div className="favorito-wrapper">
              <button
                className="btn-favorito"
                  onClick={() => {
                    agregarFavorito(planta._id)
                  }}
                >
                  {
                    isFavorito(planta._id) ? <HeartFilledIcon size={32} /> : <HeartIcon size={32} />
                  }
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}