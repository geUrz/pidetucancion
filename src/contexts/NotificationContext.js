// contexts/NotificationContext.js
import { useRouter } from 'next/router';
import { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
}

export const NotificationProvider = ({ children }) => {

  const route = useRouter()

  const [notifications, setNotifications] = useState([]);

  const showNotification = (title, body) => {
    if (typeof window !== "undefined") {
      if (Notification.permission === "granted") {
        // Permiso concedido, mostrar la notificación
        const notification = new Notification(title, {
          body: body,
          icon: '/path/to/icon.png',
        });
  
        notification.onclick = () => {
          route.push('/cancionesenfila');
        };
      } else if (Notification.permission !== "denied") {
        // Si el permiso no está denegado, solicita permiso
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            const notification = new Notification(title, {
              body: body,
              icon: '/path/to/icon.png',
            });
  
            notification.onclick = () => {
              route.push('/cancionesenfila');
            };
          }
        });
      }
    }
  
    // Agregar notificación al estado (si deseas manejarla en el estado también)
    setNotifications(prevNotifications => [
      ...prevNotifications,
      { title, body }
    ]);
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
