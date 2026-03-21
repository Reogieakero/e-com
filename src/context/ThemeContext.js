'use client'
import { createContext, useContext, useState, useCallback } from 'react'

const ThemeContext = createContext({ theme: 'light', setTheme: () => {} })

export function ThemeProvider({ children }) {
  // Read from localStorage synchronously on first render (client only)
  // No useEffect / useLayoutEffect needed — no linter error
  const getInitial = () => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('admin-theme') || 'light'
  }

  const [theme, setThemeState] = useState(getInitial)

  const setTheme = useCallback((t) => {
    setThemeState(t)
    localStorage.setItem('admin-theme', t)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)