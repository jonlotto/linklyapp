import { useState, useEffect, useRef } from "react";

export function useScrollSpy(
  sectionIds: string[],
  containerRef?: React.RefObject<HTMLElement>,
  options?: { offset?: number }
) {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] || null);
  const offsetRef = useRef(options?.offset ?? 100);
  
  // Update offset ref when it changes
  useEffect(() => {
    offsetRef.current = options?.offset ?? 100;
  }, [options?.offset]);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const handleScroll = () => {
      const container = containerRef?.current;
      const offset = offsetRef.current;

      let currentSection = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const containerRect = container?.getBoundingClientRect();
          
          const elementTop = container 
            ? rect.top - (containerRect?.top || 0)
            : rect.top;
          
          if (elementTop <= offset) {
            currentSection = id;
          }
        }
      }

      setActiveId(currentSection);
    };

    const container = containerRef?.current;
    const target = container || window;

    handleScroll();
    target.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      target.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds, containerRef]);

  return activeId;
}
