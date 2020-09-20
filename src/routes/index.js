import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import Nav from '../comps/Nav';

import Entry from './Entry';
import Home from './Home';

import warnImg from '../assets/small_screen.gif';

const Root = () => {
  const [warningClosed, setWarningClosed] = useState(
    window.localStorage.getItem('viewport-warning-closed') ?? false,
  );
  const warningClasses = clsx('unfinished-warning', {
    'unfinished-warning-closed': warningClosed,
  });
  const closeWarning = useCallback(() => {
    window.localStorage.setItem('viewport-warning-closed', true);
    setWarningClosed(true);
  }, []);
  const blocker = useCallback(e => {
    e.stopPropagation();
  }, []);

  return (
    <>
      <div className="hitzone-fixed" />
      <div className={warningClasses} onClick={closeWarning}>
        <div className="unfinished-warning-inner" onClick={blocker}>
          <img src={warnImg} alt="地铁 老人 手机" />
          <p>
            由于喵喵摸鱼，没有写响应式，因此推荐在宽度 &gt; 1320px
            的窗口或屏幕上查看。 具体进度可以查看{' '}
            <a href="https://github.com/CircuitCoder/gust/issues/1">
              CircuitCoder/gust#1
            </a>
          </p>
        </div>
      </div>
      <Nav />
      <Home />
      <Entry />
    </>
  );
};

export default Root;
