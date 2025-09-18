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
    <StyledPodcastCard onClick={onClick}>
      <StyledImage src={image} alt={title} />
      <hr style={{ width: '100%', color: 'red' }} />
      <StyledContent>
        <StyledTitle>{title}</StyledTitle>
        <span>by {author}</span>
        <StyledDescription>{description}</StyledDescription>
      </StyledContent>
    </StyledPodcastCard>
  );
};
