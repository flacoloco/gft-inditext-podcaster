import { type FC } from 'react';
import { useData } from '../../../hooks/useData';

export const Home: FC = () => {

  const [data, error, isLoading] = useData('https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json');

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data) {
    return (<div>
      <h1>Data Loaded</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
    );
  }
  return null;
};
