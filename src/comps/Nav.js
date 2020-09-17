import React from 'react';
import { useLocation } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();
  const path = location.pathname;

  const mini = path !== '/';

  return (
    <nav className={mini ? 'mini' : 'mini'}>
      <div className="tile">
        <div className="title">
          <div className="title-inner">
            <strong>风</strong>的<br/>重构
          </div>
        </div>

        <div className="tile-meta"><strong>logo</strong>(primary) @ /</div>
      </div>
    </nav>
  );
}

export default Nav;
