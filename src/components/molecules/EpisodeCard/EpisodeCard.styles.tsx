import styled from 'styled-components';

export const StyledEpisodeCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 16px;
`;

export const StyledEpisodeTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  line-height: 1.3;
`;

export const StyledEpisodeDescription = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
  text-align: justify;
`;

export const StyledAudioPlayer = styled.audio`
  width: 100%;
  height: 40px;
  outline: none;

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;
