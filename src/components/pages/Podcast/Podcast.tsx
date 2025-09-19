import { useEffect, useMemo, useState, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EpisodesList, PodcastCard } from '@src/components/molecules';
import { usePodcastData } from '@src/hooks';
import { Header } from '@src/components/atoms';
import { StyledPodcastContainer } from './Podcast.styles';
import { formatDate } from '@src/helpers';
import type { PodcastItemProps } from '@src/hooks/usePodcastListData';
import type { Episode } from '@src/components/molecules/EpisodesList/EpisodesList';

export const Podcast: FC = () => {
  // get id from url params
  const { podcastId = '' } = useParams<{ podcastId: string }>();
  const [data, error, isLoading] = usePodcastData(podcastId);
  const [podcastEpisodes, setPodcastEpisodes] = useState<Episode[] | null>(null);
  const podcastsList = useMemo(() => localStorage.getItem('podcastListData') ? JSON.parse(localStorage.getItem('podcastListData') || '[]') : null, []);
  const navigate = useNavigate();
  const [currentPodcast, setCurrentPodcast] = useState<PodcastItemProps | undefined>(undefined);

  useEffect(() => {
    if (podcastsList && podcastId) {
      const foundPodcast = podcastsList.podcasts.filter((p: PodcastItemProps) => p.id === podcastId)[0];
      setCurrentPodcast(foundPodcast);
    }
  }, [podcastsList, podcastId]);

  useEffect(() => {

    if (data) {
      try {
        console.log('Episodes data:', data);
        const episodesData = data.map((episode: Episode) => ({
          trackId: episode.trackId,
          trackName: episode.trackName,
          trackTimeMillis: episode.trackTimeMillis,
          releaseDate: formatDate(episode.releaseDate),
        }));
        setPodcastEpisodes(episodesData);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse contents:', e);
      }
    }
  }, [data]);

  if (!podcastsList) {
    navigate('/');
    return null;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
    return null;
  }


  return (
    <StyledPodcastContainer>
      <Header isLoading={isLoading} />
      {currentPodcast && (
        <>
          <PodcastCard
            author={currentPodcast['im:artist']}
            image={currentPodcast['im:image']}
            title={currentPodcast['im:name']}
            description={currentPodcast.summary}
          />
          {podcastEpisodes && podcastEpisodes.length > 0 && (
            <EpisodesList
              episodes={podcastEpisodes}
              onEpisodeClick={(episode) => navigate(`/podcast/${podcastId}/episode/${episode.trackId}`)}
            />
          )}
        </>
      )}
    </StyledPodcastContainer>
  );
};
