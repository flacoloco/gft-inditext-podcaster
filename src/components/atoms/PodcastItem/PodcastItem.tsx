import { type FC } from 'react';

interface PodcastItemProps {
    imageUrl: string;
    title: string;
}

const PodcastItem: FC<PodcastItemProps> = ({ imageUrl, title }) => {
    return (
        <div className="podcast-item">
            <img
                src={imageUrl}
                alt={title}
                className="podcast-item__image"
            />
            <h3 className="podcast-item__title">{title}</h3>
        </div>
    );
};

export default PodcastItem;
