// src/hooks/useToast.js
import { useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  };

  return { toasts, toast };
}
