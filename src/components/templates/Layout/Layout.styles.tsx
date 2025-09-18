import styled from 'styled-components';

export const StyledLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  width: 100vw;
`;

export const StyledMain = styled.main`
  width: 1000px;
  padding: 0 1rem;
  padding-top: 50px;
  min-height: calc(100vh - 50px);
  background-color: pink;
`;
