import { createContext, useState, useContext, useCallback } from "react"; // <-- IMPORTAR useCallback
import api from "../shared/api";

const AuthContext = createContext(undefined);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- INICIO DE CORRECCIÓN (Estabilizar funciones) ---
  const fetchUserData = useCallback(async () => {
    try {
      const response = await api.get("/users/me");
      const data = response.data;
      if (data.error) {
        throw new Error("Failed to fetch user data");
      }
      setUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
    } catch (error) {
      console.error("Fetch user data error:", error);
      // No limpiar el usuario si ya existe
      if (!localStorage.getItem("currentUser")) {
        setUser(null);
      }
    }
  }, []); // Array de dependencias vacío

  const updateUserMunicipio = useCallback(async (userId, municipioId) => {
    try {
      await api.put(`/users/${userId}`, { municipio: municipioId });
      // ¡Importante! Llamamos a la versión estable de fetchUserData
      await fetchUserData(); 
    } catch (error) {
      console.error('Error updating user municipio:', error);
      throw error.response?.data || new Error("Error al actualizar la ubicación");
    }
  }, [fetchUserData]); // Depende de fetchUserData
  // --- FIN DE CORRECCIÓN ---


  const updateUserPicture = useCallback(async (file, userId) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      await api.put(`/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Llamamos a la versión estable para recargar
      await fetchUserData();
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  }, [fetchUserData]); // Depende de fetchUserData

  const loginGoogle = async () => {
    const googleAuthUrl = 'http://localhost:3000/auth/google';
    window.location.href = googleAuthUrl;
  };

  const checkAuth = useCallback(async () => { // <-- También estabilizado
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetchUserData(); // Usamos la función estable
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  }, [fetchUserData]);

  const login = async (userData) => {
    try {
      const response = await api.post("/auth/login", userData);
      const data = response.data;

      if (data.message !== "Login successful") {
        throw new Error("Login failed");
      }

      await fetchUserData(); // Usamos la función estable
      const updatedUser = JSON.parse(localStorage.getItem("currentUser"));
      return updatedUser;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/users", userData);
      const data = response.data;
      setUser(data);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("accessToken");
    setUser(null);
  }

  const changePassword = async (userData) => {
    try {
      const response = await api.post("/auth/change-password", userData);
      const data = response.data;
      return data;
    } catch (e) {
      console.error("Error al cambiar password", e);
      throw e;
    }
  };

  const changeEmail = async (userData) => {
    try {
      const response = await api.post("/auth/change-email", userData);
      const data = response.data;
      return data;
    } catch (e) {
      console.error("Error al cambiar email", e);
      throw e;
    }
  };
  
  const updateUserName = useCallback(async (userId, newName) => {
    try {
      await api.put(`/users/${userId}`, { name: newName });
      await fetchUserData(); 
    } catch (error) {
      console.error('Error updating user name:', error);
      throw error.response?.data || new Error("Error al actualizar el nombre");
    }
  }, [fetchUserData]);

  const deleteAccount = async (id) => {
    try {
      const response = await api.delete(`/auth/delete-account/${id}`);
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error al eliminar cuenta", error);
      throw error;
    }
  };

  const loginStepOne = async (userData) => {
    try {
      const response = await api.post("/auth/login-step-one", userData);
      const data = response.data;

      if (!data) {
        throw new Error("Step one failed");
      }
      localStorage.setItem("idLoginStepOne", JSON.stringify(data.userId));
      return data;
    } catch (error) {
      console.error("Login step one error:", error);
      throw error;
    }
  };

  const loginStepTwo = async (userData) => {
    try {
      const response = await api.post("/auth/login-step-two", userData);
      const data = response.data;

      if (data.message !== "Login successful") {
        throw new Error("Login failed");
      }

      await fetchUserData(); // Usamos la función estable
      const updatedUser = JSON.parse(localStorage.getItem("currentUser"));
      return updatedUser;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  
  const forgotPassword = async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error.response?.data?.message || "Error al solicitar restablecimiento";
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error.response?.data?.message || "Error al restablecer contraseña";
    }
  };

  // --- Funciones de Progreso (envueltas también) ---
  const getProgreso = useCallback(async () => {
    try {
      const response = await api.get('/progreso');
      return response.data.images || [];
    } catch (error) {
      console.error("Error obteniendo progreso:", error);
      throw error.response?.data || new Error("Error al cargar el progreso");
    }
  }, []);

  const uploadProgreso = useCallback(async (formData, onUploadProgress, cancelSignal) => {
    try {
      const response = await api.post('/progreso/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
        signal: cancelSignal,
      });
      return response.data;
    } catch (error) {
      console.error("Error subiendo fotos:", error);
      throw error.response?.data || new Error("Error al subir fotos");
    }
  }, []);

  const deleteProgresoFoto = useCallback(async (imageId) => {
    try {
      const response = await api.delete(`/progreso/image/${imageId}`);
      return response.data;
    } catch (error) {
      console.error("Error eliminando foto:", error);
      throw error.response?.data || new Error("Error al eliminar la foto");
    }
  }, []);

  const updateFotoPrivacy = useCallback(async (imageId, newPrivacy) => {
    try {
      const response = await api.patch(`/progreso/image/${imageId}/privacy`, {
        privacy: newPrivacy,
      });
      return response.data;
    } catch (error) {
      console.error("Error actualizando privacidad:", error);
      throw error.response?.data || new Error("Error al actualizar la privacidad");
    }
  }, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        fetchUserData,
        changePassword,
        changeEmail,
        deleteAccount,
        loginStepOne,
        loginStepTwo,
        loginGoogle,
        checkAuth,
        updateUserPicture,
        forgotPassword, 
        resetPassword,
        updateUserName,
        updateUserMunicipio,
        getProgreso,
        uploadProgreso,
        deleteProgresoFoto,
        updateFotoPrivacy
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};