import React, { useEffect, useState, useRef } from 'react'
import QuestionCard from './QuestionCard'
import Results from './Results'
import { motion, AnimatePresence } from 'framer-motion'

const TOTAL_TIME = 30

function useTTS() {
  const synth = window.speechSynthesis
  function speak(text, lang='vi-VN') {
    if (!synth) return
    const ut = new SpeechSynthesisUtterance(text)
    ut.lang = lang
    synth.cancel()
    synth.speak(ut)
  }
  return { speak }
}

export default function Quiz({ questions: initialQuestions }) {
  const { speak } = useTTS()
  const [questions, setQuestions] = useState(initialQuestions || [])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [reveal, setReveal] = useState(false)
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(TOTAL_TIME)
  const [showResults, setShowResults] = useState(false)
  const [wrongQuestions, setWrongQuestions] = useState([])
  const timerRef = useRef(null)

  useEffect(()=> setQuestions(initialQuestions || []),[initialQuestions])

  useEffect(()=> {
    if (!questions.length) return
    resetTimer()
    return ()=> clearInterval(timerRef.current)
  },[index, questions])

  function resetTimer(){
    clearInterval(timerRef.current)
    setTimer(TOTAL_TIME)
    timerRef.current = setInterval(()=> {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleTimeout(); return 0 }
        return t-1
      })
    },1000)
  }

  function handleTimeout(){
    setSelected(null)
    setReveal(true)
    setTimeout(()=> nextQuestion(), 1200)
  }

  function onSelect(i){
    if (reveal) return
    setSelected(i)
    setReveal(true)
    const cur = questions[index]
    if (cur.options[i] === cur.correct) setScore(s => s + 10)
    else { setScore(s => Math.max(0,s-5)); setWrongQuestions(w => [...w, { ...cur, chosen: cur.options[i] }]) }
    setTimeout(()=> nextQuestion(), 1200)
  }

  function nextQuestion(){
    setReveal(false); setSelected(null)
    if (index + 1 < questions.length) setIndex(idx => idx + 1)
    else finish()
  }

  function finish(){
    clearInterval(timerRef.current)
    setShowResults(true)
    const total = questions.length
    const correctCount = Math.round((score + (5 * wrongQuestions.length)) / 10)
    const rec = { correct: correctCount, total, score, date: new Date().toISOString() }
    const raw = JSON.parse(localStorage.getItem('quiz_leaderboard') || '[]')
    raw.unshift(rec)
    localStorage.setItem('quiz_leaderboard', JSON.stringify(raw.slice(0,50)))
  }

  function onReviewWrong(){
    if (!wrongQuestions.length) return
    setQuestions(wrongQuestions.map((q,i)=>({...q,id:i+1})))
    setIndex(0); setSelected(null); setReveal(false); setScore(0); setWrongQuestions([])
  }

  function onPlaySpeech(){
    const cur = questions[index]
    if (!cur) return
    speak(cur.question + '. ' + cur.options.join('. '))
  }

  if (!questions || !questions.length) return <div className="p-6">Không có câu hỏi. Vui lòng nhờ admin upload.</div>
  if (showResults) {
    const lb = JSON.parse(localStorage.getItem('quiz_leaderboard') || '[]')
    return <Results correct={Math.round((score + (5 * wrongQuestions.length)) / 10)} total={questions.length} onRetake={() => window.location.reload()} onReviewWrong={onReviewWrong} leaderboard={lb} />
  }

  const cur = questions[index]
  const correctIndex = cur.options.findIndex(o => o === cur.correct)

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>Câu {index+1}/{questions.length}</div>
        <div>⏱ Tổng: {questions.length * TOTAL_TIME}s</div>
        <div className="w-40">
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
            <div style={{ width: `${((index+1)/questions.length)*100}%` }} className="h-3 bg-gradient-to-r from-brandLightStart to-brandLightEnd transition-all" />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={cur.id} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}}>
          <QuestionCard qObj={cur} onSelect={onSelect} selected={selected} reveal={reveal} correctIndex={correctIndex} onPlaySpeech={onPlaySpeech} />
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm">Thời gian còn: {timer}s</div>
        <div className="flex gap-2">
          <button onClick={onPlaySpeech} className="px-3 py-2 rounded bg-white/10">🔊 Đọc</button>
        </div>
      </div>
    </div>
  )
}
