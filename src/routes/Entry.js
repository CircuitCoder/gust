import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import Markdown from '../comps/Markdown';
import { useTitle } from '../utils/hooks';
import { retrieve } from '../utils/networking';

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Main from '../comps/Main';

const capitalize = input =>
  `${input.charAt(0).toUpperCase()}${input.slice(1).toLowerCase()}`;
const useEntry = slug => {
  const [entry, setEntry] = useState(null);
  useEffect(() => {
    if (slug !== null) retrieve(`entries/${slug}.md`).then(setEntry);
    return () => setEntry(null);
  }, [slug]);
  return entry;
};

const Entry = () => {
  const match = useRouteMatch('/entry/:slug');
  const slug = match?.params?.slug ?? null;

  useTitle(slug ? `#${capitalize(slug)}` : null);
  const entry = useEntry(slug);

  return (
    <TransitionGroup component={null}>
      <CSSTransition key={entry && slug} classNames="entry-fade" timeout={1000}>
        <Main className="entry" on={slug}>
          <Markdown source={entry} />
        </Main>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default Entry;
