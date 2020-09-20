import { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';

export function useTitle(match, gen) {
  const matched = useRouteMatch(match);
  useEffect(() => {
    if (matched) {
      const title = gen(matched);
      console.log(title);
      document.title = `${title} | 风的重构`;
    }
  }, [matched, gen]);
}
