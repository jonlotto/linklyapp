import { useState, useEffect } from "react";

export function useScrollSpy(
  sectionIds: string[],
  containerRef?: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] || null);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const observerOptions: IntersectionObserverInit = {
      threshold: 0.3,
      rootMargin: "-10% 0px -60% 0px",
      root: containerRef?.current || null,
      ...options,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, containerRef, options]);

  return activeId;
}
