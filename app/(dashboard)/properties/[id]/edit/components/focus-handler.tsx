'use client';
import { useEffect, useRef } from 'react';

interface FocusHandlerProps {
  focus?: string;
}

export default function FocusHandler({ focus }: FocusHandlerProps) {
  const hasScrolled = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 10;

  useEffect(() => {
    if (focus && !hasScrolled.current) {
      const scrollToElement = () => {
        const element = document.getElementById(`${focus}-section`);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          hasScrolled.current = true;
          retryCount.current = 0;
        } else if (retryCount.current < maxRetries) {
          retryCount.current++;
          requestAnimationFrame(scrollToElement);
        } else {
          retryCount.current = 0;
        }
      };

      // Start with a small delay to ensure hydration is complete
      const timer = setTimeout(() => {
        requestAnimationFrame(scrollToElement);
      }, 100);

      return () => {
        clearTimeout(timer);
        hasScrolled.current = false;
        retryCount.current = 0;
      };
    }
  }, [focus]);

  return null;
}
