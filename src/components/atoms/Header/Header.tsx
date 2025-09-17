import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { HeaderContainer } from './Header.styles';

const Header: FC = () => {
  return (
    <HeaderContainer>
      <Link to='/'>
        Podcaster
      </Link>
    </HeaderContainer>
  );
};

export default Header;
