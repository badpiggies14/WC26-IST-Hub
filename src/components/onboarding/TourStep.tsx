import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import type { TourStepConfig } from '../../data/tourSteps'

type TourStepProps = {
  step: TourStepConfig
  index: number
  total: number
  isMobile: boolean
  onBack: () => void
  onNext: () => void
  onSkip: () => void
}

export default function TourStep({ step, index, total, isMobile, onBack, onNext, onSkip }: TourStepProps) {
  const isLast = index === total - 1

  return (
    <section className={`tour-card ${isMobile ? 'mobile-sheet' : ''}`} role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className="tour-card-top">
        <span className="card-kicker">Tutorial • Step {index + 1} of {total}</span>
        <button className="icon-btn compact" type="button" onClick={onSkip} aria-label="Skip tutorial">
          <X size={16} />
        </button>
      </div>
      <h2 id="tour-title">{step.title}</h2>
      <p>{step.text}</p>
      <div className="tour-progress" aria-hidden="true">
        {Array.from({ length: total }).map((_, dotIndex) => (
          <span key={dotIndex} className={dotIndex <= index ? 'active' : ''} />
        ))}
      </div>
      <div className="tour-actions">
        <button className="btn btn-ghost" type="button" onClick={onBack} disabled={index === 0}>
          <ArrowLeft /> Back
        </button>
        <button className="btn btn-primary" type="button" onClick={onNext}>
          {isLast ? 'Finish' : 'Next'} {!isLast ? <ArrowRight /> : null}
        </button>
      </div>
    </section>
  )
}
