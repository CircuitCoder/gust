import React from 'react';
import clsx from 'clsx';

const Main = ({ on, children, hitzone, ...rest }) => {
  const cn = clsx('main-wrapper', {
    'main-wrapper-off': !on,
  });

  return (
    <div className={cn}>
      {hitzone && <div className="hitzone" ref={hitzone} />}
      <main {...rest}>{children}</main>
    </div>
  );
};

export default Main;
