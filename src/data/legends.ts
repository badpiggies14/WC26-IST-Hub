export type LegendId = 'messi' | 'ronaldo' | 'neymar'

export type Legend = {
  id: LegendId
  country: string
  flag: string
  playerName: string
  nickname: string
  theme: 'argentina' | 'portugal' | 'brazil'
  funnyLine: string
  chant: string
  accentClass: string
}

export const LEGENDS: Legend[] = [
  {
    id: 'messi',
    country: 'Argentina',
    flag: '🇦🇷',
    playerName: 'Lionel Messi',
    nickname: 'The Little Magician',
    theme: 'argentina',
    funnyLine: 'You clicked Argentina... the left foot has entered the chat.',
    chant: 'Messi Magic Mode: ON',
    accentClass: 'theme-argentina'
  },
  {
    id: 'ronaldo',
    country: 'Portugal',
    flag: '🇵🇹',
    playerName: 'Cristiano Ronaldo',
    nickname: 'The Jump King',
    theme: 'portugal',
    funnyLine: 'Portugal selected... prepare for a celebration louder than your phone speaker.',
    chant: 'Siuuu Energy Activated',
    accentClass: 'theme-portugal'
  },
  {
    id: 'neymar',
    country: 'Brazil',
    flag: '🇧🇷',
    playerName: 'Neymar',
    nickname: 'Samba Dribbler',
    theme: 'brazil',
    funnyLine: 'Brazil clicked... time for samba, skills, and suspicious ankle rolls.',
    chant: 'Joga Bonito Mode',
    accentClass: 'theme-brazil'
  }
]
