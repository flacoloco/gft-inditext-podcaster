import { type FC, type ReactNode } from 'react';
import { Header } from '../../atoms';
import { StyledLayout, StyledMain } from './Layout.styles';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <Header />
      <StyledMain>
        {children}
      </StyledMain>
    </StyledLayout>
  );
};

export default Layout;
