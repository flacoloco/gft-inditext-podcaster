import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching data from a URL
 * @param url - The URL to fetch data from
 * @returns [data, error, isLoading] - Array containing the fetched data, error state, and loading state
 */
export const usePodcastData = <T = unknown>(podcastId?: string | undefined): [T | null, Error | null, boolean] => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const dataItem = podcastId ? 'podcastData' : 'podcastListData';

  const fetchUrl = podcastId
    ? `https://itunes.apple.com/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`
    : 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json';

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // const response = await fetch(`http://api.allorigins.win/get?url=${encodeURIComponent(fetchUrl)}`);
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(fetchUrl)}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Fetched data from:', `http://api.allorigins.win/get?url=${encodeURIComponent(fetchUrl)}`, result);
        setData(result);
        localStorage.setItem(dataItem, JSON.stringify({ date: Date.now(), ...result }));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (localStorage.getItem('podcastData')) {
      const storedData = JSON.parse(localStorage.getItem(dataItem) || '{}');
      const dataAge = Date.now() - storedData.date;
      const oneDay = 24 * 60 * 60 * 1000;

      if (dataAge < oneDay) {
        setData(storedData);
        return;
      }
    }

    fetchData();
  }, [fetchUrl]);

  return [data, error, isLoading];
};
