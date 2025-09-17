import { type FC } from 'react';
import { Link } from 'react-router-dom';

const HomeTitle: FC = () => {
  return (
    <div className='home-title-container'>
      <Link to='/' className='home-title'>
        Podcaster
      </Link>
      <hr />
    </div>
  );
};

export default HomeTitle;
