import { type FC, type ReactNode } from 'react';
import { Header } from '@src/components/atoms';
import { StyledLayout, StyledMain } from './Layout.styles';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <Header />
      <StyledMain>
        {children}
      </StyledMain>
    </StyledLayout>
  );
};

