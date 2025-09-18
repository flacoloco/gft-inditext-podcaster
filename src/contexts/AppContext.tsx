import { createContext, useState, type FC, type ReactNode } from 'react';

export interface CurrentPodcast {
  id: string;
  description: string;
}

export interface ApiContextType {
  currentPodcast: CurrentPodcast | null;
  setCurrentPodcast: (podcast: CurrentPodcast | null) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const AppProvider: FC<ApiProviderProps> = ({ children }) => {
  const [currentPodcast, setCurrentPodcast] = useState<CurrentPodcast | null>(null);

  const value: ApiContextType = {
    currentPodcast,
    setCurrentPodcast,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
