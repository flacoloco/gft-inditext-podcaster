import styled from 'styled-components';

export const StyledSearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  gap: 10px;
  paddingBottom: 10px;
`;

export const StyledSearchInput = styled.input`
  width: 300px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  background-color: #f9f9f9;
  color: #333;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

export const StyledCount = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border-radius: 0.5rem;
  padding: 0.25rem 0;
  width: 55px;
  text-align: center;
`;
