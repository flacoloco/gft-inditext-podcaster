import { type FC } from 'react';
import {
  StyledPodcastItem,
  StyledSpace,
  StyledContent,
  StyledImage,
  StyledTitle,
  StyledAuthor,
} from './PodcastItem.styles';

interface PodcastItemProps {
  author: string;
  imageUrl: string;
  onClick?: () => void;
  title: string;
}

export const PodcastItem: FC<PodcastItemProps> = ({ imageUrl, title, author, onClick }) => {
  return (
    <StyledPodcastItem onClick={onClick}>
      <StyledSpace />
      <StyledContent>
        <StyledImage
          src={imageUrl}
          alt={title}
        />
        <StyledTitle>{title}</StyledTitle>
        <StyledAuthor>{`Author: ${author}`}</StyledAuthor>
      </StyledContent>
    </StyledPodcastItem>
  );
};
