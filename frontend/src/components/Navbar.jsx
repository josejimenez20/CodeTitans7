import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [openHelp, setOpenHelp] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">

          {/* Logo + Título */}
          <div className="navbar-logo">
            <img src="/logo.png" alt="Logo Jardines" />
            <span className="titulo-app">FLORGAERFRA</span>
          </div>

          <nav>
            <ul>
              <li>
                <Link to="/inicio">Inicio</Link>
              </li>

              <li>
                <Link to="/favoritos">Plantas Favoritas</Link>
              </li>

              <li>
                <Link to="/perfil">Mi cuenta</Link>
              </li>

              {/* BOTÓN DE AYUDA */}
              <li>
                <button
                  className="help-btn"
                  title="Centro de Ayuda"
                  onClick={() => setOpenHelp(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M10.5 9.75a2 2 0 1 1 3 1.73
                        c-.8.46-1.25 1-1.25 1.77V14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 17h.01"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>

        </div>
      </header>

      {/* MODAL DE AYUDA */}
      {openHelp && (
        <div className="help-overlay">
          <div className="help-modal">

            <div className="modal-header">
              <h2>Ayuda y Documentación</h2>
              <button
                className="close-btn"
                onClick={() => setOpenHelp(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">

              {/* SIDEBAR */}
              <aside className="modal-sidebar">
                <ul>
                  <li className="active">Introducción</li>
                  <li>Cómo usar la app</li>
                  <li>Favoritos</li>
                  <li>Mi Perfil</li>
                  <li>Videos</li>
                </ul>
              </aside>

              {/* CONTENIDO */}
              <section className="modal-content">

                <h1>Bienvenido al Centro de Ayuda</h1>

                <p>
                  Aquí encontrarás guías rápidas y material de apoyo para usar
                  FLORGAERFRA de forma fácil.
                </p>

                {/* VIDEO */}
                <div className="video-box">
                  <div className="video-thumb">
                    <div className="play-btn">▶</div>
                  </div>
                </div>

                {/* DIAGRAMA */}
                <div className="diagram-card">
                  <img src="/diagrama.png" alt="Esquema App" />
                  <p className="caption">
                    Esquema general del funcionamiento de la aplicación.
                  </p>
                </div>

              </section>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;