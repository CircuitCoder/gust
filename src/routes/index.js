import React from 'react';
import { Route } from 'react-router-dom';
import Nav from '../comps/Nav';

import Home from './Home';

const Root = () => <>
  <Nav />
  <Route path="/" exact component={Home} />
</>;

export default Root;
