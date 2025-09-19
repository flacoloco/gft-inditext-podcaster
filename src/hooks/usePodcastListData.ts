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
 * @returns [data, error] - Array containing the fetched data and error state
 */
export const usePodcastListData = (): [PodcastItemProps[] | null, string | null] => {
  const [data, setData] = useState<PodcastItemProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dataItem = 'podcastListData';
  const fetchUrl = 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json';
  const noOriginUrl = 'https://api.allorigins.win/get?url=';

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async (): Promise<void> => {
      try {
        setError(null);
        const response = await fetch(`${noOriginUrl}${encodeURIComponent(fetchUrl)}`, { signal });

        if (!response.ok) {
          setError(`HTTP error! status: ${response.status}`);
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
        setError(null);
        localStorage.setItem(dataItem, JSON.stringify({ date: Date.now(), podcasts }));
      } catch (err) {
        setError(`An unknown error occurred: ${err}`);
        setData(null);
      }
    };

    if (localStorage.getItem(dataItem)) {
      try {
        const storedData = JSON.parse(localStorage.getItem(dataItem) || '{}');
        const dataAge = Date.now() - storedData.date;
        const oneDay = 24 * 60 * 60 * 1000;

        if (dataAge < oneDay) {
          setData(storedData.podcasts);
          setError(null);
          return;
        }
      } catch (error) {
        // If parsing fails, continue to fetch new data
        // eslint-disable-next-line no-console
        console.error('Error parsing cached data:', error);
        setError('Error parsing cached data');
      }
    }

    fetchData();

    return (): void => {
      controller.abort();
      // eslint-disable-next-line no-console
      console.error('Fetch aborted');
    };
  }, [fetchUrl]);

  return [data, error];
};
