import React, { useEffect, useState } from "react";
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
  const [likes, setLikes] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filtrar plantas por término de búsqueda
  const plantasFiltradasPorBusqueda = searchTerm.trim() === ""
    ? filterPlanta?.data
    : filterPlanta?.data?.filter((planta) =>
        planta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        planta.nombre_cientifico.toLowerCase().includes(searchTerm.toLowerCase())
      );

  useEffect(() => {
    if (user === null) {
      fetchUserData();
    }
    filterPlant(filters); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user]); // Añadimos 'user' por si acaso

  // Inicializar likes cuando se cargan las plantas
  useEffect(() => {
    if (filterPlanta?.data?.length > 0) {
      const likesInitial = {};
      const userLikesInitial = {};
      filterPlanta.data.forEach((planta) => {
        likesInitial[planta._id] = planta.likes || 0;
        userLikesInitial[planta._id] = user?.likedPlants?.includes(planta._id) || false;
      });
      setLikes(likesInitial);
      setUserLikes(userLikesInitial);
    }
  }, [filterPlanta?.data, user?.likedPlants]);

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

  const agregarLike = async (plantaId) => {
    if (!user) {
      toast.error("Debes iniciar sesión para dar Me Gusta."); 
      return;
    }

    try {
      const hasLiked = userLikes[plantaId];
      
      if (hasLiked) {
        // Remover like
        try {
          await api.post("/plantas/unlike", {
            userId: user._id,
            plantaId: plantaId,
          });
        } catch (error) {
          console.warn("Endpoint unlike no disponible, actualizando localmente");
        }
        
        setLikes((prev) => ({
          ...prev,
          [plantaId]: Math.max(0, (prev[plantaId] || 0) - 1),
        }));
        setUserLikes((prev) => ({
          ...prev,
          [plantaId]: false,
        }));
        toast.success('Me Gusta removido.');
      } else {
        // Agregar like
        try {
          await api.post("/plantas/like", {
            userId: user._id,
            plantaId: plantaId,
          });
        } catch (error) {
          console.warn("Endpoint like no disponible, actualizando localmente");
        }
        
        setLikes((prev) => ({
          ...prev,
          [plantaId]: (prev[plantaId] || 0) + 1,
        }));
        setUserLikes((prev) => ({
          ...prev,
          [plantaId]: true,
        }));
        toast.success('Me Gusta agregado.');
      }
    } catch (error) {
      console.error("Error al agregar like:", error);
      toast.error("Hubo un problema al dar Me Gusta."); 
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
    <>
      <main className="resultados-main">
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar plantas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <h1>Recomendaciones de Plantas</h1>
        <p className="info-text">
          Estas son las plantas que mejor se adaptan a tus preferencias de jardín.
        </p>

        <div className="plant-grid">
          
          {
            plantasFiltradasPorBusqueda?.length === 0 && (
              <p className="no-results-message">
                No encontramos nada con esa palabra.
              </p>
            )
          }

          {
            plantasFiltradasPorBusqueda?.map((planta) => (
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
                <div className="likes-wrapper">
                  <button
                    className={`btn-like ${userLikes[planta._id] ? 'active' : ''}`}
                    onClick={() => agregarLike(planta._id)}
                  >
                    👍
                  </button>
                  <span className="likes-counter">{likes[planta._id] || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
        <button
        className="boton-flotante-comunidad"
        onClick={() => navigate("/comunidad")}
        title="Ir a Preguntas de la Comunidad"
        aria-label="Acceder a la Comunidad de Preguntas"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </>
  );
}
