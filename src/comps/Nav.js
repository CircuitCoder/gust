import React, { useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();
  const history = useHistory();
  const path = location.pathname;

  const remote = path !== '/';

  const home = useCallback(() => {
    if (remote) history.push('/');
  }, [history, remote]);

  return (
    <nav className={remote ? 'mini' : ''}>
      <div className="title-tile">
        <div className="title" onClick={home}>
          <div className="title-inner">
            <strong>风</strong>的<br />
            重构
          </div>
        </div>

        <div className="title-tile-meta">
          <div className="title-tile-meta-inner">
            <strong>logo</strong>(primary) @ /
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
