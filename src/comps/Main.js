import React from 'react';

const Main = ({ off, children, ...rest }) => {
  let wrapperClass = `main-wrapper`;
  if (off) wrapperClass += ' main-wrapper-off';

  return (
    <div className={wrapperClass}>
      <main {...rest}>
        { children }
      </main>
    </div>
  )
};

export default Main;
