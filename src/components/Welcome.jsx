import React from 'react'
export default function Welcome({ onStart, previewQuestion }) {
  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="glass p-6">
        <h1 className="text-3xl font-poppins mb-4">Chào mừng đến với Quiz</h1>
        <p className="mb-4 text-sm">Hệ thống trắc nghiệm responsive, mobile-first. Mỗi câu có 30s. Không cần đăng nhập.</p>
        <div className="mb-4">
          <div className="text-lg font-semibold mb-2">Ví dụ 1 câu</div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="font-bold text-lg">{previewQuestion.question}</div>
            <div className="mt-2 grid gap-2">
              {previewQuestion.options.map((o,i)=>(
                <div key={i} className="px-3 py-2 bg-white/6 rounded">{o}</div>
              ))}
            </div>
          </div>
        </div>
        <button onClick={onStart} className="px-5 py-3 rounded bg-gradient-to-r from-brandLightStart to-brandLightEnd text-white">Bắt đầu</button>
      </div>
    </div>
  )
}
