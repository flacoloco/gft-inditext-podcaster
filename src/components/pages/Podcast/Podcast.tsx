import { useEffect, useState, type FC } from 'react';
import { useParams } from 'react-router-dom';
import { EpisodesList, PodcastCard } from '@src/components/molecules';
import { useData } from '@src/hooks/useData';
import { Header } from '@src/components/atoms';
import { StyledPodcastContainer } from './Podcast.styles';
import { formatDate } from '@src/helpers';
import { useAppContext } from '@src/contexts';

type resultType = {
  contents: string;
};

type episodeType = {
  trackName: string;
  trackTimeMillis: number;
  releaseDate: string;
};

export const Podcast: FC = () => {
  // get id from url params
  const { podcastId } = useParams<{ podcastId: string }>();
  const [data, error, isLoading] = useData<resultType>(podcastId);
  const [podcastEpisodes, setPodcastEpisodes] = useState<episodeType[] | null>(null);
  const { currentPodcast } = useAppContext();

  console.log('Current Podcast from context:', currentPodcast);

  useEffect(() => {
    if (data) {
      try {
        const parsedContents = JSON.parse(data.contents);
        const episodes = parsedContents.results.slice(1);
        const episodesData = episodes.map((episode: episodeType) => ({
          trackName: episode.trackName,
          trackTimeMillis: episode.trackTimeMillis,
          releaseDate: formatDate(episode.releaseDate),
        }));
        setPodcastEpisodes(episodesData);
        console.log('episodes:', episodes);
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
    <StyledPodcastContainer>
      <Header isLoading={isLoading} />
      {data && (
        <>
          <PodcastCard
            author={currentPodcast ? currentPodcast.author : 'Unknown Author'}
            image={currentPodcast ? currentPodcast.imageUrl : 'https://via.placeholder.com/150'}
            title={currentPodcast ? currentPodcast.title : 'No title available.'}
            description={currentPodcast ? currentPodcast.description : 'No description available.'}
            onClick={() => console.log(`Podcast ${podcastId} clicked`)}
          />
          {podcastEpisodes && podcastEpisodes.length > 0 && (
            <EpisodesList episodes={podcastEpisodes} />
          )}
        </>
      )}
    </StyledPodcastContainer>
  );
};
