import React, { useState, useRef, useEffect } from "react";
import "../styles/ChatFlotante.css";

export default function ChatFlotante() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      tipo: "bot",
      texto: "¡Hola! Soy tu asistente virtual de FLORGAERFRA. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const mensajesEndRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (mensajesEndRef.current) {
      mensajesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes, escribiendo]);

  const toggleChat = () => {
    setAbierto(!abierto);
  };

  const enviarMensaje = async () => {
    if (!inputText.trim()) return;

    // Agregar mensaje del usuario
    const nuevoMensajeUsuario = {
      id: Date.now(),
      tipo: "usuario",
      texto: inputText,
      timestamp: new Date()
    };

    setMensajes(prev => [...prev, nuevoMensajeUsuario]);
    setInputText("");
    setEscribiendo(true);

    // Simular respuesta del bot (reemplazar con tu API real)
    setTimeout(async () => {
      try {
        // TODO: Reemplazar con tu endpoint de chatbot
        // const response = await fetch("/api/chatbot", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ mensaje: inputText })
        // });
        // const data = await response.json();

        // Respuesta simulada
        const respuestaBot = {
          id: Date.now(),
          tipo: "bot",
          texto: obtenerRespuestaSimulada(inputText),
          timestamp: new Date()
        };

        setMensajes(prev => [...prev, respuestaBot]);
        setEscribiendo(false);
      } catch (error) {
        console.error("Error al obtener respuesta:", error);
        setEscribiendo(false);
      }
    }, 1500);
  };

  // Función simulada de respuestas (reemplazar con NLP real)
  const obtenerRespuestaSimulada = (texto) => {
    const textoLower = texto.toLowerCase();
    
    if (textoLower.includes("riego") || textoLower.includes("regar")) {
      return "El riego depende del tipo de planta. En general, es mejor regar cuando la tierra esté seca al tacto. ¿Qué tipo de planta tienes?";
    } else if (textoLower.includes("luz") || textoLower.includes("sol")) {
      return "La cantidad de luz necesaria varía según la especie. ¿Tu planta está en interior o exterior?";
    } else if (textoLower.includes("plaga") || textoLower.includes("insecto")) {
      return "Las plagas comunes incluyen pulgones, cochinillas y ácaros. ¿Podrías describirme qué ves en tu planta?";
    } else {
      return "Interesante pregunta. ¿Podrías darme más detalles para ayudarte mejor?";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  return (
    <>
      {/* Botón Flotante */}
      <button
        className={`chat-boton-flotante ${abierto ? "oculto" : ""}`}
        onClick={toggleChat}
        aria-label="Abrir chat"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Contenedor del Chat */}
      {abierto && (
        <div className="chat-contenedor">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar-bot-header">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3 className="chat-titulo">Asistente Virtual</h3>
            </div>
            <button className="chat-boton-cerrar" onClick={toggleChat} aria-label="Cerrar chat">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="chat-mensajes">
            {mensajes.map((mensaje) => (
              <div
                key={mensaje.id}
                className={`chat-mensaje ${mensaje.tipo === "usuario" ? "usuario" : "bot"}`}
              >
                {mensaje.tipo === "bot" && (
                  <div className="chat-avatar-bot">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                )}
                <div className="chat-burbuja">
                  <p className="chat-texto">{mensaje.texto}</p>
                </div>
              </div>
            ))}

            {/* Indicador de "Escribiendo..." */}
            {escribiendo && (
              <div className="chat-mensaje bot">
                <div className="chat-avatar-bot">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="chat-burbuja">
                  <div className="chat-escribiendo">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={mensajesEndRef} />
          </div>

          {/* Área de Entrada */}
          <div className="chat-input-zona">
            <input
              type="text"
              className="chat-input"
              placeholder="Escribe tu duda aquí..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className={`chat-boton-enviar ${inputText.trim() ? "activo" : ""}`}
              onClick={enviarMensaje}
              disabled={!inputText.trim()}
              aria-label="Enviar mensaje"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}