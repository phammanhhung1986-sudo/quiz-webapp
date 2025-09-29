import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
export default function ThemeToggle({ theme, setTheme }) {
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])
  return (
    <button aria-label="Toggle theme" className="p-2 rounded-full" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <motion.div animate={{ rotate: theme === 'dark' ? 180 : 0 }} transition={{ duration: 0.6 }}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </motion.div>
    </button>
  )
}
