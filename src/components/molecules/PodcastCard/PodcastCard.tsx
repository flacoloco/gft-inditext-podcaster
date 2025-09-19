import { type FC } from 'react';
import {
  StyledPodcastCard,
  StyledImage,
  StyledContent,
  StyledTitle,
  StyledDescription,
} from './PodcastCard.styles';

interface PodcastCardProps {
  author: string;
  image: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export const PodcastCard: FC<PodcastCardProps> = ({ author, image, title, description, onClick }) => {
  return (
    <StyledPodcastCard>
      <StyledImage src={image} alt={title} onClick={onClick} />
      <hr style={{ width: '100%', color: 'red' }} />
      <StyledContent>
        <StyledTitle onClick={onClick}>{title}</StyledTitle>
        <span>by {author}</span>
        <StyledDescription>{description}</StyledDescription>
      </StyledContent>
    </StyledPodcastCard>
  );
};
