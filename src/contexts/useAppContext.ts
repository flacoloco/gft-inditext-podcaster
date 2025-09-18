import { useContext } from 'react';
import { AppContext, type ApiContextType } from './AppContext';

export const useAppContext = (): ApiContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
};
