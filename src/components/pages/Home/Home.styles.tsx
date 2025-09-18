import styled from 'styled-components';

export const StyledPodcastsGrid = styled.div`
  display: grid;
  width: 900px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  justify-items: center;
`;

export const StyledHomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 900px;
  padding: 0 50px;
`;

export const StyledScrollableContainer = styled.div`
  overflow-y: auto;
  max-height: 80vh;
`;
