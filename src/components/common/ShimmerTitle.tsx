import type { CSSProperties } from 'react'
import './ShimmerTitle.css'

type ShimmerTitleProps = {
  text: string
  className?: string
  id?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

function ShimmerTitle({ text, className, id, as: Tag = 'span' }: ShimmerTitleProps) {
  return (
    <Tag className={className} id={id}>
      {[...text].map((char, index) => (
        <span
          key={index}
          className="shimmer-letter"
          style={{ '--letter-index': index } as CSSProperties}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </Tag>
  )
}

export default ShimmerTitle
