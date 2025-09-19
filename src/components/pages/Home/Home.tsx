import { useEffect, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePodcastListData } from '@src/hooks';
import { Header, PodcastItem, SearchInput } from '@src/components/atoms';
import type { PodcastItemProps } from '@src/hooks/usePodcastListData';
import { StyledPodcastsGrid, StyledHomeContainer, StyledScrollableContainer } from './Home.styles';


export const Home: FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>('');
  const [podcasts, setPodcasts] = useState<PodcastItemProps[] | null>(null);
  const [filteredPodcasts, setFilteredPodcasts] = useState<PodcastItemProps[] | null>(null);
  const [data, error, isLoading] = usePodcastListData();

  useEffect(() => {
    if (data) {
      try {
        setPodcasts(data);
        setFilteredPodcasts(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse contents:', e);
      }
    }
  }, [data, setPodcasts]);

  useEffect(() => {
    if (podcasts) {
      if (searchValue) {
        const filtered = podcasts.filter((item: PodcastItemProps) =>
          item.title.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredPodcasts(filtered);
      } else {
        setFilteredPodcasts(podcasts);
      }
    }
  }, [podcasts, searchValue]);

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }

  const count = filteredPodcasts?.length || 0;

  return (
    <StyledHomeContainer>
      <Header isLoading={isLoading} />
      {filteredPodcasts && (
        <>
          <SearchInput
            placeholder='Filter podcasts...'
            value={searchValue}
            onChange={setSearchValue}
            count={count}
          />
          <br />
          <StyledScrollableContainer>
            <StyledPodcastsGrid>
              {filteredPodcasts.map((item: PodcastItemProps) => (
                <PodcastItem
                  key={item.id}
                  author={item['im:artist']}
                  imageUrl={item['im:image']}
                  onClick={() => navigate(`/podcast/${item.id}`)}
                  title={item['im:name']}
                />
              ))}
            </StyledPodcastsGrid>
          </StyledScrollableContainer>
        </>
      )}
    </StyledHomeContainer>
  );
};
