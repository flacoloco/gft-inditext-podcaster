import { useState, useEffect } from 'react';
import type { Episode } from '@src/components/molecules/EpisodesList/EpisodesList';

/**
 * Custom hook for fetching data from a URL
 * @param url - The URL to fetch data from
 * @returns [data, error] - Array containing the fetched data and error state
 */
export const usePodcastData = (podcastId: string): [Episode[] | null, string | null] => {
  const [data, setData] = useState<Episode[] | null>(null);
  const [error, setError] = useState<string | null>(null);


  const dataItem = `podcastData_${podcastId}`;

  const fetchUrl = `https://itunes.apple.com/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`;
  const noOriginUrl = 'https://api.allorigins.win/get?url=';


  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async (): Promise<void> => {
      setError(null);

      try {
        const response = await fetch(`${noOriginUrl}${encodeURIComponent(fetchUrl)}`, { signal });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const episodes = JSON.parse(result.contents).results.slice(1);
        setData(episodes);
        setError(null);
        localStorage.setItem(dataItem, JSON.stringify({ date: Date.now(), episodes }));
      } catch (err) {
        setError(`An unknown error occurred:${err}`);
        setData(null);
      }
    };

    if (localStorage.getItem(dataItem)) {
      try {
        const storedData = JSON.parse(localStorage.getItem(dataItem) || '{}');
        const dataAge = Date.now() - storedData.date;
        const oneDay = 24 * 60 * 60 * 1000;

        if (dataAge < oneDay) {
          setData(storedData.episodes);
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
      console.error('Fetch aborted');
    };
  }, [dataItem, fetchUrl]);

  return [data, error];
};
