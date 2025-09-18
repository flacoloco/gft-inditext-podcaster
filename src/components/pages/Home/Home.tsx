/* eslint-disable no-console */
import { useEffect, useState, type FC } from 'react';
import { useData } from '@src/hooks/useData';
import { Header, PodcastItem, SearchInput } from '@src/components/atoms';
import { useNavigate } from 'react-router-dom';
import { StyledPodcastsGrid, StyledHomeContainer, StyledScrollableContainer } from './Home.styles';
import { useAppContext } from '@src/contexts';

type resultType = {
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
  const [data, error, isLoading] = useData<resultType>();
  const { setCurrentPodcast } = useAppContext();



  useEffect(() => {
    if (data) {
      try {
        const parsedContents = JSON.parse(data.contents);
        const pods = parsedContents.feed.entry;
        console.log('raw Data:', parsedContents);
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

  const onClickPodcast = (podcast: podcastType): void => {
    setCurrentPodcast({
      id: podcast.id.attributes['im:id'],
      description: podcast.summary.label,
    });
    navigate(`/podcast/${podcast.id.attributes['im:id']}`);
  };

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
              {filteredPodcasts.map((item: podcastType) => (
                <PodcastItem
                  key={item.id.attributes['im:id']}
                  author={item['im:artist'].label}
                  imageUrl={item['im:image'][0].label}
                  onClick={() => onClickPodcast(item)}
                  title={item['im:name'].label}
                />
              ))}
            </StyledPodcastsGrid>
          </StyledScrollableContainer>
        </>
      )}
    </StyledHomeContainer>
  );
};
