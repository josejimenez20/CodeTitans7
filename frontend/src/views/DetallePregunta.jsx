import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/DetallePregunta.css";

export default function DetallePregunta() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Datos de ejemplo - en producción vendrían de una API
  const preguntasData = {
    1: {
      id: 1,
      titulo: "¿Cuál es la mejor planta para interior con poca luz?",
      autor: "María García",
      fecha: "3 días atrás",
      respuestas: 5,
      vistas: 128,
      descripcion: "Tengo un apartamento con muy poca luz natural. Las ventanas dan hacia el norte y solo recibo luz indirecta la mayor parte del día. He intentado con algunas plantas pero se me mueren. ¿Qué plantas me recomiendas que puedan sobrevivir y prosperar en estas condiciones? Preferiblemente que no requieran mucho mantenimiento ya que viajo frecuentemente por trabajo.",
      tags: ["interior", "poca-luz"]
    },
    2: {
      id: 2,
      titulo: "¿Cómo riego correctamente mis suculentas?",
      autor: "Carlos López",
      fecha: "1 semana atrás",
      respuestas: 8,
      vistas: 245,
      descripcion: "He estado matando mis suculentas por riego excesivo. Tengo varias especies diferentes: echeverias, crasulas y sedums. ¿Cuál es la frecuencia correcta de riego? ¿Debo esperar a que la tierra esté completamente seca? ¿Cambia según la estación del año?",
      tags: ["suculentas", "riego"]
    },
    3: {
      id: 3,
      titulo: "¿Qué plantas son tóxicas para las mascotas?",
      autor: "Ana Rodríguez",
      fecha: "2 semanas atrás",
      respuestas: 12,
      vistas: 456,
      descripcion: "Tengo dos gatos y un perro en casa. Me encantaría tener más plantas pero me preocupa que puedan ser tóxicas para ellos. ¿Qué plantas debo evitar completamente? ¿Hay alguna lista confiable que pueda consultar? También me gustaría saber cuáles son seguras para tener sin preocupaciones.",
      tags: ["seguridad", "mascotas"]
    },
    4: {
      id: 4,
      titulo: "¿Cómo hacer que mi orquídea vuelva a florecer?",
      autor: "Pedro Martínez",
      fecha: "3 semanas atrás",
      respuestas: 6,
      vistas: 189,
      descripcion: "Mi orquídea Phalaenopsis dejó de florecer hace varios meses. Las hojas se ven saludables y verdes, pero no saca nuevas varas florales. ¿Hay algún truco para estimular nuevas flores? ¿Necesita un periodo de frío? ¿Debo cambiarla de maceta o fertilizarla de alguna manera especial?",
      tags: ["orquídeas", "flores"]
    },
    5: {
      id: 5,
      titulo: "¿Cuál es el mejor fertilizante para plantas de interior?",
      autor: "Laura Fernández",
      fecha: "1 mes atrás",
      respuestas: 7,
      vistas: 312,
      descripcion: "Quiero fertilizar mis plantas de interior pero no sé cuál es el mejor producto. ¿Es mejor usar fertilizantes caseros como cáscaras de huevo y café, o comprar fertilizantes comerciales? ¿Con qué frecuencia debo fertilizar? ¿Hay diferencia entre fertilizantes líquidos y sólidos?",
      tags: ["fertilizante", "nutrientes"]
    },
    6: {
      id: 6,
      titulo: "¿Cómo identificar y tratar plagas en plantas?",
      autor: "Roberto Sánchez",
      fecha: "1 mes atrás",
      respuestas: 10,
      vistas: 523,
      descripcion: "He notado manchas extrañas en las hojas de mis plantas y algunas tienen una sustancia pegajosa. ¿Cómo puedo saber si es una plaga y de qué tipo? ¿Cuáles son los tratamientos más efectivos y naturales? Prefiero evitar químicos fuertes si es posible.",
      tags: ["plagas", "tratamiento"]
    }
  };

  const pregunta = preguntasData[id];

  const [respuestas, setRespuestas] = useState([
    {
      id: 1,
      autor: "Juan Pérez",
      fecha: "2 días atrás",
      contenido: "Te recomiendo el Pothos (Photos aureus), es prácticamente indestructible y crece muy bien con poca luz. También la Sansevieria (lengua de suegra) es excelente para estas condiciones.",
      votos: 12
    },
    {
      id: 2,
      autor: "Sofía Martín",
      fecha: "1 día atrás",
      contenido: "Además de las que mencionó Juan, el Helecho de Boston también funciona bien. Solo necesita mantener la tierra húmeda y no requiere luz directa.",
      votos: 8
    }
  ]);

  const [nuevaRespuesta, setNuevaRespuesta] = useState("");

  if (!pregunta) {
    return (
      <div className="detalle-wrapper">
        <div className="detalle-container">
          <h2>Pregunta no encontrada</h2>
          <button onClick={() => navigate("/comunidad")} className="btn-volver">
            ← Volver a Comunidad
          </button>
        </div>
      </div>
    );
  }

  const enviarRespuesta = (e) => {
    e.preventDefault();
    
    if (!nuevaRespuesta.trim()) {
      toast.error("Por favor escribe una respuesta.");
      return;
    }

    const nuevaResp = {
      id: respuestas.length + 1,
      autor: "Usuario Actual", // En producción sería el usuario logueado
      fecha: "Ahora",
      contenido: nuevaRespuesta,
      votos: 0
    };

    setRespuestas([...respuestas, nuevaResp]);
    setNuevaRespuesta("");
    toast.success("¡Respuesta publicada! 🎉");
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
            <h1 className="pregunta-titulo-detalle">{pregunta.titulo}</h1>
            <div className="pregunta-meta">
              <span className="meta-item">Por {pregunta.autor}</span>
              <span className="meta-item">{pregunta.fecha}</span>
              <span className="meta-item">{pregunta.vistas} vistas</span>
            </div>
          </div>

          <div className="pregunta-tags-detalle">
            {pregunta.tags.map((tag) => (
              <span key={tag} className="tag-detalle">
                {tag}
              </span>
            ))}
          </div>

          <div className="pregunta-descripcion">
            <p>{pregunta.descripcion}</p>
          </div>
        </article>

        {/* Sección de Respuestas */}
        <section className="respuestas-section">
          <h2 className="respuestas-titulo">
            {respuestas.length} {respuestas.length === 1 ? "Respuesta" : "Respuestas"}
          </h2>

          <div className="respuestas-lista">
            {respuestas.map((respuesta) => (
              <article key={respuesta.id} className="respuesta-card">
                <div className="respuesta-votos">
                  <button className="voto-btn">▲</button>
                  <span className="votos-count">{respuesta.votos}</span>
                  <button className="voto-btn">▼</button>
                </div>

                <div className="respuesta-contenido">
                  <p className="respuesta-texto">{respuesta.contenido}</p>
                  <div className="respuesta-meta">
                    <span className="respuesta-autor">{respuesta.autor}</span>
                    <span className="respuesta-fecha">{respuesta.fecha}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Formulario para Nueva Respuesta */}
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
    </div>
  );
}