import { useState, useEffect, useCallback } from "react";

export function useScrollSpy(
  sectionIds: string[],
  containerRef?: React.RefObject<HTMLElement>,
  options?: { offset?: number }
) {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] || null);

  const handleScroll = useCallback(() => {
    if (sectionIds.length === 0) return;

    const container = containerRef?.current;
    const offset = options?.offset || 100;

    let currentSection = sectionIds[0];

    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const containerRect = container?.getBoundingClientRect();
        
        // Calculate position relative to container or viewport
        const elementTop = container 
          ? rect.top - (containerRect?.top || 0)
          : rect.top;
        
        // If section top is above the offset, this is the active section
        if (elementTop <= offset) {
          currentSection = id;
        }
      }
    }

    setActiveId(currentSection);
  }, [sectionIds, containerRef, options?.offset]);

  useEffect(() => {
    const container = containerRef?.current;
    const target = container || window;

    // Run immediately to set initial state
    handleScroll();

    target.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      target.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, containerRef]);

  return activeId;
}
