import { createContext, useContext } from "react";

export const ScrollContext = createContext({
  lenis: null,
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(ScrollContext);
}
