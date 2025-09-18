import { type FC, type ChangeEvent } from 'react';
import { StyledSearchContainer, StyledSearchInput, StyledCount } from './SearchInput.styles';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  count: number;
}

export const SearchInput: FC<SearchInputProps> = ({
  placeholder = 'Search podcasts...',
  value = '',
  onChange,
  count
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <StyledSearchContainer>
      {count !== undefined && <StyledCount>{count}</StyledCount>}
      <StyledSearchInput
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </StyledSearchContainer>
  );
};

