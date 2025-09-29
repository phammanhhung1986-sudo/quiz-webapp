import React from 'react'
export default function Leaderboard({ entries }) {
  if (!entries || !entries.length) return <div>Chưa có thành tích</div>
  return (
    <div>
      <h4 className="font-semibold mb-2">Leaderboard</h4>
      <ol className="pl-5">
        {entries.slice(0,10).map((e,i)=>(
          <li key={i} className="mb-1">{i+1}. {e.correct}/{e.total} — {new Date(e.date).toLocaleString()}</li>
        ))}
      </ol>
    </div>
  )
}
