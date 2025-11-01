// src/views/GoogleCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
// import api from '../shared/api';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUserData } = useAuth(); 

  useEffect(() => {
    const processGoogleCallback = async () => {
      try {
        const accessToken = searchParams.get('accessToken');
        const success = searchParams.get('success');
        // --- ¡AQUÍ CAPTURAMOS EL NUEVO FLAG! ---
        const isNewUser = searchParams.get('isNewUser') === 'true';

        if (accessToken && success === 'true') {
          localStorage.setItem('accessToken', accessToken);

          try {
            await fetchUserData(); // Carga los datos del usuario en el contexto
          } catch (error) {
            console.log(error);
          }
          if (isNewUser) {
            // Si es nuevo, lo mandamos a elegir sus preferencias/ubicación
            toast.success('¡Bienvenido! Por favor, configura tus preferencias.');
            navigate('/preferencias', { replace: true });
          } else {
            // Si ya existía, lo mandamos al dashboard
            navigate('/dashboard', { replace: true });
          }
        } else {
          // Si no hay token, hubo un error
          navigate('/login?error=google_auth_failed');
        }
      } catch (error) {
        console.error( error);
        navigate('/login?error=auth_failed');
      }
    };

    processGoogleCallback();
  }, [searchParams, navigate, fetchUserData]);

  return (
    <div>
      <h2>Procesando autenticación...</h2>
      <p>Por favor espera mientras te redirigimos.</p>
    </div>
  );
}