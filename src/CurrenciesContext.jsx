import { createContext } from "react";

export const CurrencyListContext = createContext(null);
export const CurrencyListDispatchContext = createContext(null);
export const LastTimeUpdatedContext = createContext({
    lastUpdated: null,
    setLastUpdated: () => {},
  });

