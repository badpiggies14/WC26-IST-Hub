export type TourStepConfig = {
  id: string
  title: string
  text: string
  selector?: string
  mobileOnly?: boolean
}

export const TOUR_STEPS: TourStepConfig[] = [
  {
    id: 'welcome',
    title: 'Welcome to WC26 IST Hub',
    text: 'Track every World Cup 2026 match day-wise, with Indian Standard Time at the center.'
  },
  {
    id: 'match-cards',
    title: 'IST Match Cards',
    text: 'Every kickoff is converted to IST, with venue local time available for comparison.',
    selector: '[data-tour="next-match-card"], [data-tour="match-card"]'
  },
  {
    id: 'timezone',
    title: 'Timezone Switcher',
    text: 'Compare IST, venue local time, your browser timezone, and UTC instantly.',
    selector: '[data-tour="timezone-selector"]'
  },
  {
    id: 'filters',
    title: 'Filters & Search',
    text: 'Search by team, date, venue, group, round, or match number.',
    selector: '[data-tour="filters-search"], [data-global-search]'
  },
  {
    id: 'favorites',
    title: 'Favorites',
    text: 'Save teams and matches so you never miss your favorites.',
    selector: '[data-tour="favorite-action"], .star-btn'
  },
  {
    id: 'reminders',
    title: 'Reminders',
    text: 'Set match reminders, including late-night Chai Alarms.',
    selector: '[data-tour="reminder-action"], .reminder-control'
  },
  {
    id: 'live',
    title: 'Live Scores',
    text: 'When matches are live, scores update automatically. If nothing is live, the hub says so clearly.',
    selector: '[data-tour="api-status"], .api-status'
  },
  {
    id: 'mobile-nav',
    title: 'Mobile Navigation',
    text: 'Use the bottom nav for fast one-handed browsing on phones.',
    selector: '.mobile-bottom-nav',
    mobileOnly: true
  },
  {
    id: 'finish',
    title: 'You are ready',
    text: 'Pick your favorite teams, set reminders, and start exploring every kickoff in IST.'
  }
]
