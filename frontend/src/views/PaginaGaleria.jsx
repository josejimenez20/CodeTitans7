import React, { useState, useEffect } from "react";
import "../styles/PaginaGaleria.css";

// Componente TarjetaFotoResumen (integrado)
function TarjetaFotoResumen({ foto, onClick }) {
  const { imagen, titulo, autor, likes, comentarios } = foto;

  return (
    <article className="tarjeta-foto" onClick={onClick}>
      <div className="tarjeta-foto-imagen-container">
        <img 
          src={imagen} 
          alt={titulo}
          className="tarjeta-foto-imagen"
        />
        
        <div className="tarjeta-foto-overlay">
          <div className="overlay-stats">
            <span className="stat-item">
              ❤️ {likes}
            </span>
            <span className="stat-item">
              💬 {comentarios}
            </span>
          </div>
        </div>
      </div>

      <div className="tarjeta-foto-info">
        <h3 className="tarjeta-foto-titulo">{titulo}</h3>
        <p className="tarjeta-foto-autor">Por {autor}</p>
      </div>
    </article>
  );
}

// Componente Principal PaginaGaleria
export default function PaginaGaleria() {
  const [fotos, setFotos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [ordenSeleccionado, setOrdenSeleccionado] = useState("todas");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas"); // NUEVO
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);

  // Categorías disponibles (NUEVO)
  const categorias = [
    { id: "todas", nombre: "Todas" },
    { id: "suculentas", nombre: "Suculentas" },
    { id: "flores", nombre: "Flores" },
    { id: "interior", nombre: "Interior" },
    { id: "jardin", nombre: "Jardín" },
    { id: "cactus", nombre: "Cactus" },
    { id: "arboles", nombre: "Árboles" }
  ];

  useEffect(() => {
    obtenerFotos();
  }, []);

  const obtenerFotos = async () => {
    setCargando(true);
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await fetch("/api/galeria/fotos");
      const data = await response.json();
      setFotos(data.fotos || []);
    } catch (error) {
      console.error("Error al obtener fotos:", error);
      // Datos de ejemplo
      setFotos([
        {
          id: 1,
          imagen: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400",
          titulo: "Mi Monstera después de 6 meses",
          autor: "María García",
          fechaSubida: "2025-01-10",
          likes: 24,
          comentarios: 5,
          descripcion: "Ha crecido increíblemente desde que la trasplanté. ¡Miren esas hojas!",
          categoria: "interior"
        },
        {
          id: 2,
          imagen: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400",
          titulo: "Suculentas en mi balcón",
          autor: "Carlos López",
          fechaSubida: "2025-01-09",
          likes: 18,
          comentarios: 3,
          descripcion: "Mi colección de suculentas sigue creciendo.",
          categoria: "suculentas"
        },
        {
          id: 3,
          imagen: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400",
          titulo: "Orquídea en flor",
          autor: "Ana Rodríguez",
          fechaSubida: "2025-01-08",
          likes: 32,
          comentarios: 8,
          descripcion: "Finalmente floreció después de 8 meses de cuidados.",
          categoria: "flores"
        },
        {
          id: 4,
          imagen: "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400",
          titulo: "Mi jardín vertical",
          autor: "Pedro Martínez",
          fechaSubida: "2025-01-07",
          likes: 45,
          comentarios: 12,
          descripcion: "Proyecto terminado: jardín vertical en mi pared exterior.",
          categoria: "jardin"
        },
        {
          id: 5,
          imagen: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400",
          titulo: "Cactus floreciendo",
          autor: "Laura Fernández",
          fechaSubida: "2025-01-06",
          likes: 28,
          comentarios: 6,
          descripcion: "Mi cactus dio esta hermosa flor rosa.",
          categoria: "cactus"
        },
        {
          id: 6,
          imagen: "https://images.unsplash.com/photo-1511909168776-85c86272b023?w=400",
          titulo: "Helechos en maceta",
          autor: "Roberto Sánchez",
          fechaSubida: "2025-01-05",
          likes: 15,
          comentarios: 4,
          descripcion: "Mis helechos están felices con la humedad del invierno.",
          categoria: "interior"
        },
        {
          id: 7,
          imagen: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
          titulo: "Rosas de mi jardín",
          autor: "Carmen Díaz",
          fechaSubida: "2025-01-04",
          likes: 41,
          comentarios: 9,
          descripcion: "Primera floración de primavera.",
          categoria: "flores"
        },
        {
          id: 8,
          imagen: "https://images.unsplash.com/photo-1524487903431-00c9087d9792?w=400",
          titulo: "Echeveria elegans",
          autor: "Miguel Torres",
          fechaSubida: "2025-01-03",
          likes: 22,
          comentarios: 4,
          descripcion: "Mi suculenta favorita.",
          categoria: "suculentas"
        }
      ]);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar por categoría y ordenar (ACTUALIZADO)
  const fotosFiltradas = () => {
    let resultado = [...fotos];
    
    // Filtrar por categoría
    if (categoriaSeleccionada !== "todas") {
      resultado = resultado.filter(foto => foto.categoria === categoriaSeleccionada);
    }
    
    // Ordenar
    if (ordenSeleccionado === "recientes") {
      resultado.sort((a, b) => new Date(b.fechaSubida) - new Date(a.fechaSubida));
    } else if (ordenSeleccionado === "populares") {
      resultado.sort((a, b) => b.likes - a.likes);
    }
    
    return resultado;
  };

  const handleFotoClick = (foto) => {
    setFotoSeleccionada(foto);
  };

  const cerrarModal = () => {
    setFotoSeleccionada(null);
  };

  return (
    <div className="galeria-page-wrapper">
      <div className="galeria-page-container">
        {/* Header */}
        <div className="galeria-page-header">
          <h1 className="galeria-page-titulo">Galería de la Comunidad</h1>
          <p className="galeria-page-subtitulo">
            Descubre y comparte el progreso de tus plantas
          </p>
        </div>

        {/* FILTROS POR CATEGORÍA (NUEVO) */}
        <div className="galeria-categorias">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              className={`categoria-btn ${categoriaSeleccionada === categoria.id ? "activo" : ""}`}
              onClick={() => setCategoriaSeleccionada(categoria.id)}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>

        {/* Filtros de Orden */}
        <div className="galeria-filtros">
          <button
            className={`filtro-btn ${ordenSeleccionado === "todas" ? "active" : ""}`}
            onClick={() => setOrdenSeleccionado("todas")}
          >
            Todas
          </button>
          <button
            className={`filtro-btn ${ordenSeleccionado === "recientes" ? "active" : ""}`}
            onClick={() => setOrdenSeleccionado("recientes")}
          >
            Más recientes
          </button>
          <button
            className={`filtro-btn ${ordenSeleccionado === "populares" ? "active" : ""}`}
            onClick={() => setOrdenSeleccionado("populares")}
          >
            Más populares
          </button>
        </div>

        {/* Galería de Fotos */}
        <div className="galeria-grid">
          {cargando ? (
            <div className="galeria-cargando">
              <p>Cargando galería...</p>
            </div>
          ) : fotosFiltradas().length > 0 ? (
            fotosFiltradas().map((foto) => (
              <TarjetaFotoResumen
                key={foto.id}
                foto={foto}
                onClick={() => handleFotoClick(foto)}
              />
            ))
          ) : (
            <div className="galeria-vacio">
              <span className="icono-vacio">📷</span>
              <p>No hay fotos en esta categoría</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle de Foto */}
      {fotoSeleccionada && (
        <div className="modal-foto-overlay" onClick={cerrarModal}>
          <div className="modal-foto-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-foto-cerrar" onClick={cerrarModal}>
              ✕
            </button>
            
            <div className="modal-foto-grid">
              <div className="modal-foto-imagen-wrapper">
                <img 
                  src={fotoSeleccionada.imagen} 
                  alt={fotoSeleccionada.titulo}
                  className="modal-foto-imagen"
                />
              </div>
              
              <div className="modal-foto-info">
                <h2 className="modal-foto-titulo">{fotoSeleccionada.titulo}</h2>
                <p className="modal-foto-autor">Por {fotoSeleccionada.autor}</p>
                <p className="modal-foto-descripcion">{fotoSeleccionada.descripcion}</p>
                
                <div className="modal-foto-stats">
                  <span className="modal-stat">❤️ {fotoSeleccionada.likes} Me gusta</span>
                  <span className="modal-stat">💬 {fotoSeleccionada.comentarios} Comentarios</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}