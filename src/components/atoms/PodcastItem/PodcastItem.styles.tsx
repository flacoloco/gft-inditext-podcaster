import styled from 'styled-components';

export const StyledPodcastItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 180px;
  position: relative;
  cursor: pointer;
  padding-top: 80px;
`;

export const StyledSpace = styled.div`
  height: 20px;
`;

export const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 180px;
  border: 1px solid #e0e0e0;
  position: relative;
  padding: 8px;
`;

export const StyledImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  position: absolute;
  transform: translateY(-50%);
  transform-origin: 50% 50%;
`;

export const StyledTitle = styled.h3`
  ont-size: 0.875rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  padding-top: 55px;
  line-height: 1.2;
  word-wrap: break-word;
  text-transform: uppercase;
`;

export const StyledAuthor = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  color: #333;
  margin: 0;
  padding-top: 16px;
  line-height: 1.2;
  word-wrap: break-word;
`;
