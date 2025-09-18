import { useEffect, useState, type FC } from 'react';
import { useParams } from 'react-router-dom';
import { PodcastCard } from '@src/components/molecules';
import { useData } from '@src/hooks/useData';
import { Header } from '@src/components/atoms';

type resultType = {
  contents: string;
};

type podcastDetailType = {
  artistName: string;
  feedUrl: string;
};

export const Podcast: FC = () => {
  // get id from url params
  const { podcastId } = useParams<{ podcastId: string }>();
  const [data, error, isLoading] = useData<resultType>(podcastId);
  const [podcastDetails, setPodcastDetails] = useState<podcastDetailType | null>(null);

  useEffect(() => {
    if (data) {
      try {
        const parsedContents = JSON.parse(data.contents);
        // setPodcastDetails(parsedContents.results[0]);
        console.log('parsedContents:', parsedContents);
      } catch (e) {
        console.error('Failed to parse contents:', e);
      }
    }
  }, [data]);

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
          title={`Podcast Title for ID: ${podcastId}`}
          description='This is a description of the podcast. It provides an overview of the content and themes discussed in the episodes.'
          onClick={() => console.log(`Podcast ${podcastId} clicked`)}
        />
      )}
    </div>
  );
};
