import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set) => ({
      favoriteTeams: ['ARG', 'FRA', 'BRA'],
      favoriteMatches: [],
      toggleFavoriteTeam: (code) =>
        set((state) => ({
          favoriteTeams: state.favoriteTeams.includes(code)
            ? state.favoriteTeams.filter((team) => team !== code)
            : state.favoriteTeams.length < 5
              ? [...state.favoriteTeams, code]
              : state.favoriteTeams
        })),
      toggleFavoriteMatch: (id) =>
        set((state) => ({
          favoriteMatches: state.favoriteMatches.includes(id)
            ? state.favoriteMatches.filter((matchId) => matchId !== id)
            : [...state.favoriteMatches, id]
        })),

      notificationAlarms: {},
      notificationsEnabled: true,
      goalAlertsEnabled: true,
      toggleNotificationsEnabled: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      toggleGoalAlertsEnabled: () => set((state) => ({ goalAlertsEnabled: !state.goalAlertsEnabled })),
      setMatchAlarm: (matchId, type = '15min') =>
        set((state) => ({
          notificationAlarms: {
            ...state.notificationAlarms,
            [matchId]: {
              ...(state.notificationAlarms[matchId] || {}),
              [type]: !(state.notificationAlarms[matchId] || {})[type]
            }
          }
        })),

      selectedDate: '2026-06-11',
      setSelectedDate: (date) =>
        set({
          selectedDate: typeof date === 'string' ? date : date.toISOString().slice(0, 10)
        }),
      activeFilter: 'all',
      setActiveFilter: (filter) => set({ activeFilter: filter }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      activePage: 'home',
      setActivePage: (page) => set({ activePage: page }),
      appTheme: 'stadium',
      setAppTheme: (theme) => set({ appTheme: theme }),
      timeDisplayMode: 'ist',
      setTimeDisplayMode: (mode) => set({ timeDisplayMode: mode }),

      liveMatches: {},
      setLiveMatch: (matchId, value) =>
        set((state) => ({
          liveMatches: {
            ...state.liveMatches,
            [matchId]: { ...(state.liveMatches[matchId] || {}), ...value }
          }
        }))
    }),
    {
      name: 'fifa-2026-hub',
      version: 3,
      migrate: (persistedState) => ({
        ...persistedState,
        liveMatches: {},
        appTheme: persistedState?.appTheme || 'stadium',
        timeDisplayMode: persistedState?.timeDisplayMode || 'ist'
      }),
      partialize: (state) => ({
        favoriteTeams: state.favoriteTeams,
        favoriteMatches: state.favoriteMatches,
        notificationAlarms: state.notificationAlarms,
        notificationsEnabled: state.notificationsEnabled,
        goalAlertsEnabled: state.goalAlertsEnabled,
        selectedDate: state.selectedDate,
        activeFilter: state.activeFilter,
        searchQuery: state.searchQuery,
        activePage: state.activePage,
        appTheme: state.appTheme,
        timeDisplayMode: state.timeDisplayMode
      })
    }
  )
)
