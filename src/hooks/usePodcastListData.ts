import { useState, useEffect } from 'react';

export type PodcastItemProps = {
  'im:artist': string;
  'im:name': string;
  'im:image': string;
  summary: string;
  title: string;
  id: string;
};

type PodcastDataProps = {
  'im:artist': { label: string };
  'im:name': { label: string };
  'im:image': { label: string }[];
  summary: { label: string };
  title: { label: string };
  id: { attributes: { 'im:id': string } };
};

/**
 * Custom hook for fetching data from a URL
 * @param url - The URL to fetch data from
 * @returns [data, error, isLoading] - Array containing the fetched data, error state, and loading state
 */
export const usePodcastListData = (): [PodcastItemProps[] | null, Error | null, boolean] => {
  const [data, setData] = useState<PodcastItemProps[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dataItem = 'podcastListData';
  const fetchUrl = 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json';
  const noOriginUrl = 'https://api.allorigins.win/get?url=';

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${noOriginUrl}${encodeURIComponent(fetchUrl)}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const parsedContents = JSON.parse(result.contents);
        const podcasts: PodcastItemProps[] = parsedContents.feed.entry.map((item: PodcastDataProps) => ({
          'im:artist': item['im:artist'].label,
          'im:name': item['im:name'].label,
          'im:image': item['im:image'][0].label,
          summary: item.summary.label,
          title: item.title.label,
          id: item.id.attributes['im:id'],
        }));
        setData(podcasts);
        localStorage.setItem(dataItem, JSON.stringify({ date: Date.now(), podcasts }));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (localStorage.getItem(dataItem)) {
      try {
        const storedData = JSON.parse(localStorage.getItem(dataItem) || '{}');
        const dataAge = Date.now() - storedData.date;
        const oneDay = 24 * 60 * 60 * 1000;

        if (dataAge < oneDay) {
          setData(storedData.podcasts);
          return;
        }
      } catch (error) {
        // If parsing fails, continue to fetch new data
        // eslint-disable-next-line no-console
        console.error('Error parsing cached data:', error);
      }
    }

    fetchData();
  }, [fetchUrl]);

  return [data, error, isLoading];
};
