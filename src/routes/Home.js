import React, { createRef, PureComponent, useEffect } from 'react';
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

    const cn = clsx(className, 'home-entity', {
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

    const inner = this.innerRef.current;
    if (!inner) {
      return null;
    } else {
      const bbox = inner.getBoundingClientRect();
      return bbox;
    }
  }

  componentDidUpdate(pp, ps, snapshot) {
    if (snapshot === null) return; // Pinned state unchanged

    const inner = this.innerRef.current;
    const dummy = this.dummyRef.current;
    if (!dummy || !inner) return;

    const { height } = snapshot;
    dummy.style.height = height + 'px';

    const bbox = inner.getBoundingClientRect();

    const flipped = {
      x: snapshot.x - bbox.x, // This is unused. See the comment below
      y: snapshot.y - bbox.y,
    };

    /**
     * We weakly asserts that math.abs(flipped.x) ===
     *
     * [Icon]        [Gap]
     * (420 - 120) + (60 - 10)
     *
     */
    const EXPECTED_X_DISP = 420 - 120 + 60 - 20;
    if (Math.abs(flipped.x) !== EXPECTED_X_DISP)
      console.warn(`Unexpected X displacement: ${flipped.x}, should be ${EXPECTED_X_DISP}`);

    // Use WAAPI to avoid CSS shenanigans
    // TODO: interrupt ongoing transitions
    const transition = inner.animate(
      [
        {
          transform: `translateY(${flipped.y}px)`,
        },
        {
          transform: 'none',
        },
      ],
      {
        duration: 500,
        easing: 'ease',
      },
    );

    transition.play();
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
          <div className="home-pin-clip">
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
          </div>

          <div className="home-pin-anti-clip">
            <div className="home-tile-meta-pinned">
              <div className="home-tile-meta-pinned-sharp">#</div>
              <div className="home-tile-meta-pinned-slug">{entry.slug}</div>
            </div>

            <div className="home-tile-inner-pinned">
              <div className="home-tile-inner-pinned-summary">
                <div className="home-tile-inner-pinned-summary-text">
                  {entry.desc}
                </div>
              </div>
              <div className="home-tile-inner-pinned-mtime">
                <div className="home-tile-inner-pinned-mtime-text">
                  {entry.last_modified}
                </div>
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
