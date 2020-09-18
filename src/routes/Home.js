import React, {
  createRef,
  PureComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchList } from '../store/actions';
import { Link } from 'react-router-dom';
import { useTitle } from '../utils/hooks';
import Main from '../comps/Main';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';

class ListingEntryEntity extends PureComponent {
  innerRef = createRef();
  dummyRef = createRef();

  render() {
    const { pinned, frozen, className, children, ...rest } = this.props;

    const cn = clsx(className, "home-entity", {
      'home-entity-pinned': pinned,
      'home-entity-frozen': frozen,
    });

    return (
      <div className={cn} {...rest}>
        <div className="home-entity-dummy" ref={this.dummyRef}></div>
        <div className="home-entity-inner" ref={this.innerRef}>
          {children}
        </div>
      </div>
    );
  }

  getSnapshotBeforeUpdate(pp) {
    if (pp.pinned === this.props.pinned) return null;

    if (!this.innerRef.current) {
      return null;
    } else {
      const bbox = this.innerRef.current.getBoundingClientRect();
      return bbox.height;
    }
  }

  componentDidUpdate(pp, ps, snapshot) {
    if (snapshot === null) return; // Pinned state unchanged

    const dummy = this.dummyRef.current;
    if(!dummy) return;
    dummy.style.height = snapshot + 'px';
  }
}

const ListingEntry = ({ entry, current, ...rest }) => {
  const pinned = entry.slug === current;
  const frozen = !pinned && current !== null;

  return (
    <ListingEntryEntity pinned={pinned} frozen={frozen}>
      <CSSTransition
        classNames="listing-fade"
        appear={true}
        in={!frozen}
        timeout={1000}
      >
        <Link to={`/entry/${entry.slug}`} className="home-tile">
          <div className="home-tile-meta">
            <div className="home-tile-meta-sharp">#</div>
            <div className="home-tile-meta-slug">{entry.slug}</div>

            <div className="home-tile-meta-author">{entry.author}</div>
          </div>

          <div className="home-tile-inner">
            <div className="home-tile-inner-summary">
              <div className="home-tile-inner-summary-text">{entry.desc}</div>
            </div>
            <div className="home-tile-inner-mtime">
              <div className="home-tile-inner-mtime-text">
                {entry.last_modified}
              </div>
            </div>
          </div>
        </Link>
      </CSSTransition>
    </ListingEntryEntity>
  );
};

const Home = () => {
  const dispatch = useDispatch();

  // Set title
  useTitle('🎐');

  // Load listing on startup
  useEffect(() => {
    dispatch(fetchList());
  }, [dispatch]);

  const listing = useSelector(({ listing }) => listing);

  // For debugging
  /*
  if (listing && listing.entries) {
    listing.entries = [
      ...listing.entries,
      ...listing.entries,
    ];
  }
  */

  const homeMatch = useRouteMatch({
    path: '/',
    exact: true,
  });

  const entryMatch = useRouteMatch({
    path: '/entry/:slug',
    exact: true,
  });

  const slug = entryMatch?.params?.slug ?? null;

  return (
    <Main className="home" off={homeMatch}>
      <div className="home-left"></div>

      <div className="home-right">
        {listing &&
          listing.entries.map(e => (
            <ListingEntry key={e.slug} current={slug} entry={e} />
          ))}
      </div>
    </Main>
  );
};

export default Home;
