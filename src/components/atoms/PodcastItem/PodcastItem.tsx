import { type FC } from 'react';

interface PodcastItemProps {
  author: string;
  imageUrl: string;
  title: string;
}

const PodcastItem: FC<PodcastItemProps> = ({ imageUrl, title, author }) => {
  return (
    <div className='podcast-item'>
      <div className='podcast-item__space'></div>
      <div className='podcast-item__content'>
        <img
          src={imageUrl}
          alt={title}
          className='podcast-item__image'
        />
        <h3 className='podcast-item__title'>{title}</h3>
        <span className='podcast-item__author'>{`Author: ${author}`}</span>
      </div>
    </div>
  );
};

export default PodcastItem;
