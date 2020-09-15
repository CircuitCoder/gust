import React from 'react';
import { Route } from 'react-router-dom';

import Home from './Home';

const Root = () => <>
  <Route path="/" component={Home} />
</>;

export default Root;
