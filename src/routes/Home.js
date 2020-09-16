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
        { JSON.stringify(listing) }
      </div>
    </main>
  );
}

export default Home;
