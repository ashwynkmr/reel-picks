import type { CSSProperties } from 'react'
import { PLATFORMS, type PlatformId } from '../domain/catalogue.ts'
import './PlatformFilter.css'

interface Props {
  selected: PlatformId[]
  onToggle: (id: PlatformId) => void
}

/** Small fixed tilts so the tickets look hand-placed, not randomised on every render. */
const TILTS = ['-2deg', '1.5deg', '-1deg', '2deg', '-1.5deg', '1deg']
const FIRST_TICKET_NUMBER = 417

/**
 * The box office: one admission ticket per streaming service.
 * Each ticket is a real checkbox (visually hidden) so keyboard and screen
 * reader behaviour comes from the platform. The last selected service
 * can't be switched off.
 */
export function PlatformFilter({ selected, onToggle }: Props) {
  const onlyOneLeft = selected.length === 1

  return (
    <section className="kiosk box-office" aria-labelledby="box-office-title">
      <h2 id="box-office-title" className="sign">
        Box office
      </h2>
      <fieldset className="box-office__fieldset">
        <legend className="sign__sub">Which tickets do you hold?</legend>
        <div className="box-office__window">
          <div className="box-office__grille" aria-hidden="true" />
          <div className="tickets">
            {PLATFORMS.map((platform, i) => {
              const checked = selected.includes(platform.id)
              const locked = checked && onlyOneLeft
              return (
                <label
                  key={platform.id}
                  className={`ticket ${checked ? 'is-on' : 'is-off'}`}
                  style={{ '--tilt': TILTS[i % TILTS.length] } as CSSProperties}
                  title={locked ? 'Keep at least one' : undefined}
                >
                  <input
                    type="checkbox"
                    className="visually-hidden"
                    checked={checked}
                    disabled={locked}
                    onChange={() => onToggle(platform.id)}
                  />
                  <span className="ticket__stub" aria-hidden="true">
                    No {String(FIRST_TICKET_NUMBER + i).padStart(4, '0')}
                  </span>
                  <span className="ticket__body">
                    <span className="ticket__admit" aria-hidden="true">
                      Admit one
                    </span>
                    <span className="ticket__name">{platform.label}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      </fieldset>
      <p className="box-office__prices" aria-live="polite">
        {onlyOneLeft ? (
          'Keep at least one service switched on.'
        ) : (
          <span aria-hidden="true">
            <span>Admission $2.50</span>
            <span>Matinee $1.75</span>
          </span>
        )}
      </p>
    </section>
  )
}
