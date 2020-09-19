import React from 'react';
import clsx from 'clsx';

const Main = ({ on, children, ...rest }) => {
  const cn = clsx('main-wrapper', {
    'main-wrapper-off': !on,
  });

  return (
    <div className={cn}>
      <main {...rest}>
        { children }
      </main>
    </div>
  )
};

export default Main;
