import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';

const Main = ({ on, children, hitzone, ...rest }) => {
  const cn = clsx('main-wrapper', {
    'main-wrapper-off': !on,
  });

  const ob = useMemo(
    () =>
      new ResizeObserver(entries => {
        const ent = entries[0];
        ent.target.style.setProperty('--full-width', ent.contentRect.width + 'px');
        ent.target.style.setProperty('--full-height', ent.contentRect.height + 'px');
      }),
    [],
  );

  const attach = useCallback(
    el => {
      ob.disconnect();
      if (!el) return;
      ob.observe(el);
    },
    [ob],
  );

  return (
    <div className={cn} ref={attach}>
      {hitzone && <div className="hitzone" ref={hitzone} />}
      <main {...rest}>{children}</main>
    </div>
  );
};

export default Main;
