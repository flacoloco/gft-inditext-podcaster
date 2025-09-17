import { type FC } from 'react';
import { useData } from '../../../hooks/useData';

type listType = {
  contents: {
    feed: {
      entry: Array<{
        'im:name': { label: string };
        'im:image': Array<{ label: string; attributes: { height: string } }>;
        summary: { label: string };
        'im:price': { label: string; attributes: { amount: string; currency: string } };
        'im:contentType': { attributes: { term: string; label: string } };
        rights: { label: string };
        title: { label: string };
        link: { attributes: { rel: string; type?: string; href: string } };
        id: { label: string; attributes: { 'im:id': string; 'im:bundleId'?: string } };
        'im:artist': { label: string; attributes?: { href: string } };
        category: { attributes: { 'im:id': string; term: string; scheme: string; label: string } };
        'im:releaseDate': { label: string; attributes: { label: string } };
      }>;
    };
  };
};
export const Home: FC = () => {

  const [data, error, isLoading] = useData<listType>('https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json');

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data) {
    const contents = JSON.parse(data.contents);
    return (
      <div>
        <h1>Data Loaded</h1>
        {contents.feed?.entry?.map((item) => (
          <div key={item.id.attributes['im:id']}>
            <h2>{item.title.label}</h2>
            <p>{item.summary.label}</p>
            <img src={item['im:image'][0].label} alt={item['im:name'].label} />
          </div>
        ))}
      </div>
    );
  }
  return null;
};
