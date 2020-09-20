import React, { createRef, PureComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchList } from '../store/actions';
import { Link } from 'react-router-dom';
import { useTitle } from '../utils/hooks';
import Main from '../comps/Main';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { REV } from '../config';
import { trans } from '../transition';

const RepoStatus = ({ slug, rev, icon, ...rest }) => (
  <a
    className="repo-status"
    href={`https://github.com/${slug}`}
    data-icon={icon}
  >
    <div className="repo-status-slug">{slug}</div>
    <div className="repo-status-rev">{rev.substr(0, 7)}</div>
  </a>
);

class ListingEntryEntity extends PureComponent {
  // Two inner refs is for the two-stage transition
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
     * TODO: use variables exported from SCSS
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
     * We need to queue effectively four different animations to
     * deal with three non-uniform transition caused by
     * the staggered movement of the logo.
     *
     * - Vertical displacement, starts immediately
     * - Gap, starts immediately
     * - Logo shrink, starts immediately
     * - Logo move, starts with delay
     *
     * The 2nd & 3rd can be merged(same delay & duration), so that's what we did.
     * But if related constants changes in the SCSS, then we will have to split those
     */

    // First, animate vertical displacement
    trans(inner, '--home-pin-vert', flipped.y);

    const HALF_LOGO_SHRINK = (420 - 120) / 2;

    // NOT-TODO: because these two are constants, maybe we can move the transition
    //   into the CSS file instead?
    //   `xratio` is consistent throughout each INDIVIDUAL transition, so it can be
    //   included as a multiply factor in the calc clause?
    // Then we may be able to share less variables across JS/SCSS
    // But that will also divide up the logic for transform.
    // Why not todo: shim for firefox
    trans(inner, '--home-pin-early', xratio * (40 + HALF_LOGO_SHRINK));
    trans(inner, '--home-pin-late', xratio * HALF_LOGO_SHRINK, { delay: 100 });
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

              <div className="home-tile-inner-sheet"></div>
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
  useTitle(
    {
      path: '/',
      exact: true,
    },
    () => '🎐',
  );

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

  const folded = useSelector(({ folded }) => folded);
  const cn = clsx('home', {
    'home-folded': folded,
  });

  return (
    <Main className={cn} on={homeMatch} dir="y">
      <div className="home-left">
        <div>
          <RepoStatus slug="CircuitCoder/gust" rev={REV.WEB} icon="</>" />
        </div>
        <div>
          <RepoStatus slug="CircuitCoder/gust-gen" rev={REV.GEN} icon="()" />
        </div>
        <div>
          <RepoStatus slug="CircuitCoder/gust-data" rev={REV.SRC} icon="##" />
        </div>
      </div>

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
