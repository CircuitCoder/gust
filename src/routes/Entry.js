import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import Markdown from '../comps/Markdown';
import { useTitle } from '../utils/hooks';
import { retrieve } from '../utils/networking';

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Main from '../comps/Main';
import { useDispatch, useSelector } from 'react-redux';
import { foldTitle } from '../store/simple';
import clsx from 'clsx';

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

  useTitle(
    {
      path: '/entry/:slug',
      exact: true,
    },
    match => capitalize(match.params.slug),
  );

  const entry = useEntry(slug);

  const dispatch = useDispatch();

  const ob = useMemo(() => {
    return new IntersectionObserver(entries => {
      const ent = entries[0];
      const scrolled = ent.intersectionRatio < 1;
      dispatch(foldTitle(scrolled));
    }, {
      threshold: 1,
    });
  }, [dispatch]);

  const hitzone = useCallback(hz => {
    ob.disconnect();
    if(!hz) return;
    ob.observe(hz);
  }, [ob]);

  const folded = useSelector(({ folded }) => folded);
  const cn = clsx('entry', {
    'entry-folded': folded,
  });

  return (
    <Main className={cn} on={slug} hitzone={hitzone} dir="x">
      <TransitionGroup component={null}>
        <CSSTransition
          key={entry && slug}
          classNames="entry-fade"
          timeout={1000}
        >
          <Markdown source={entry} />
        </CSSTransition>
      </TransitionGroup>
    </Main>
  );
};

export default Entry;
