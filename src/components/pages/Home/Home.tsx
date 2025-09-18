/* eslint-disable no-console */
import { useEffect, useState, type FC } from 'react';
import { useData } from '@src/hooks/useData';
import { PodcastItem, SearchInput } from '@src/components/atoms';
import { useNavigate } from 'react-router-dom';
import { StyledPodcastsGrid, StyledHomeContainer, StyledScrollableContainer } from './Home.styles';

type listType = {
  contents: string
};

type podcastType = {
  'im:artist': { label: string };
  'im:name': { label: string };
  'im:image': { label: string }[];
  summary: { label: string };
  title: { label: string };
  id: { attributes: { 'im:id': string } };
};
export const Home: FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>('');
  const [podcasts, setPodcasts] = useState<podcastType[] | null>(null);
  const [filteredPodcasts, setFilteredPodcasts] = useState<podcastType[] | null>(null);
  const [data, error, isLoading] = useData<listType>('https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json');


  useEffect(() => {
    if (data) {
      try {
        const parsedContents = JSON.parse(data.contents);
        const pods = parsedContents.feed.entry;
        setPodcasts(pods);
        setFilteredPodcasts(pods);
      } catch (e) {
        console.error('Failed to parse contents:', e);
      }
    }
  }, [data]);

  useEffect(() => {
    if (podcasts) {
      if (searchValue) {
        const filtered = podcasts.filter((item: podcastType) =>
          item.title.label.toLowerCase().includes(searchValue.toLowerCase())
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

  if (isLoading) {
    return <div>Loading...</div>;
  }


  if (filteredPodcasts) {
    const count = filteredPodcasts.length || 0;
    return (
      <StyledHomeContainer>
        <SearchInput
          placeholder='Filter podcasts...'
          value={searchValue}
          onChange={setSearchValue}
          count={count}
        />
        <br />
        <StyledScrollableContainer>
          <StyledPodcastsGrid>
            {filteredPodcasts.map((item: podcastType) => (
              <PodcastItem
                key={item.id.attributes['im:id']}
                author={item['im:artist'].label}
                imageUrl={item['im:image'][0].label}
                onClick={() => navigate(`/podcast/${item.id.attributes['im:id']}`)}
                title={item['im:name'].label}
              />
            ))}
          </StyledPodcastsGrid>
        </StyledScrollableContainer>
      </StyledHomeContainer>
    );
  }

  return null;
};
