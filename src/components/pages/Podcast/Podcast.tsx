import { type FC } from 'react';
import { useParams } from 'react-router-dom';
import { PodcastCard } from '@src/components/molecules';
import { useData } from '@src/hooks/useData';
import { Header } from '@src/components/atoms';

type podcastType = {
  'im:artist': { label: string };
  'im:name': { label: string };
  'im:image': { label: string }[];
  summary: { label: string };
  title: { label: string };
  id: { attributes: { 'im:id': string } };
};

export const Podcast: FC = () => {
  // get id from url params
  const { id } = useParams<{ id: string }>();
  console.log('PodcastId:', id);
  const [data, error, isLoading] = useData<podcastType>(`https://itunes.apple.com/lookup?id=${id}&media=podcast
&entity=podcastEpisode&limit=20`);

  if (error) {
    console.error(error.message);
    return null;
  }


  return (
    <div>
      <Header isLoading={isLoading} />
      {data && (
        <PodcastCard
          image='https://example.com/podcast-image.jpg'
          title={`Podcast Title for ID: ${id}`}
          description='This is a description of the podcast. It provides an overview of the content and themes discussed in the episodes.'
          onClick={() => console.log(`Podcast ${id} clicked`)}
        />
      )}
    </div>
  );
};
