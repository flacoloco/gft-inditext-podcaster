import { type FC } from 'react';
import { useData } from '../../../hooks/useData';
import { PodcastItem } from '../../atoms';

type listType = {
  contents: string
};

type podcastType = {
  'im:artist': { label: string };
  'im:name': { label: string };
  'im:image': { label: string }[];
  summary: { label: string };
  title: { label: string };
  id: { attributes: { 'im:id': string } };
};
export const Home: FC = () => {

  const [data, error, isLoading] = useData<listType>('https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json');

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data) {
    const contents = JSON.parse(data.contents);
    return (
      <div className='podcasts-container'>
        {contents.feed?.entry?.map((item: podcastType) => (
          <PodcastItem
            key={item.id.attributes['im:id']}
            author={item['im:artist'].label}
            imageUrl={item['im:image'][0].label}
            title={item.title.label}
          />
        ))}
      </div>
    );
  }
  return null;
};
