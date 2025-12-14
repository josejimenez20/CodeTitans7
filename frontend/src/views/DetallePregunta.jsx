import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/DetallePregunta.css";

// COMPONENTE MODAL DE REPORTE
function ModalReporte({ tipo, itemId, onClose }) {
  const [motivoSeleccionado, setMotivoSeleccionado] = useState("");

  const motivos = [
    { id: "ofensivo", label: "Contenido ofensivo" },
    { id: "spam", label: "Spam o publicidad" },
    { id: "informacion-falsa", label: "Información falsa" },
    { id: "contenido-inapropiado", label: "Contenido inapropiado" },
    { id: "otro", label: "Otro" }
  ];

  const enviarReporte = async () => {
    if (!motivoSeleccionado) {
      toast.error("Por favor selecciona un motivo.");
      return;
    }

    try {
      await fetch("/api/reportes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, itemId, motivo: motivoSeleccionado })
      });

      toast((t) => (
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>
          <span>✓ Gracias, revisaremos este contenido</span>
        </div>
      ), {
        duration: 3000,
        style: {
          background: '#fffefeff',
          color: '#61cc4cff',
          padding: '16px 20px',
          borderRadius: '8px'
        }
      });

      onClose();
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      toast.error("Error al enviar el reporte.");
    }
  };

  return (
    <div className="modal-reporte-overlay" onClick={onClose}>
      <div className="modal-reporte-contenido" onClick={(e) => e.stopPropagation()}>
        <button className="modal-reporte-cerrar" onClick={onClose}>✕</button>
        <h2 className="modal-reporte-titulo">Reportar contenido</h2>
        <div className="modal-reporte-opciones">
          <p className="modal-reporte-instruccion">Selecciona el motivo del reporte:</p>
          {motivos.map((motivo) => (
            <label key={motivo.id} className="opcion-reporte">
              <input
                type="radio"
                name="motivo-reporte"
                value={motivo.id}
                checked={motivoSeleccionado === motivo.id}
                onChange={(e) => setMotivoSeleccionado(e.target.value)}
              />
              <span className="opcion-texto">{motivo.label}</span>
            </label>
          ))}
        </div>
        <div className="modal-reporte-acciones">
          <button className="btn-enviar-reporte" onClick={enviarReporte}>
            Enviar reporte
          </button>
          <button className="btn-cancelar-reporte" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// COMPONENTE MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
function ModalConfirmarEliminacion({ tipo, onConfirmar, onCancelar }) {
  return (
    <div className="modal-eliminar-overlay" onClick={onCancelar}>
      <div className="modal-eliminar-contenido" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-eliminar-pregunta">
          ¿Estás seguro de que deseas eliminar {tipo === 'pregunta' ? 'esta pregunta' : 'esta respuesta'}?
        </h2>
        <p className="modal-eliminar-advertencia">
          Esta acción no se puede deshacer.
        </p>
        <div className="modal-eliminar-acciones">
          <button className="btn-confirmar-eliminar" onClick={onConfirmar}>
            Sí, eliminar
          </button>
          <button className="btn-cancelar-eliminar" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// COMPONENTE PRINCIPAL
export default function DetallePregunta() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ordenRespuestas, setOrdenRespuestas] = useState("utiles");
  const [comentarioAbierto, setComentarioAbierto] = useState(null);
  const [textoComentario, setTextoComentario] = useState("");
  const [respuestaReportar, setRespuestaReportar] = useState(null);
  const [preguntaReportar, setPreguntaReportar] = useState(null);
  
  // Estados para edición
  const [editandoPregunta, setEditandoPregunta] = useState(false);
  const [editandoRespuesta, setEditandoRespuesta] = useState(null);
  const [textoEditadoPregunta, setTextoEditadoPregunta] = useState("");
  const [textoEditadoRespuesta, setTextoEditadoRespuesta] = useState("");

  // Estados para eliminación
  const [confirmarEliminarPregunta, setConfirmarEliminarPregunta] = useState(false);
  const [respuestaAEliminar, setRespuestaAEliminar] = useState(null);

  // Usuario actual (simulado - cambiar por tu sistema de autenticación)
  const usuarioActual = "María García";

  const [preguntasData, setPreguntasData] = useState({
    1: {
      id: 1,
      titulo: "¿Cuál es la mejor planta para interior con poca luz?",
      autor: "María García",
      fecha: "3 días atrás",
      respuestas: 5,
      vistas: 128,
      descripcion: "Tengo un apartamento con muy poca luz natural. Las ventanas dan hacia el norte y solo recibo luz indirecta la mayor parte del día.",
      tags: ["interior", "poca-luz"],
      editada: false
    }
  });

  const pregunta = preguntasData[id] || preguntasData[1];

  const [respuestas, setRespuestas] = useState([
    {
      id: 1,
      autor: "Juan Pérez",
      fecha: "2 días atrás",
      fechaTimestamp: new Date("2025-01-13"),
      contenido: "Te recomiendo el Pothos (Photos aureus), es prácticamente indestructible y crece muy bien con poca luz.",
      votos: 12,
      marcadoUtil: false,
      contadorUtil: 8,
      popularidad: 45,
      editada: false,
      comentarios: []
    },
    {
      id: 2,
      autor: "María García",
      fecha: "1 día atrás",
      fechaTimestamp: new Date("2025-01-14"),
      contenido: "También recomiendo la Sansevieria, es perfecta para espacios con poca luz.",
      votos: 8,
      marcadoUtil: false,
      contadorUtil: 5,
      popularidad: 28,
      editada: false,
      comentarios: []
    }
  ]);

  const [nuevaRespuesta, setNuevaRespuesta] = useState("");

  // Función para eliminar pregunta
  const eliminarPregunta = async () => {
    try {
      await fetch(`/api/preguntas/${pregunta.id}`, {
        method: "DELETE"
      });

      toast.success("Pregunta eliminada correctamente");
      setConfirmarEliminarPregunta(false);
      navigate("/ComunidadPreguntas");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar la pregunta");
    }
  };

  // Función para eliminar respuesta
  const eliminarRespuesta = async (respuestaId) => {
    try {
      await fetch(`/api/respuestas/${respuestaId}`, {
        method: "DELETE"
      });

      setRespuestas(prev => prev.filter(resp => resp.id !== respuestaId));
      setRespuestaAEliminar(null);
      toast.success("Respuesta eliminada correctamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar la respuesta");
    }
  };

  // Funciones de edición (igual que antes)
  const iniciarEdicionPregunta = () => {
    setTextoEditadoPregunta(pregunta.descripcion);
    setEditandoPregunta(true);
  };

  const guardarEdicionPregunta = async () => {
    if (!textoEditadoPregunta.trim()) {
      toast.error("La descripción no puede estar vacía.");
      return;
    }

    try {
      await fetch(`/api/preguntas/${pregunta.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion: textoEditadoPregunta })
      });

      setPreguntasData(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          descripcion: textoEditadoPregunta,
          editada: true
        }
      }));

      setEditandoPregunta(false);
      toast.success("Pregunta actualizada ✓");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al guardar cambios.");
    }
  };

  const cancelarEdicionPregunta = () => {
    setEditandoPregunta(false);
    setTextoEditadoPregunta("");
  };

  const iniciarEdicionRespuesta = (respuesta) => {
    setTextoEditadoRespuesta(respuesta.contenido);
    setEditandoRespuesta(respuesta.id);
  };

  const guardarEdicionRespuesta = async (respuestaId) => {
    if (!textoEditadoRespuesta.trim()) {
      toast.error("La respuesta no puede estar vacía.");
      return;
    }

    try {
      await fetch(`/api/respuestas/${respuestaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenido: textoEditadoRespuesta })
      });

      setRespuestas(prev =>
        prev.map(resp =>
          resp.id === respuestaId
            ? { ...resp, contenido: textoEditadoRespuesta, editada: true }
            : resp
        )
      );

      setEditandoRespuesta(null);
      setTextoEditadoRespuesta("");
      toast.success("Respuesta actualizada ✓");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al guardar cambios.");
    }
  };

  const cancelarEdicionRespuesta = () => {
    setEditandoRespuesta(null);
    setTextoEditadoRespuesta("");
  };

  const toggleUtil = (respuestaId) => {
    setRespuestas(prevRespuestas =>
      prevRespuestas.map(resp => {
        if (resp.id === respuestaId) {
          const nuevoEstado = !resp.marcadoUtil;
          return {
            ...resp,
            marcadoUtil: nuevoEstado,
            contadorUtil: nuevoEstado ? resp.contadorUtil + 1 : resp.contadorUtil - 1
          };
        }
        return resp;
      })
    );
  };

  const toggleComentario = (respuestaId) => {
    if (comentarioAbierto === respuestaId) {
      setComentarioAbierto(null);
      setTextoComentario("");
    } else {
      setComentarioAbierto(respuestaId);
      setTextoComentario("");
    }
  };

  const publicarComentario = (respuestaId) => {
    if (!textoComentario.trim()) {
      toast.error("Escribe un comentario antes de publicar.");
      return;
    }

    const nuevoComentario = {
      id: Date.now(),
      autor: usuarioActual,
      fecha: "Ahora",
      contenido: textoComentario
    };

    setRespuestas(prevRespuestas =>
      prevRespuestas.map(resp => {
        if (resp.id === respuestaId) {
          return {
            ...resp,
            comentarios: [...resp.comentarios, nuevoComentario]
          };
        }
        return resp;
      })
    );

    setTextoComentario("");
    setComentarioAbierto(null);
    toast.success("¡Comentario publicado! 💬");
  };

  const enviarRespuesta = (e) => {
    e.preventDefault();
    
    if (!nuevaRespuesta.trim()) {
      toast.error("Por favor escribe una respuesta.");
      return;
    }

    const nuevaResp = {
      id: respuestas.length + 1,
      autor: usuarioActual,
      fecha: "Ahora",
      fechaTimestamp: new Date(),
      contenido: nuevaRespuesta,
      votos: 0,
      marcadoUtil: false,
      contadorUtil: 0,
      popularidad: 0,
      editada: false,
      comentarios: []
    };

    setRespuestas([...respuestas, nuevaResp]);
    setNuevaRespuesta("");
    toast.success("¡Respuesta publicada! 🎉");
  };

  const respuestasOrdenadas = () => {
    let ordenadas = [...respuestas];
    
    if (ordenRespuestas === "utiles") {
      ordenadas.sort((a, b) => b.contadorUtil - a.contadorUtil);
    } else if (ordenRespuestas === "recientes") {
      ordenadas.sort((a, b) => b.fechaTimestamp - a.fechaTimestamp);
    } else if (ordenRespuestas === "populares") {
      ordenadas.sort((a, b) => b.popularidad - a.popularidad);
    }
    
    return ordenadas;
  };

  return (
    <div className="detalle-wrapper">
      <div className="detalle-container">
        <button
          className="btn-volver"
          onClick={() => navigate("/ComunidadPreguntas")}
        >
          ← Volver a Comunidad
        </button>

        {/* Pregunta Principal */}
        <article className="pregunta-detalle">
          <div className="pregunta-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <h1 className="pregunta-titulo-detalle" style={{ flex: 1 }}>{pregunta.titulo}</h1>
              <button 
                className="btn-reportar"
                onClick={() => setPreguntaReportar(pregunta.id)}
                title="Reportar pregunta"
              >
                🚩
              </button>
            </div>
            <div className="pregunta-meta">
              <span className="meta-item">Por {pregunta.autor}</span>
              <span className="meta-item">
                {pregunta.fecha}
                {pregunta.editada && <span className="etiqueta-editado"> (Editado)</span>}
              </span>
              <span className="meta-item">{pregunta.vistas} vistas</span>
              
              {/* BOTONES EDITAR Y ELIMINAR (solo si soy el autor) */}
              {pregunta.autor === usuarioActual && !editandoPregunta && (
                <>
                  <button className="btn-editar" onClick={iniciarEdicionPregunta}>
                    Editar
                  </button>
                  <button 
                    className="btn-eliminar" 
                    onClick={() => setConfirmarEliminarPregunta(true)}
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="pregunta-tags-detalle">
            {pregunta.tags.map((tag) => (
              <span key={tag} className="tag-detalle">{tag}</span>
            ))}
          </div>

          {editandoPregunta ? (
            <div className="edicion-form">
              <textarea
                className="edicion-textarea"
                value={textoEditadoPregunta}
                onChange={(e) => setTextoEditadoPregunta(e.target.value)}
                rows="6"
              />
              <div className="edicion-acciones">
                <button className="btn-guardar-cambios" onClick={guardarEdicionPregunta}>
                  Guardar cambios
                </button>
                <button className="btn-cancelar-edicion" onClick={cancelarEdicionPregunta}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="pregunta-descripcion">
              <p>{pregunta.descripcion}</p>
            </div>
          )}
        </article>

        <div className="orden-control">
          <label htmlFor="orden-respuestas" className="orden-label">Ordenar por:</label>
          <div className="orden-dropdown">
            <select
              id="orden-respuestas"
              className="orden-select"
              value={ordenRespuestas}
              onChange={(e) => setOrdenRespuestas(e.target.value)}
            >
              <option value="utiles">Más útiles</option>
              <option value="recientes">Más recientes</option>
              <option value="populares">Más populares</option>
            </select>
          </div>
        </div>

        <section className="respuestas-section">
          <h2 className="respuestas-titulo">
            {respuestas.length} {respuestas.length === 1 ? "Respuesta" : "Respuestas"}
          </h2>

          <div className="respuestas-lista">
            {respuestasOrdenadas().map((respuesta) => (
              <article key={respuesta.id} className="respuesta-card">
                <div className="respuesta-votos">
                  <button className="voto-btn">▲</button>
                  <span className="votos-count">{respuesta.votos}</span>
                  <button className="voto-btn">▼</button>
                </div>

                <div className="respuesta-contenido">
                  {editandoRespuesta === respuesta.id ? (
                    <div className="edicion-form">
                      <textarea
                        className="edicion-textarea"
                        value={textoEditadoRespuesta}
                        onChange={(e) => setTextoEditadoRespuesta(e.target.value)}
                        rows="4"
                      />
                      <div className="edicion-acciones">
                        <button 
                          className="btn-guardar-cambios" 
                          onClick={() => guardarEdicionRespuesta(respuesta.id)}
                        >
                          Guardar cambios
                        </button>
                        <button className="btn-cancelar-edicion" onClick={cancelarEdicionRespuesta}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="respuesta-texto">{respuesta.contenido}</p>
                  )}
                  
                  <div className="respuesta-footer">
                    <div className="respuesta-meta">
                      <span className="respuesta-autor">{respuesta.autor}</span>
                      <span className="respuesta-fecha">
                        {respuesta.fecha}
                        {respuesta.editada && <span className="etiqueta-editado"> (Editado)</span>}
                      </span>
                      
                      {/* BOTONES EDITAR Y ELIMINAR RESPUESTA (solo si soy el autor) */}
                      {respuesta.autor === usuarioActual && editandoRespuesta !== respuesta.id && (
                        <>
                          <button 
                            className="btn-editar" 
                            onClick={() => iniciarEdicionRespuesta(respuesta)}
                          >
                            Editar
                          </button>
                          <button 
                            className="btn-eliminar" 
                            onClick={() => setRespuestaAEliminar(respuesta.id)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                      
                      <button 
                        className="btn-reportar-respuesta"
                        onClick={() => setRespuestaReportar(respuesta.id)}
                      >
                        Reportar
                      </button>
                    </div>

                    <div className="respuesta-acciones">
                      <button
                        className={`btn-util ${respuesta.marcadoUtil ? "activo" : ""}`}
                        onClick={() => toggleUtil(respuesta.id)}
                      >
                        <span className="icono-util">✓</span>
                        <span className="contador-util">{respuesta.contadorUtil}</span>
                      </button>

                      <button
                        className="btn-comentar"
                        onClick={() => toggleComentario(respuesta.id)}
                      >
                        💬 Añadir comentario ({respuesta.comentarios.length})
                      </button>
                    </div>
                  </div>

                  {comentarioAbierto === respuesta.id && (
                    <div className="comentario-form">
                      <textarea
                        className="comentario-textarea"
                        placeholder="Escribe tu comentario..."
                        value={textoComentario}
                        onChange={(e) => setTextoComentario(e.target.value)}
                        rows="3"
                      />
                      <div className="comentario-form-acciones">
                        <button
                          className="btn-publicar-comentario"
                          onClick={() => publicarComentario(respuesta.id)}
                        >
                          Publicar comentario
                        </button>
                        <button
                          className="btn-cancelar-comentario"
                          onClick={() => toggleComentario(respuesta.id)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {respuesta.comentarios.length > 0 && (
                    <div className="comentarios-lista">
                      {respuesta.comentarios.map((comentario) => (
                        <div key={comentario.id} className="comentario-item">
                          <div className="comentario-meta">
                            <span className="comentario-autor">{comentario.autor}</span>
                            <span className="comentario-fecha">{comentario.fecha}</span>
                          </div>
                          <p className="comentario-texto">{comentario.contenido}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="nueva-respuesta-section">
          <h3 className="nueva-respuesta-titulo">Tu respuesta</h3>
          <form onSubmit={enviarRespuesta} className="nueva-respuesta-form">
            <textarea
              className="respuesta-textarea"
              placeholder="Comparte tu conocimiento y ayuda a la comunidad..."
              value={nuevaRespuesta}
              onChange={(e) => setNuevaRespuesta(e.target.value)}
              rows="6"
            />
            <button type="submit" className="btn-enviar-respuesta">
              Publicar respuesta
            </button>
          </form>
        </section>
      </div>

      {/* Modales */}
      {preguntaReportar && (
        <ModalReporte 
          tipo="pregunta" 
          itemId={preguntaReportar}
          onClose={() => setPreguntaReportar(null)}
        />
      )}

      {respuestaReportar && (
        <ModalReporte 
          tipo="respuesta" 
          itemId={respuestaReportar}
          onClose={() => setRespuestaReportar(null)}
        />
      )}

      {confirmarEliminarPregunta && (
        <ModalConfirmarEliminacion
          tipo="pregunta"
          onConfirmar={eliminarPregunta}
          onCancelar={() => setConfirmarEliminarPregunta(false)}
        />
      )}

      {respuestaAEliminar && (
        <ModalConfirmarEliminacion
          tipo="respuesta"
          onConfirmar={() => eliminarRespuesta(respuestaAEliminar)}
          onCancelar={() => setRespuestaAEliminar(null)}
        />
      )}
    </div>
  );
}