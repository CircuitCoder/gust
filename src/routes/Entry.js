import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Markdown from '../comps/Markdown';
import { useTitle } from '../utils/hooks';
import { retrieve } from '../utils/networking';

const capitalize = input =>
  `${input.charAt(0).toUpperCase()}${input.slice(1).toLowerCase()}`;
const useEntry = slug => {
  const [entry, setEntry] = useState(null);
  useEffect(() => {
    retrieve(`entries/${slug}.md`).then(setEntry);
    return () => setEntry(null);
  }, [slug]);
  return entry;
};

const Entry = () => {
  const params = useParams();

  useTitle(`#${capitalize(params.slug)}`);
  const entry = useEntry(params.slug);

  if (entry === null) return <main className="entry">Loading...</main>;

  return (
    <main className="entry">
      <Markdown source={entry} />
    </main>
  );
};

export default Entry;
