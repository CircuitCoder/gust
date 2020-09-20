import React from 'react';
import Nav from '../comps/Nav';

import Entry from './Entry';
import Home from './Home';

const Root = () => (
  <>
    <div className="hitzone-fixed" />
    <Nav />
    <Home />
    <Entry />
  </>
);

export default Root;
