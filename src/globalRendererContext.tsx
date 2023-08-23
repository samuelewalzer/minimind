// GlobalRerenderContext.tsx

import React, { createContext, useContext, useMemo, useState } from "react";
import { FCC } from "./components/@def";

interface GlobalRerenderContextType {
  triggerRerender: () => void;
  rerenderToken: number;

  toggleRerender: () => void;
  rerenderToggle: number;
}

const GlobalRerenderContext = createContext<GlobalRerenderContextType | undefined>(undefined);

export const useGlobalRerender = () => {
  const context = useContext(GlobalRerenderContext);
  if (!context) {
    throw new Error("useGlobalRerender must be used within a GlobalRerenderProvider");
  }
  return context;
};

export const GlobalRerenderProvider: FCC<GlobalRerenderContextType> = ({ children }) => {
  const [rerenderToken, setRerenderToken] = useState(0);
  const triggerRerender = () => {
    setRerenderToken(prev => prev + 1);
  };
  
  const [rerenderToggle, setRerenderToggle] = useState(0);
  const toggleRerender = () => {
    setRerenderToggle(prev => prev + 1);
  };

  const providerValue: GlobalRerenderContextType = useMemo(() => ({
    triggerRerender,
    rerenderToken,
    toggleRerender,
    rerenderToggle
    
  }), [rerenderToken, rerenderToggle]);

  return (
    <GlobalRerenderContext.Provider value={providerValue}>
      {children}
    </GlobalRerenderContext.Provider>
  );
};
