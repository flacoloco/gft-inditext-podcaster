import { useEffect, useMemo, useState, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@src/components/atoms';
import { EpisodeCard, PodcastCard } from '@src/components/molecules';
import type { PodcastItemProps } from '@src/hooks/usePodcastListData';
import { StyledEpisodeContainer } from './Episode.styles';

type Episode = {
  trackId: number;
  trackName: string;
  description: string;
  episodeUrl: string;
};

export const Episode: FC = () => {
  const { podcastId = '', episodeId = '' } = useParams<{ podcastId: string; episodeId: string }>();
  const podcastsList = useMemo(() => localStorage.getItem('podcastListData') ? JSON.parse(localStorage.getItem('podcastListData') || '[]') : null, []);
  const episodesList = useMemo(() => localStorage.getItem(`podcastData_${podcastId}`) ? JSON.parse(localStorage.getItem(`podcastData_${podcastId}`) || '[]') : null, [podcastId]);
  const [currentPodcast, setCurrentPodcast] = useState<PodcastItemProps | undefined>(undefined);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (!podcastsList || !episodesList) {
      navigate('/');
    }
  }, [podcastsList, episodesList, navigate]);

  useEffect(() => {
    if (podcastsList && podcastId) {
      const foundPodcast = podcastsList.podcasts.find((p: PodcastItemProps) => p.id === podcastId);
      setCurrentPodcast(foundPodcast);
    }
  }, [podcastsList, podcastId]);

  useEffect(() => {
    if (episodesList && episodeId) {
      const foundEpisode = episodesList.episodes.find((e: Episode) => e.trackId === +episodeId);
      setCurrentEpisode(foundEpisode);
    }
  }, [episodesList, episodeId]);

  return (
    <StyledEpisodeContainer>
      <Header />
      {currentPodcast && (
        <>
          <PodcastCard
            author={currentPodcast['im:artist']}
            image={currentPodcast['im:image']}
            title={currentPodcast['im:name']}
            description={currentPodcast.summary}
            onClick={() => navigate(`/podcast/${currentPodcast.id}`)}
          />
          {currentEpisode && (
            <EpisodeCard
              title={currentEpisode.trackName}
              description={currentEpisode.description || 'No description available.'}
              episodeUrl={currentEpisode.episodeUrl}
            />
          )}
        </>
      )}
    </StyledEpisodeContainer>
  );
};
