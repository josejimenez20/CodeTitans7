import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/NuevaPregunta.css";

export default function NuevaPregunta() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tags: []
  });

  const [tagInput, setTagInput] = useState("");

  const tagsDisponibles = [
    "interior",
    "exterior",
    "riego",
    "luz",
    "plagas",
    "suculentas",
    "orquídeas",
    "fertilizante",
    "mascotas",
    "seguridad",
    "composting",
    "propagación"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput("");
  };

  const removerTag = (tagARemover) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagARemover)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      toast.error("Por favor ingresa un título para tu pregunta.");
      return;
    }

    if (!formData.descripcion.trim()) {
      toast.error("Por favor describe tu pregunta con más detalle.");
      return;
    }

    if (formData.tags.length === 0) {
      toast.error("Por favor selecciona al menos un tema.");
      return;
    }

    // Aquí se enviaría a la API
    console.log("Pregunta enviada:", formData);
    toast.success("¡Tu pregunta ha sido publicada! 🎉");

    // Redirigir después de 1 segundo
    setTimeout(() => {
      navigate("/ComunidadPreguntas");
    }, 1500);
  };

  return (
    <div className="nueva-pregunta-wrapper">
      <div className="nueva-pregunta-container">
        <button
          className="btn-volver"
          onClick={() => navigate("/ComunidadPreguntas")}
        >
          ← Volver a Preguntas
        </button>

        <div className="nueva-pregunta-card">
          <h1 className="nueva-pregunta-titulo">Hacer una nueva pregunta</h1>

          <form onSubmit={handleSubmit} className="nueva-pregunta-form">
            {/* Título */}
            <div className="form-group">
              <label htmlFor="titulo" className="form-label">
                Título de tu pregunta *
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Sé específico y claro sobre tu duda..."
                className="form-input"
                maxLength="150"
              />
              <p className="form-helper">
                {formData.titulo.length}/150 caracteres
              </p>
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label htmlFor="descripcion" className="form-label">
                Descripción detallada *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Explica tu situación, qué has intentado y qué resultado tuviste..."
                className="form-textarea"
                rows="8"
                maxLength="2000"
              />
              <p className="form-helper">
                {formData.descripcion.length}/2000 caracteres
              </p>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label htmlFor="tags" className="form-label">
                Temas relacionados * (selecciona al menos uno)
              </label>

              <div className="tags-selector">
                {tagsDisponibles.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-btn ${
                      formData.tags.includes(tag) ? "active" : ""
                    }`}
                    onClick={() => agregarTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {formData.tags.length > 0 && (
                <div className="tags-seleccionados">
                  <p className="tags-label">Temas seleccionados:</p>
                  <div className="tags-list">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="tag-item">
                        {tag}
                        <button
                          type="button"
                          className="tag-remove"
                          onClick={() => removerTag(tag)}
                          aria-label={`Remover ${tag}`}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn-submit"
              >
                Publicar pregunta
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => navigate("/comunidad")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}