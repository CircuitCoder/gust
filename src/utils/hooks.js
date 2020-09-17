import { useEffect } from 'react';

export function useTitle(title) {
  useEffect(() => {
    if(title !== null)
      document.title = `${title} | 风的重构`;
  }, [title]);
}
