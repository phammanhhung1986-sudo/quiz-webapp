import React, { useState, useEffect } from 'react'
import Welcome from './components/Welcome'
import Quiz from './components/Quiz'
import Admin from './components/Admin'
import ThemeToggle from './components/ThemeToggle'
import fallback from './assets/fallback-questions.json'
export default function App(){
  const [activeQuestions, setActiveQuestions] = useState(() => {
    const raw = localStorage.getItem('active_questions_data')
    if (raw) try { return JSON.parse(raw) } catch { return null }
    return null
  })
  const [theme, setTheme] = useState(() => {
    const def = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    return localStorage.getItem('theme') || def
  })
  useEffect(()=> { localStorage.setItem('theme', theme) },[theme])
  function handleSetActiveQuestions(questions){
    setActiveQuestions(questions)
    localStorage.setItem('active_questions_data', JSON.stringify(questions))
  }
  const path = window.location.pathname
  if (path.startsWith('/admin')) {
    return <div className="min-h-screen p-4">
      <div className="flex justify-end p-2"><ThemeToggle theme={theme} setTheme={setTheme} /></div>
      <Admin onSetActiveQuestions={handleSetActiveQuestions} />
    </div>
  }
  const preview = activeQuestions && activeQuestions.length ? activeQuestions[0] : fallback[0]
  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-end p-2"><ThemeToggle theme={theme} setTheme={setTheme} /></div>
      {!activeQuestions ? (
        <Welcome previewQuestion={preview} onStart={() => {
          const data = (activeQuestions && activeQuestions.length) ? activeQuestions : fallback
          if (!data || !data.length) { alert('Chưa có bộ câu hỏi. Vui lòng nhờ admin upload.'); return }
          handleSetActiveQuestions(data)
        }} />
      ) : (
        <Quiz questions={activeQuestions} />
      )}
    </div>
  )
}
