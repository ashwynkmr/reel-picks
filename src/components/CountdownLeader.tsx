import './CountdownLeader.css'

/** The idle screen: a classic film-leader countdown, waiting for the lever. */
export function CountdownLeader() {
  return (
    <div className="leader">
      <div className="leader__dial" aria-hidden="true">
        <div className="leader__sweep" />
        <div className="leader__num">3</div>
      </div>
      <p className="leader__prompt">Pull the lever to roll film</p>
    </div>
  )
}
