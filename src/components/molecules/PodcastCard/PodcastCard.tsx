import { type FC } from 'react';
import {
  StyledPodcastCard,
  StyledImage,
  StyledContent,
  StyledTitle,
  StyledDescription,
} from './PodcastCard.styles';

interface PodcastCardProps {
  image: string;
  title: string;
  description: string;
  onClick?: () => void;
}

const PodcastCard: FC<PodcastCardProps> = ({ image, title, description, onClick }) => {
  return (
    <StyledPodcastCard onClick={onClick}>
      <StyledImage src={image} alt={title} />
      <hr style={{ width: '100%', color: 'red' }} />
      <StyledContent>
        <StyledTitle>{title}</StyledTitle>
        <StyledDescription>{description}</StyledDescription>
      </StyledContent>
    </StyledPodcastCard>
  );
};

export default PodcastCard;
