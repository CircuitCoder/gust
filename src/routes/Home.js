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
  // Two inner refs is for the two-stage transition
  innerRef = createRef();
  innerVertRef = createRef();
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
        <div className="home-entity-inner-vert" ref={this.innerVertRef}>
          <div className="home-entity-inner" ref={this.innerRef}>
            {children}
          </div>
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
    const innerVert = this.innerVertRef.current;
    const dummy = this.dummyRef.current;
    if (!dummy || !inner) return;
    console.assert(innerVert, 'Inconsistency in react render tree');

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
      console.warn(
        `Unexpected X displacement: ${flipped.x}, should be ${EXPECTED_X_DISP}`,
      );
    const xratio = flipped.x / EXPECTED_X_DISP;

    /**
     * Use WAAPI to avoid CSS shenanigans
     * TODO: interrupt ongoing transitions
     *
     * We need to queue effectively three different animations to
     * deal with three non-uniform transition caused by
     * the staggered movement of the logo.
     *
     * - Vertical displacement + gap, starts immediately
     * - Logo shrink, starts immediately
     * - Logo move, starts with delay
     *
     * The first two can be merged(same delay & duration), so that's what we did.
     * But if related constants changes in the SCSS, then we will have to split those
     */

    // First, translateY manually on wrapper element
    innerVert.animate(
      [{
        transform: `translateY(${flipped.y}px)`,
      }, {
        transform: 'none',
      }],
      {
        duration: 500,
        easing: 'ease',
        fill: 'both',
      },
    );

    /**
     * A helper function to do animations.
     * We used an option object because we would like to keep the duration optional,
     * but that will be inconsistence with the CSS format (duration delay) if we are to
     * use ordinary parameters.
     * 
     * Also, we are animating custom CSS properties (namely `var`s). This requires a typed
     * custom property, which is rather new in current browsers (Chrome since 85, FF unsupported).
     * An JS (CSSOM) version of the Houdini API is already available ever since approx. a year earlier,
     * so we may want to use that as a fallback.
     * 
     * TODO: fallback `@property` to CSSOM
     */
    function varTrans(name, from, { delay = 0, duration = 500 } = {}) {
      inner.animate(
        [{
          [name]: from,
        }, {
          [name]: 0,
        }],
        {
          duration,
          delay,
          easing: 'ease',
          fill: 'both',
        },
      );
    }

    const HALF_LOGO_SHRINK = (420 - 120) / 2;
    varTrans('--home-pin-early', `${xratio * (40 + HALF_LOGO_SHRINK)}px`);
    varTrans('--home-pin-late', `${xratio * HALF_LOGO_SHRINK}px`, { delay: 100 });
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
