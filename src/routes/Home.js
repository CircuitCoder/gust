import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchList } from '../store/actions';
import { Link } from 'react-router-dom';
import { useTitle } from '../utils/hooks';
import Main from '../comps/Main';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { CSSTransition } from 'react-transition-group';

const ListingEntry = ({ entry, current, ...rest }) => (
  <Flipped flipId={entry.slug} {...rest} translate={true}>
    <CSSTransition
      classNames="listing-fade"
      appear={true}
      in={current === null || entry.slug === current}
      timeout={1000}
    >
      <Link to={`/entry/${entry.slug}`} className="home-tile">
        <div className="home-tile-meta">
          <div className="home-tile-meta-sharp">#</div>
          <div className="home-tile-meta-slug">{entry.slug}</div>

          <div className="home-tile-meta-author">{entry.author}</div>
        </div>

        <div className="home-tile-inner">
          <div className="home-tile-inner-summary">
            <div className="home-tile-inner-summary-text">{entry.desc}</div>
          </div>
          <div className="home-tile-inner-mtime">
            <div className="home-tile-inner-mtime-text">
              {entry.last_modified}
            </div>
          </div>
        </div>
      </Link>
    </CSSTransition>
  </Flipped>
);

const Home = () => {
  const dispatch = useDispatch();

  // Set title
  useTitle('🎐');

  // Load listing on startup
  useEffect(() => {
    dispatch(fetchList());
  }, [dispatch]);

  const listing = useSelector(({ listing }) => listing);

  // For debugging
  /*
  if (listing && listing.entries) {
    listing.entries = [
      ...listing.entries,
      ...listing.entries,
    ];
  }
  */

  const homeMatch = useRouteMatch({
    path: '/',
    exact: true,
  });

  const entryMatch = useRouteMatch({
    path: '/entry/:slug',
    exact: true,
  });

  const slug = entryMatch?.params?.slug ?? null;

  return (
    <Main className="home" off={homeMatch}>
      <div className="home-left"></div>

      <div className="home-right">
        <Flipper flipKey={slug}>
          {listing &&
            listing.entries.map(e => (
              <ListingEntry key={e.slug} current={slug} entry={e} />
            ))}
        </Flipper>
      </div>
    </Main>
  );
};

export default Home;
