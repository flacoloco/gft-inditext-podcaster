import styled from 'styled-components';

export const StyledEpisodesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 600px;
  height: 400px;
  overflow-y: auto;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const StyledEpisodeItem = styled.li<{ $isEven: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  background-color: ${({ $isEven }): string => $isEven ? '#f8f9fa' : '#ffffff'};
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ $isEven }): string => $isEven ? '#e9ecef' : '#f8f9fa'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const StyledEpisodeContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 1em;
`;

export const StyledEpisodeTitle = styled.h3`
  width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 600;

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #007bff;
      text-decoration: underline;
    }
  }
`;

export const StyledEpisodeDate = styled.span`
  font-size: 0.875rem;
  color: #666;
  margin: 0;
`;

export const StyledEpisodeDuration = styled.span`
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
  text-align: right;
  width: 100px;
`;
