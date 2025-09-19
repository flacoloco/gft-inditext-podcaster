import { type FC } from 'react';
import { millisToMinutes } from '@src/helpers';
import {
  StyledEpisodesList,
  StyledEpisodeItem,
  StyledEpisodeContent,
  StyledEpisodeTitle,
  StyledEpisodeDate,
  StyledEpisodeDuration,
  StyledEpisodesListContainer,
  StyledEpisodesHeader,
} from './EpisodesList.styles';

export type Episode = {
  trackId: string;
  trackName: string;
  trackTimeMillis: number;
  releaseDate: string;
};

interface EpisodesListProps {
  episodes: Episode[];
  onEpisodeClick?: (episode: Episode) => void;
}

export const EpisodesList: FC<EpisodesListProps> = ({ episodes, onEpisodeClick }) => {
  const handleEpisodeClick = (episode: Episode): void => {
    if (onEpisodeClick) {
      onEpisodeClick(episode);
    }
  };

  return (
    <StyledEpisodesListContainer>
      <StyledEpisodesHeader>Episodes: {episodes.length}</StyledEpisodesHeader>
      <StyledEpisodesList>
        <StyledEpisodeItem $isEven={false}>
          <StyledEpisodeContent>
            <StyledEpisodeTitle>Title</StyledEpisodeTitle>
            <StyledEpisodeDate $isBold>Date</StyledEpisodeDate>
            <StyledEpisodeDuration $isBold>Duration</StyledEpisodeDuration>
          </StyledEpisodeContent>
        </StyledEpisodeItem>
        {episodes.map((episode, index) => (
          <StyledEpisodeItem key={episode.trackId} $isEven={index % 2 === 0}>
            <StyledEpisodeContent>
              <StyledEpisodeTitle>
                <a
                  href='#'
                  onClick={(e): void => {
                    e.preventDefault();
                    handleEpisodeClick(episode);
                  }}
                >
                  {episode.trackName}
                </a>
              </StyledEpisodeTitle>
              <StyledEpisodeDate>{episode.releaseDate}</StyledEpisodeDate>
              <StyledEpisodeDuration>{millisToMinutes(episode.trackTimeMillis)}</StyledEpisodeDuration>
            </StyledEpisodeContent>
          </StyledEpisodeItem>
        ))}
      </StyledEpisodesList>
    </StyledEpisodesListContainer>
  );
};
