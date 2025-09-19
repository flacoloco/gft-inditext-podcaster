import { useEffect, useMemo, useState, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EpisodesList, PodcastCard } from '@src/components/molecules';
import { usePodcastData } from '@src/hooks';
import { Header } from '@src/components/atoms';
import { StyledEpisodesContainer, StyledPodcastContainer } from './Podcast.styles';
import { formatDate } from '@src/helpers';
import type { PodcastItemProps } from '@src/hooks/usePodcastListData';
import type { Episode } from '@src/components/molecules/EpisodesList/EpisodesList';

export const Podcast: FC = () => {
  const { podcastId = '' } = useParams<{ podcastId: string }>();
  const [data, error] = usePodcastData(podcastId);
  const [podcastEpisodes, setPodcastEpisodes] = useState<Episode[] | null>(null);
  const podcastsList = useMemo(() => localStorage.getItem('podcastListData') ? JSON.parse(localStorage.getItem('podcastListData') || '[]') : null, []);
  const navigate = useNavigate();
  const [currentPodcast, setCurrentPodcast] = useState<PodcastItemProps | undefined>(undefined);

  useEffect(() => {
    if (!podcastsList) {
      navigate('/');
    }
  }, [podcastsList, navigate]);

  useEffect(() => {
    if (podcastsList && podcastId) {
      const foundPodcast = podcastsList.podcasts.find((p: PodcastItemProps) => p.id === podcastId);
      setCurrentPodcast(foundPodcast);
    }
  }, [podcastsList, podcastId]);

  useEffect(() => {

    if (data) {
      try {
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

  return (
    <StyledPodcastContainer>
      <Header isLoading={data === null} />
      {!error && currentPodcast && (
        <>
          <PodcastCard
            author={currentPodcast['im:artist']}
            description={currentPodcast.summary}
            image={currentPodcast['im:image']}
            title={currentPodcast['im:name']}
          />
          {podcastEpisodes && podcastEpisodes.length > 0 && (
            <StyledEpisodesContainer>
              <EpisodesList
                episodes={podcastEpisodes}
                onEpisodeClick={(episode) => navigate(`/podcast/${podcastId}/episode/${episode.trackId}`)}
              />
            </StyledEpisodesContainer>
          )}
        </>
      )
      }
    </StyledPodcastContainer >
  );
};
