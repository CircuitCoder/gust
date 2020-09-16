import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchList } from '../store/actions';

function Home() {
  const dispatch = useDispatch();

  // Load listing on startup
  useEffect(() => {
    dispatch(fetchList());
  }, [dispatch]);

  const listing = useSelector(({ listing }) => listing);

  return (
    <main className="home">
      <nav className="home-left">
        <div className="tile">
          <div className="title">
            <div className="title-inner">
              <strong>风</strong>的<br/>重构
            </div>
          </div>

          <div className="tile-meta"><strong>logo</strong>(primary) @ /</div>
        </div>
      </nav>

      <div className="home-right">
        {listing && listing.entries.map(e => (
          <div class="home-tile" key={e.slug}>
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
          </div>
        ))}
      </div>
    </main>
  );
}

export default Home;
