/* eslint-disable no-console */
import { useEffect, useState, type FC } from 'react';
import { useData } from '@src/hooks/useData';
import { Header, PodcastItem, SearchInput } from '@src/components/atoms';
import { useNavigate } from 'react-router-dom';
import { StyledPodcastsGrid, StyledHomeContainer, StyledScrollableContainer } from './Home.styles';
import { useAppContext } from '@src/contexts';
import type { PodcastType } from '@src/contexts/AppContext';

type PodcastItemProps = {
  'im:artist': { label: string };
  'im:name': { label: string };
  'im:image': { label: string }[];
  summary: { label: string };
  title: { label: string };
  id: { attributes: { 'im:id': string } };
};

type resultType = {
  contents: string
};

export const Home: FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredPodcasts, setFilteredPodcasts] = useState<PodcastType[] | null>(null);
  const [data, error, isLoading] = useData<resultType>();
  const { podcasts, setPodcasts } = useAppContext();



  useEffect(() => {
    if (data) {
      try {
        const parsedContents = JSON.parse(data.contents);
        const pods: PodcastType[] = parsedContents.feed.entry.map((item: PodcastItemProps) => ({
          'im:artist': item['im:artist'].label,
          'im:name': item['im:name'].label,
          'im:image': item['im:image'][0].label,
          summary: item.summary.label,
          title: item.title.label,
          id: item.id.attributes['im:id'],
        }));
        console.log('raw Data:', parsedContents);
        setPodcasts(pods);
        setFilteredPodcasts(pods);
      } catch (e) {
        console.error('Failed to parse contents:', e);
      }
    }
  }, [data, setPodcasts]);

  useEffect(() => {
    if (podcasts) {
      if (searchValue) {
        const filtered = podcasts.filter((item: PodcastType) =>
          item.title.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredPodcasts(filtered);

        console.log('Podcasts:', filtered);
      } else {
        setFilteredPodcasts(podcasts);
      }
    }
  }, [podcasts, searchValue]);

  if (error) {
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
              {filteredPodcasts.map((item: PodcastType) => (
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
