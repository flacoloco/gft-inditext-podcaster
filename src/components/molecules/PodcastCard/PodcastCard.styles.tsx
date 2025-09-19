import styled from 'styled-components';

export const StyledPodcastCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 16px;
`;

export const StyledImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 0.3rem;
`;

export const StyledContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const StyledTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
  word-wrap: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: left;
`;

export const StyledDescription = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
  text-align: left;
  word-wrap: break-word;
  overflow-y: auto;
  text-overflow: ellipsis;
  display: -webkit-box;
  max-height: 200px;
`;
