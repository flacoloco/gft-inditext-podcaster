import { createContext, useState, type FC, type ReactNode } from 'react';

export interface PodcastType {
  'im:artist': string;
  'im:name': string;
  'im:image': string;
  summary: string;
  title: string;
  id: string;
}

export interface ApiContextType {
  podcasts: PodcastType[] | null;
  setPodcasts: (podcast: PodcastType[] | null) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const AppProvider: FC<ApiProviderProps> = ({ children }) => {
  const [podcasts, setPodcasts] = useState<PodcastType[] | null>(null);

  const value: ApiContextType = {
    podcasts,
    setPodcasts,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
