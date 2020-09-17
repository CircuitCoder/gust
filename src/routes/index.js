import React from 'react';
import { Route } from 'react-router-dom';
import Nav from '../comps/Nav';

import Entry from './Entry';
import Home from './Home';

const Root = () => (
  <>
    <Nav />
    <Route path="/" exact component={Home} />
    <Route path="/entry/:slug" exact component={Entry} />
  </>
);

export default Root;
