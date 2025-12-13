import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ComunidadPreguntas.css";

export default function ComunidadPreguntas() {
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([
    {
      id: 1,
      titulo: "¿Cuál es la mejor planta para interior con poca luz?",
      autor: "María García",
      fecha: "3 días atrás",
      respuestas: 5,
      vistas: 128,
      extracto: "Tengo un apartamento con muy poca luz natural. ¿Qué plantas me recomiendas que puedan vivir en estas condiciones?",
      tags: ["interior", "poca-luz"]
    },
    {
      id: 2,
      titulo: "¿Cómo riego correctamente mis suculentas?",
      autor: "Carlos López",
      fecha: "1 semana atrás",
      respuestas: 8,
      vistas: 245,
      extracto: "He estado matando mis suculentas por riego excesivo. ¿Cuál es la frecuencia correcta de riego?",
      tags: ["suculentas", "riego"]
    },
    {
      id: 3,
      titulo: "¿Qué plantas son tóxicas para las mascotas?",
      autor: "Ana Rodríguez",
      fecha: "2 semanas atrás",
      respuestas: 12,
      vistas: 456,
      extracto: "Tengo gatos y perros en casa. Necesito saber qué plantas debo evitar para mantenerlos seguros.",
      tags: ["seguridad", "mascotas"]
    },
    {
      id: 4,
      titulo: "¿Cómo hacer que mi orquídea vuelva a florecer?",
      autor: "Pedro Martínez",
      fecha: "3 semanas atrás",
      respuestas: 6,
      vistas: 189,
      extracto: "Mi orquídea dejó de florecer hace varios meses. ¿Hay algún truco para estimular nuevas flores?",
      tags: ["orquídeas", "flores"]
    },
    {
      id: 5,
      titulo: "¿Cuál es el mejor fertilizante para plantas de interior?",
      autor: "Laura Fernández",
      fecha: "1 mes atrás",
      respuestas: 7,
      vistas: 312,
      extracto: "Quiero fertilizar mis plantas de interior pero no sé cuál es el mejor producto. ¿Casero o comercial?",
      tags: ["fertilizante", "nutrientes"]
    },
    {
      id: 6,
      titulo: "¿Cómo identificar y tratar plagas en plantas?",
      autor: "Roberto Sánchez",
      fecha: "1 mes atrás",
      respuestas: 10,
      vistas: 523,
      extracto: "He notado manchas extrañas en mis plantas. ¿Cómo puedo saber si es una plaga y cómo tratarla?",
      tags: ["plagas", "tratamiento"]
    }
  ]);

  const [filtroTag, setFiltroTag] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const preguntasFiltradas = preguntas.filter(pregunta => {
    const cumpleBusqueda = pregunta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                          pregunta.extracto.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleTag = !filtroTag || pregunta.tags.includes(filtroTag);
    return cumpleBusqueda && cumpleTag;
  });

  const obtenerTags = () => {
    const tags = new Set();
    preguntas.forEach(p => p.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  };

  const irADetalle = (id) => {
    navigate(`/pregunta/${id}`);
  };

  const abrirNuevaPregunta = () => {
    navigate("/Nuevapregunta");
  
  };

  return (
    <div className="comunidad-wrapper">
      <div className="comunidad-header">
        <h1 className="comunidad-titulo">Preguntas de la Comunidad</h1>
        <p className="comunidad-subtitulo">
          Comparte tus dudas sobre plantas y aprende de otros jardineros
        </p>
      </div>

      <div className="comunidad-container">
        {/* Sidebar de Filtros */}
        <aside className="comunidad-sidebar">
          <div className="filtro-section">
            <h3 className="filtro-titulo">Filtrar por tema</h3>
            <div className="filtro-tags">
              <button
                className={`filtro-tag ${!filtroTag ? "active" : ""}`}
                onClick={() => setFiltroTag(null)}
              >
                Todos
              </button>
              {obtenerTags().map((tag) => (
                <button
                  key={tag}
                  className={`filtro-tag ${filtroTag === tag ? "active" : ""}`}
                  onClick={() => setFiltroTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-nueva-pregunta"
            onClick={abrirNuevaPregunta}
          >
            + Hacer una nueva pregunta
          </button>
        </aside>

        {/* Área Principal */}
        <main className="comunidad-main">
          {/* Barra de Búsqueda */}
          <div className="comunidad-search">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar preguntas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Lista de Preguntas */}
          <div className="preguntas-list">
            {preguntasFiltradas.length > 0 ? (
              preguntasFiltradas.map((pregunta) => (
                <article
                  key={pregunta.id}
                  className="pregunta-card"
                  onClick={() => irADetalle(pregunta.id)}
                >
                  <div className="pregunta-contenido">
                    <h2 className="pregunta-titulo">{pregunta.titulo}</h2>
                    <p className="pregunta-extracto">{pregunta.extracto}</p>

                    <div className="pregunta-tags">
                      {pregunta.tags.map((tag) => (
                        <span key={tag} className="pregunta-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pregunta-metadata">
                    <div className="pregunta-info">
                      <span className="info-item">
                        <strong>{pregunta.respuestas}</strong> respuestas
                      </span>
                      <span className="info-item">
                        <strong>{pregunta.vistas}</strong> vistas
                      </span>
                    </div>

                    <div className="pregunta-autor">
                      <p className="autor-nombre">{pregunta.autor}</p>
                      <p className="autor-fecha">{pregunta.fecha}</p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="no-resultados">
                <p>No se encontraron preguntas que coincidan con tu búsqueda.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
