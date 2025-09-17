import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching data from a URL
 * @param url - The URL to fetch data from
 * @returns [data, error, isLoading] - Array containing the fetched data, error state, and loading state
 */
export const useData = <T = unknown>(url: string): [T | null, Error | null, boolean] => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!url) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://api.allorigins.win/get?url=${url}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return [data, error, isLoading];
};
