import styled from 'styled-components';

export const HomeContainer = styled.div`
  display: grid;
  width: 900px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  justify-items: center;
  padding-top: 2rem;
`;
