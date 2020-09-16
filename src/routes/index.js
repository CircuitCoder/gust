import React from 'react';
import { Route } from 'react-router-dom';

import Home from './Home';

const Root = () => <>
  <nav>
    <div className="tile">
      <div className="title">
        <div className="title-inner">
          <strong>风</strong>的<br/>重构
        </div>
      </div>

      <div className="tile-meta"><strong>logo</strong>(primary) @ /</div>
    </div>
  </nav>

  <Route path="/" exact component={Home} />
</>;

export default Root;
