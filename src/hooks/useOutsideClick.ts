import { useEffect, RefObject } from 'react';

/**
 * Hook personalizado que detecta clics fuera del elemento referenciado
 * y ejecuta una función callback cuando ocurren.
 * 
 * @param ref - Referencia al elemento que queremos monitorear
 * @param callback - Función a ejecutar cuando se detecta un clic fuera del elemento
 * @param enabled - Bandera para habilitar o deshabilitar el hook (por defecto true)
 */
const useOutsideClick = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;
    
    const handleMouseDown = (event: MouseEvent) => {
      // Si el clic fue fuera del elemento referenciado, ejecuta el callback
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Agrega el event listener al documento
    document.addEventListener('mousedown', handleMouseDown);
    
    // Limpia el event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [ref, callback, enabled]); // Re-ejecuta el efecto si cambian estas dependencias
};

export default useOutsideClick; 