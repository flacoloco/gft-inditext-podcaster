import styled from 'styled-components';

export const PodcastsGrid = styled.div`
  display: grid;
  width: 900px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  justify-items: center;
  padding-top: 2rem;
`;

// export const SearchInput = styled.input`
//   width: 300px;
//   padding: 0.5rem 1rem;
//   margin-left: 10px;
//   font-size: 1rem;
//   border: 1px solid #ccc;
//   border-radius: 0.5rem;
//   margin-bottom: 1.5rem;
//   background-color: #f9f9f9;
//   color: #333;
//   &:focus {
//     outline: none;
//     border-color: #007bff;
//     box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
//   }
// `;

// export const CountSpan = styled.span`
//   font-size: 1rem;
//   font-weight: bold;
//   color: #fff;
//   margin-bottom: 1rem;
//   background-color: #007bff;
//   border-radius: 0.5rem;
//   padding: 0.25rem 0.75rem;
// `;
