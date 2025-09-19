import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { HeaderContainer } from './Header.styles';
import { Loading } from '../Loading/Loading';

export const Header: FC<{ isLoading?: boolean }> = ({ isLoading }) => {
  return (
    <HeaderContainer>
      <Link to='/'>
        Podcaster
      </Link>
      <Loading isLoading={isLoading} />
    </HeaderContainer>
  );
};

