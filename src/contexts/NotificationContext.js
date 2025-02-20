import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const NotificationContext = createContext()

const socket = io('http://localhost:3004') // Asegúrate de que la URL sea correcta

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(null);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [canciones, setCanciones] = useState([]);

  useEffect(() => {
    // Escuchar eventos de notificaciones y canciones
    socket.on('notification', (data) => {
      setShowNotification({ message: data.message, details: data.details });
      setHasNewNotification(true);
    });

    socket.on('nuevaCancion', (nuevaCancion) => {
      setCanciones((prevCanciones) => [...prevCanciones, nuevaCancion]);
      // Activar la notificación cuando se agrega una nueva canción
      setShowNotification({
        message: 'Nueva canción añadida',
        details: nuevaCancion.nombre || 'Sin nombre',
      });
      setHasNewNotification(true); // Activa el estado para mostrar el modal
    });

    return () => {
      socket.off('notification');
      socket.off('nuevaCancion');
    };
  }, []);

  const resetNotification = () => {
    setShowNotification(null);
    setHasNewNotification(false);
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, hasNewNotification, canciones, socket, resetNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
