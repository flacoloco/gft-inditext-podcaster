import { type FC } from 'react';
import { Link } from 'react-router-dom';

const HomeTitle: FC = () => {
  return (
    <Link to="/" className="home-title">
      Podcaster
    </Link>
  );
};

export default HomeTitle;
