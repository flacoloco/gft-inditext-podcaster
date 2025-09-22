import { type FC } from 'react';
import DOMPurify from 'dompurify';
import {
  StyledEpisodeCard,
  StyledEpisodeTitle,
  StyledEpisodeDescription,
  StyledAudioPlayer,
} from './EpisodeCard.styles';

interface EpisodeCardProps {
  title: string;
  description: string;
  episodeUrl: string;
}

export const EpisodeCard: FC<EpisodeCardProps> = ({ title, description, episodeUrl }) => {
  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedDescription = DOMPurify.sanitize(description);

  return (
    <StyledEpisodeCard>
      <StyledEpisodeTitle>{title}</StyledEpisodeTitle>
      <StyledEpisodeDescription
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
      <StyledAudioPlayer controls>
        <source src={episodeUrl} type='audio/mpeg' />
        <source src={episodeUrl} type='audio/ogg' />
        <source src={episodeUrl} type='audio/wav' />
        Your browser does not support the audio element.
      </StyledAudioPlayer>
    </StyledEpisodeCard>
  );
};
