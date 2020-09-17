import { useEffect } from "react";

export function useTitle(title) {
  useEffect(() => {
    document.title = `${title} | 风的重构`;
  }, [title]);
}
