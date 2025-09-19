import { type FC } from 'react';
import { StyledLoadingSpinner } from './Loading.styles';

interface LoadingProps {
  isLoading?: boolean;
}

export const Loading: FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', top: '0px', right: '10px' }}>
      <StyledLoadingSpinner />
    </div>
  );
};
