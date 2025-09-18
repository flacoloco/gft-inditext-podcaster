import { type FC, type ReactNode } from 'react';
import { StyledLayout, StyledMain } from './Layout.styles';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <StyledMain>
        {children}
      </StyledMain>
    </StyledLayout>
  );
};

