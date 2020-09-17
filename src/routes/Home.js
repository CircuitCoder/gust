import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchList } from '../store/actions';
import { Link } from 'react-router-dom';
import { useTitle } from '../utils/hooks';

function Home() {
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

  return (
    <main className="home">
      <div className="home-left"></div>

      <div className="home-right">
        {listing &&
          listing.entries.map(e => (
            <Link to={`/entry/${e.slug}`} className="home-tile" key={e.slug}>
              <div className="home-tile-meta">
                <div className="home-tile-meta-sharp">#</div>
                <div className="home-tile-meta-slug">{e.slug}</div>

                <div className="home-tile-meta-author">{e.author}</div>
              </div>

              <div className="home-tile-inner">
                <div className="home-tile-inner-summary">
                  <div className="home-tile-inner-summary-text">{e.desc}</div>
                </div>
                <div className="home-tile-inner-mtime">
                  <div className="home-tile-inner-mtime-text">
                    {e.last_modified}
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </main>
  );
}

export default Home;
