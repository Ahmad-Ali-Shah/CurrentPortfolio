'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

interface VisitorContextType {
  visitorName: string;
  setVisitorName: (name: string) => void;
  nameSubmitted: boolean;
  submitName: (name: string) => void;
}

const VisitorContext = createContext<VisitorContextType>({
  visitorName: '',
  setVisitorName: () => {},
  nameSubmitted: false,
  submitName: () => {},
});

export const VisitorProvider = ({ children }: { children: React.ReactNode }) => {
  const [visitorName, setVisitorName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);

  const submitName = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed) {
      setVisitorName(trimmed);
      setNameSubmitted(true);
    }
  }, []);

  return (
    <VisitorContext.Provider value={{ visitorName, setVisitorName, nameSubmitted, submitName }}>
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitor = () => useContext(VisitorContext);
