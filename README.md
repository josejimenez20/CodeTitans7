# FLORGAERFRA - Aplicación de Jardines Personalizados (Proyecto CodeTitans7)

FLORGAERFRA es una aplicación web de pila completa diseñada como un asistente inteligente para la jardinería. El propósito principal del proyecto es ayudar a los usuarios a descubrir y seleccionar las plantas que mejor se adapten a su entorno específico, basándose en su ubicación geográfica y preferencias personales.

La aplicación ofrece recomendaciones de plantas filtrando por condiciones como el clima, el tipo de suelo y la exposición a la luz solar, asegurando que el usuario obtenga la mejor guía para su jardín.
---

## 🛠️ Stack Tecnológico

Este proyecto está construido usando una arquitectura moderna de frontend y backend.

### Backend 
Para correrlo se nececita pnpm run start:dev

* **Lenguaje:** TypeScript
* **Framework:** NestJS
* **Base de Datos:** MongoDB (con Mongoose como ODM)
* **Autenticación:** Passport.js (implementando estrategias de JWT, Google OAuth y Local)
* **Manejo de Archivos:** AWS S3 (para almacenamiento de fotos de perfil y progreso)
* **Servicio de Correo:** Nodemailer
* **Validación:** Class-validator

### Frontend 
Para correrlo se nececita pnpm run dev

* **Lenguaje:** JavaScript (JSX)
* **Framework/Librería:** React (con Hooks y Context API)
* **Bundler:** Vite
* **Enrutamiento (Routing):** React Router DOM
* **Cliente HTTP:** Axios
* **Notificaciones:** React Hot Toast
