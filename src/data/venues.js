export const VENUES = [
  {
    id: 'azteca',
    name: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'Mexico',
    capacity: '87,523',
    timezone: 'Central Time',
    display: 'Estadio Azteca, Mexico City'
  },
  { id: 'guadalajara', name: 'Estadio Guadalajara', city: 'Guadalajara', country: 'Mexico', capacity: '48,071', timezone: 'Central Time', display: 'Estadio Guadalajara' },
  { id: 'monterrey', name: 'Estadio Monterrey', city: 'Monterrey', country: 'Mexico', capacity: '53,500', timezone: 'Central Time', display: 'Estadio Monterrey' },
  { id: 'toronto', name: 'Toronto Stadium', city: 'Toronto', country: 'Canada', capacity: '45,500', timezone: 'Eastern Time', display: 'Toronto Stadium' },
  { id: 'vancouver', name: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: '54,500', timezone: 'Pacific Time', display: 'BC Place, Vancouver' },
  { id: 'atlanta', name: 'Atlanta Stadium', city: 'Atlanta', country: 'USA', capacity: '75,000', timezone: 'Eastern Time', display: 'Atlanta Stadium' },
  { id: 'boston', name: 'Boston Stadium', city: 'Boston', country: 'USA', capacity: '65,878', timezone: 'Eastern Time', display: 'Boston Stadium' },
  { id: 'dallas', name: 'Dallas Stadium', city: 'Dallas', country: 'USA', capacity: '92,967', timezone: 'Central Time', display: 'Dallas Stadium' },
  { id: 'houston', name: 'Houston Stadium', city: 'Houston', country: 'USA', capacity: '72,220', timezone: 'Central Time', display: 'Houston Stadium' },
  { id: 'kansas', name: 'Kansas City Stadium', city: 'Kansas City', country: 'USA', capacity: '73,000', timezone: 'Central Time', display: 'Kansas City Stadium' },
  { id: 'losangeles', name: 'Los Angeles Stadium', city: 'Los Angeles', country: 'USA', capacity: '70,240', timezone: 'Pacific Time', display: 'Los Angeles Stadium' },
  { id: 'miami', name: 'Miami Stadium', city: 'Miami', country: 'USA', capacity: '65,326', timezone: 'Eastern Time', display: 'Miami Stadium' },
  { id: 'newyork', name: 'New York New Jersey Stadium', city: 'East Rutherford', country: 'USA', capacity: '82,500', timezone: 'Eastern Time', display: 'New York New Jersey Stadium' },
  { id: 'philadelphia', name: 'Philadelphia Stadium', city: 'Philadelphia', country: 'USA', capacity: '69,879', timezone: 'Eastern Time', display: 'Philadelphia Stadium' },
  { id: 'bayarea', name: 'Bay Area Stadium', city: 'Santa Clara', country: 'USA', capacity: '71,000', timezone: 'Pacific Time', display: 'Bay Area Stadium' },
  { id: 'seattle', name: 'Seattle Stadium', city: 'Seattle', country: 'USA', capacity: '69,000', timezone: 'Pacific Time', display: 'Seattle Stadium' }
]

export const VENUE_MAP = Object.fromEntries(VENUES.map((venue) => [venue.name, venue]))

export function getVenue(name) {
  return VENUE_MAP[name] || VENUES[0]
}
