import { useState } from 'react'
import { executiveBoard } from '../data/executiveBoard'
import type { ExecutiveBoardMember } from '../data/executiveBoard'
import './ExecutiveBoard.css'

function TeamMemberCard({
  member,
  hovered,
  selected,
  dimmed,
  onHover,
  onSelect,
}: {
  member: ExecutiveBoardMember
  hovered: boolean
  selected: boolean
  dimmed: boolean
  onHover: (hovering: boolean) => void
  onSelect: () => void
}) {
  const isActive = hovered || selected

  return (
    <article
      className={`executive-member${isActive ? ' executive-member--active' : ''}${selected ? ' executive-member--selected' : ''}${dimmed ? ' executive-member--dimmed' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${member.name}, ${member.designation}`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
    >
      {member.photo ? (
        <img
          className="executive-member__portrait"
          src={member.photo}
          alt={`Portrait of ${member.name}`}
        />
      ) : (
        <div
          className="executive-member__portrait executive-member__portrait--placeholder"
          role="img"
          aria-label={`Portrait unavailable for ${member.name}`}
        >
          <span className="executive-member__silhouette" aria-hidden="true" />
        </div>
      )}
      <div className="executive-member__details">
        <h3>{member.name}</h3>
        <span className="executive-member__accent" aria-hidden="true" />
        <p>{member.designation}</p>
      </div>
    </article>
  )
}

function ExecutiveBoard() {
  const [hoveredName, setHoveredName] = useState<string | null>(null)
  const [selectedName, setSelectedName] = useState<string | null>(null)

  const activeName = hoveredName ?? selectedName

  return (
    <main className="executive-board-page">
      <div className="executive-board-container">
        <header className="executive-board-heading">
          <h1>Executive Board</h1>
        </header>
        <div className="executive-board-sections">
          {executiveBoard.map(({ id, title, members }) => (
            <section
              className="executive-board-section"
              key={id}
              aria-labelledby={`executive-board-${id}`}
            >
              <header className="executive-board-section__heading">
                <h2 id={`executive-board-${id}`}>{title}</h2>
              </header>
              <ul className="executive-board-grid">
                {members.map((member) => (
                  <li
                    key={member.name}
                    className={`executive-board-grid__item${selectedName === member.name ? ' executive-board-grid__item--featured' : ''}`}
                  >
                    <TeamMemberCard
                      member={member}
                      hovered={hoveredName === member.name}
                      selected={selectedName === member.name}
                      dimmed={
                        activeName !== null &&
                        activeName !== member.name &&
                        selectedName !== member.name
                      }
                      onHover={(hovering) =>
                        setHoveredName(hovering ? member.name : null)
                      }
                      onSelect={() =>
                        setSelectedName((current) =>
                          current === member.name ? null : member.name
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}

export default ExecutiveBoard
