import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchList } from '../store/actions';
import { Link } from 'react-router-dom'

function Home() {
  const dispatch = useDispatch();

  // Load listing on startup
  useEffect(() => {
    dispatch(fetchList());
  }, [dispatch]);

  const listing = useSelector(({ listing }) => listing);

  return (
    <main className="home">
      <div className="home-left"></div>

      <div className="home-right">
        {listing && listing.entries.map(e => (
          <Link to={`/entry/${e.slug}`} class="home-tile" key={e.slug}>
            <div class="home-tile-meta">
              <div class="home-tile-meta-sharp">#</div>
              <div class="home-tile-meta-slug">{e.slug}</div>

              <div class="home-tile-meta-author">
                { e.author }
              </div>
            </div>

            <div class="home-tile-inner">
              <div class="home-tile-inner-summary">
                <div class="home-tile-inner-summary-text">{ e.desc }</div>
              </div>
              <div class="home-tile-inner-mtime">
                <div class="home-tile-inner-mtime-text">{ e.last_modified }</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default Home;
