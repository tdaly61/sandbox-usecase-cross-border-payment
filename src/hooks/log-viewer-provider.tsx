import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LogViewerContextProps {
  isLogViewerOpen: boolean;
  toggleLogViewer: () => void;
}

const LogViewerContext = createContext<LogViewerContextProps | undefined>(undefined);

export const LogViewerProvider = ({ children }: { children: ReactNode }) => {
  const [isLogViewerOpen, setIsLogViewerOpen] = useState(false);

  const toggleLogViewer = () => {
    setIsLogViewerOpen((prev) => !prev);
  };

  return (
    <LogViewerContext.Provider value={{ isLogViewerOpen, toggleLogViewer }}>
      {children}
    </LogViewerContext.Provider>
  );
};

export const useLogViewer = () => {
  const context = useContext(LogViewerContext);
  if (!context) {
    throw new Error('useLogViewer must be used within a LogViewerProvider');
  }
  return context;
};
