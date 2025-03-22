import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to handle shadows on the sides of a container with horizontal scroll.
 * Dynamically shows shadows when there is content to scroll in each direction.
 * 
 * @returns An object with the element reference and shadow visibility states
 */
export default function useScrollShadow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState<boolean>(false);
  const [showRightShadow, setShowRightShadow] = useState<boolean>(true);

  // Update shadow states based on scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftShadow(scrollLeft > 20);
      setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  // Set up listeners and initial state
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      // Initialize state
      handleScroll();
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return {
    scrollRef,
    showLeftShadow,
    showRightShadow
  };
} 