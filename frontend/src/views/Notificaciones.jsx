import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Notificaciones.css";

export default function PaginaNotificaciones() {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("todas"); // "todas", "no-leidas", "leidas"

  useEffect(() => {
    obtenerNotificaciones();
    marcarComoLeidas();
  }, []);

  // API: Obtener notificaciones
  const obtenerNotificaciones = async () => {
    setCargando(true);
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await fetch("/api/notificaciones");
      const data = await response.json();
      setNotificaciones(data.notificaciones || []);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      // Datos de ejemplo para desarrollo
      setNotificaciones([
        {
          id: 1,
          usuario: "Carlos López",
          preguntaId: 2,
          preguntaTitulo: "¿Cómo riego correctamente mis suculentas?",
          leida: false,
          fecha: "Hace 5 minutos"
        },
        {
          id: 2,
          usuario: "María García",
          preguntaId: 1,
          preguntaTitulo: "¿Cuál es la mejor planta para interior con poca luz?",
          leida: false,
          fecha: "Hace 1 hora"
        },
        {
          id: 3,
          usuario: "Ana Rodríguez",
          preguntaId: 3,
          preguntaTitulo: "¿Qué plantas son tóxicas para las mascotas?",
          leida: true,
          fecha: "Hace 2 días"
        },
        {
          id: 4,
          usuario: "Pedro Martínez",
          preguntaId: 4,
          preguntaTitulo: "¿Cómo hacer que mi orquídea vuelva a florecer?",
          leida: true,
          fecha: "Hace 3 días"
        },
        {
          id: 5,
          usuario: "Laura Fernández",
          preguntaId: 5,
          preguntaTitulo: "¿Cuál es el mejor fertilizante para plantas de interior?",
          leida: true,
          fecha: "Hace 1 semana"
        }
      ]);
    } finally {
      setCargando(false);
    }
  };

  // API: Marcar todas como leídas
  const marcarComoLeidas = async () => {
    try {
      // TODO: Reemplazar con tu endpoint real
      await fetch("/api/notificaciones/marcar-leidas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error("Error al marcar como leídas:", error);
    }
  };

  // Filtrar notificaciones
  const notificacionesFiltradas = notificaciones.filter((notif) => {
    if (filtro === "no-leidas") return !notif.leida;
    if (filtro === "leidas") return notif.leida;
    return true; // "todas"
  });

  // Ir a la pregunta
  const irAPregunta = (preguntaId) => {
    navigate(`/Detallepregunta/${preguntaId}`);
  };

  return (
    <div className="notificaciones-page-wrapper">
      <div className="notificaciones-page-container">
        {/* Header */}
        <div className="notificaciones-page-header">
          <button
            className="btn-volver"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
          <h1 className="notificaciones-page-titulo">Notificaciones</h1>
        </div>

        {/* Filtros */}
        <div className="notificaciones-filtros">
          <button
            className={`filtro-btn ${filtro === "todas" ? "active" : ""}`}
            onClick={() => setFiltro("todas")}
          >
            Todas ({notificaciones.length})
          </button>
          <button
            className={`filtro-btn ${filtro === "no-leidas" ? "active" : ""}`}
            onClick={() => setFiltro("no-leidas")}
          >
            No leídas ({notificaciones.filter(n => !n.leida).length})
          </button>
          <button
            className={`filtro-btn ${filtro === "leidas" ? "active" : ""}`}
            onClick={() => setFiltro("leidas")}
          >
            Leídas ({notificaciones.filter(n => n.leida).length})
          </button>
        </div>

        {/* Lista de Notificaciones */}
        <div className="notificaciones-page-lista">
          {cargando ? (
            <div className="notificaciones-page-cargando">
              <p>Cargando notificaciones...</p>
            </div>
          ) : notificacionesFiltradas.length > 0 ? (
            notificacionesFiltradas.map((notif) => (
              <div
                key={notif.id}
                className={`notificacion-page-card ${!notif.leida ? "no-leida" : ""}`}
                onClick={() => irAPregunta(notif.preguntaId)}
              >
                <div className="notificacion-page-icono">
                  {!notif.leida && <span className="punto-no-leido"></span>}
                  <span className="icono-respuesta">💬</span>
                </div>
                
                <div className="notificacion-page-contenido">
                  <p className="notificacion-page-texto">
                    <strong>{notif.usuario}</strong> respondió a tu pregunta:{" "}
                    "{notif.preguntaTitulo}"
                  </p>
                  <span className="notificacion-page-fecha">{notif.fecha}</span>
                </div>

                <div className="notificacion-page-accion">
                  <span className="flecha">→</span>
                </div>
              </div>
            ))
          ) : (
            <div className="notificaciones-page-vacio">
              <span className="icono-vacio"></span>
              <p>No tienes notificaciones {filtro === "no-leidas" ? "sin leer" : filtro === "leidas" ? "leídas" : ""}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}