import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
export default function QuestionCard({ qObj, onSelect, selected, reveal, correctIndex, onPlaySpeech }) {
  useEffect(()=> {
    const el = document.getElementById('question-text')
    if (el) el.focus()
  }, [qObj])
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 id="question-text" tabIndex={-1} className="font-poppins text-[20px] font-semibold leading-tight">{qObj.question}</h2>
        <button aria-label="Read question" onClick={onPlaySpeech} className="ml-2">🔊</button>
      </div>
      <div className="grid gap-3">
        {qObj.options.map((opt, i) => {
          let bg = 'bg-white/6'
          if (reveal) {
            if (i === correctIndex) bg = 'bg-[rgba(52,211,153,0.45)]'
            else if (selected === i) bg = 'bg-[rgba(248,113,113,0.45)]'
            else bg = 'bg-white/5'
          } else if (selected === i) bg = 'bg-white/10'
          return (
            <motion.button
              key={i}
              onClick={() => onSelect(i)}
              disabled={reveal}
              className={`ripple w-full text-left px-4 py-3 rounded-lg shadow-inner font-medium text-[16px] leading-6 ${bg}`}
              whileTap={{ scale: 0.98 }}
              aria-pressed={selected===i}
              aria-label={`Option ${i+1}: ${opt}`}
            >
              {opt}
            </motion.button>
          )
        })}
      </div>
      {qObj.explanation && reveal && (
        <div className="mt-4 p-3 bg-white/6 rounded text-sm">
          <strong>Giải thích:</strong> {qObj.explanation}
        </div>
      )}
    </motion.div>
  )
}
