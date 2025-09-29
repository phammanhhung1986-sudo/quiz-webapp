import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)
export default function Results({ correct, total, onRetake, onReviewWrong, leaderboard }) {
  const wrong = total - correct
  const pct = Math.round((correct / total) * 100 || 0)
  const emoji = pct >= 90 ? '🏆🎉' : pct >= 50 ? '🙂' : '😔'
  const data = {
    labels: ['Đúng', 'Sai'],
    datasets: [{ data: [correct, wrong], backgroundColor: ['rgba(52,211,153,0.8)','rgba(248,113,113,0.8)'] }]
  }
  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="glass p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-poppins">Kết quả {emoji}</h2>
          <div className="text-sm">Đúng: <strong>{correct}</strong> — Sai: <strong>{wrong}</strong></div>
        </div>
        <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4"><Pie data={data} /></div>
          <div className="p-4">
            <div className="mb-2">Tiến trình</div>
            <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden mb-2">
              <div style={{ width: `${pct}%` }} className="h-4 bg-gradient-to-r from-brandLightStart to-brandLightEnd" />
            </div>
            <div className="mb-4 text-sm">{pct}%</div>
            <div className="flex gap-2">
              <button onClick={onRetake} className="px-4 py-2 rounded bg-white/10">Làm lại</button>
              <button onClick={onReviewWrong} className="px-4 py-2 rounded bg-white/10">Ôn câu sai</button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Leaderboard (Top 10)</h3>
          {leaderboard && leaderboard.length ? (
            <ol className="list-decimal pl-5">
              {leaderboard.slice(0,10).map((r,i)=>(
                <li key={i} className="mb-1 text-sm">{r.correct}/{r.total} — {new Date(r.date).toLocaleString()}</li>
              ))}
            </ol>
          ) : <div className="text-sm">Chưa có kết quả</div>}
        </div>
      </div>
    </div>
  )
}
