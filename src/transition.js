/**
 * Transition library.
 */

import BezierEasing from 'bezier-easing';

let SUPPORTS_REG = false;

export function init() {
  if (typeof CSS?.registerProperty === 'function') {
    SUPPORTS_REG = true;

    // See: styles/def.css
    CSS.registerProperty({
      name: '--home-pin-vert',
      syntax: '<length>',
      inherits: true,
      initialValue: '0px',
    });

    CSS.registerProperty({
      name: '--home-pin-early',
      syntax: '<length>',
      inherits: true,
      initialValue: '0px',
    });

    CSS.registerProperty({
      name: '--home-pin-late',
      syntax: '<length>',
      inherits: true,
      initialValue: '0px',
    });
  }
}

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
 */
export function trans(el, name, from, { delay = 0, duration = 500 } = {}) {
  if (SUPPORTS_REG && typeof el.animate === 'function') {
    el.animate(
      [
        {
          [name]: `${from}px`,
        },
        {
          [name]: '0px',
        },
      ],
      {
        duration,
        delay,
        easing: 'ease',
        fill: 'both',
      },
    );
  } else {
    if (!ANIMATIONS) {
      // Kickoff animation queue
      ANIMATIONS = new Map();
      tick();
    }

    // Polyfill brrr
    let mapper = ANIMATIONS.get(el);
    if (!mapper) {
      mapper = {};
      ANIMATIONS.set(el, mapper);
    }
    mapper[name] = {
      start: window.performance.now() + delay,
      from,
      duration,
    };
  }
}

let ANIMATIONS = null;
const EASING = BezierEasing(0.25, 0.1, 0.25, 1.0);

function tick(now) {
  for (const [el, queue] of ANIMATIONS.entries()) {
    if (!document.body.contains(el)) {
      ANIMATIONS.remove(el);
    }

    for (const name in queue) {
      if (queue[name] === null) continue;

      const { start, from, duration } = queue[name];
      let ratio = (now - start) / duration;

      if (ratio > 1) {
        queue[name] = null;
        ratio = 1;
      } else if (ratio < 0) {
        ratio = 0;
      }

      const val = (1 - EASING(ratio)) * from;
      el.style.setProperty(name, `${val}px`);
    }
  }

  requestAnimationFrame(tick);
}
