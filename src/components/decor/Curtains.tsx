import './Curtains.css'

/** Velvet side curtains and the scalloped valance that frame the whole page. Purely decorative. */
export function Curtains() {
  return (
    <div aria-hidden="true">
      <div className="curtain curtain--left" />
      <div className="curtain curtain--right" />
      <div className="valance" />
    </div>
  )
}
