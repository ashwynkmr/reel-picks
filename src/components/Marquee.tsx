import './Marquee.css'

/**
 * The page header: a bulb-lit marquee with the app name, flanked by two
 * lit poster cases (hidden on narrow screens). The posters are pure CSS
 * art, so no copyrighted imagery is involved.
 */
export function Marquee() {
  return (
    <header className="lobby-top">
      <div className="poster-case" aria-hidden="true">
        <div className="poster-case__label">Now showing</div>
        <div className="poster poster--sunset">
          <div className="poster__sun-lines" />
          <div className="poster__mountains" />
          <div className="poster__grid" />
          <div className="poster__title">Your Pick</div>
          <div className="poster__tag">ONE NIGHT · ONE MOVIE</div>
          <div className="poster__billing" />
        </div>
      </div>

      <div className="marquee-wrap">
        <div className="marquee__crown" aria-hidden="true" />
        <div className="marquee">
          <div className="marquee__bulbs" aria-hidden="true" />
          <p className="marquee__kicker">the picture show</p>
          <h1 className="marquee__title">Reel Picks</h1>
          <div className="marquee__letterboard">
            <div>
              Tonight: <b>your call</b>
            </div>
            <div>All seats · no scrolling</div>
          </div>
        </div>
      </div>

      <div className="poster-case" aria-hidden="true">
        <div className="poster-case__label">Coming soon</div>
        <div className="poster poster--star">
          <div className="poster__star" />
          <div className="poster__title">Take Two</div>
          <div className="poster__tag">THIS TIME IT&apos;S A CLASSIC</div>
          <div className="poster__billing" />
        </div>
      </div>
    </header>
  )
}
