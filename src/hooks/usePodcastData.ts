import { useState, useEffect } from 'react';
import type { Episode } from '@src/components/molecules/EpisodesList/EpisodesList';

/**
 * Custom hook for fetching data from a URL
 * @param url - The URL to fetch data from
 * @returns [data, error, isLoading] - Array containing the fetched data, error state, and loading state
 */
export const usePodcastData = (podcastId: string): [Episode[] | null, Error | null, boolean] => {
  const [data, setData] = useState<Episode[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const dataItem = `podcastData_${podcastId}`;

  const fetchUrl = `https://itunes.apple.com/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`;
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
        const episodes = JSON.parse(result.contents).results.slice(1);
        setData(episodes);
        localStorage.setItem(dataItem, JSON.stringify({ date: Date.now(), episodes }));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (localStorage.getItem(dataItem)) {
      const storedData = JSON.parse(localStorage.getItem(dataItem) || '{}');
      const dataAge = Date.now() - storedData.date;
      const oneDay = 24 * 60 * 60 * 1000;

      if (dataAge < oneDay) {
        setData(storedData.episodes);
        return;
      }
    }

    fetchData();
  }, [dataItem, fetchUrl]);

  return [data, error, isLoading];
};
