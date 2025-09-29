import React, { useEffect, useState } from 'react'
import * as storage from '../lib/storageService'
import { parseExcelFile } from '../lib/excelParser'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
export default function Admin({ onSetActiveQuestions }) {
  const [pw, setPw] = useState('')
  const [files, setFiles] = useState([])
  const [selectedFileId, setSelectedFileId] = useState(null)
  const [status, setStatus] = useState('')
  const [previewQuestions, setPreviewQuestions] = useState([])
  const [uploading, setUploading] = useState(false)
  async function loadFiles() {
    try { const list = await storage.listFiles(); setFiles(list) } catch (e) { setStatus('Lỗi lấy danh sách file: '+e.message) }
  }
  useEffect(()=>{ loadFiles() },[])
  async function handleUpload(e) {
    const file = e.target.files[0]; if (!file) return
    if (pw !== ADMIN_PASSWORD) { setStatus('Sai mật khẩu admin.'); return }
    setUploading(true)
    const parsed = await parseExcelFile(file)
    if (parsed.errors && parsed.errors.length) { setStatus('Lỗi parse: '+parsed.errors.join('; ')); setUploading(false); return }
    const res = await storage.uploadFile(file)
    if (!res.ok) { setStatus('Lỗi upload: '+(res.error||'unknown')); setUploading(false); return }
    setStatus('Upload thành công: '+res.name); setUploading(false); await loadFiles()
  }
  async function handleSelectFile(fileId) {
    try {
      const blob = await storage.getFileBlob(fileId)
      const file = new File([blob], 'selected.xlsx')
      const parsed = await parseExcelFile(file)
      if (parsed.errors && parsed.errors.length) { setStatus('Lỗi parse file: '+parsed.errors.join('; ')); return }
      setPreviewQuestions(parsed.questions); setSelectedFileId(fileId)
    } catch (e) { setStatus('Lỗi tải file: '+e.message) }
  }
  async function applyAsActive() {
    if (!selectedFileId) { setStatus('Chưa chọn file'); return }
    const blob = await storage.getFileBlob(selectedFileId)
    const file = new File([blob], 'selected.xlsx')
    const parsed = await parseExcelFile(file)
    if (parsed.questions.length === 0) { setStatus('File không có câu hợp lệ.'); return }
    onSetActiveQuestions(parsed.questions)
    setStatus('Đã áp dụng file làm bộ câu hỏi hiện tại.')
  }
  async function handleDelete(id) {
    if (!confirm('Xóa file?')) return
    const res = await storage.deleteFile(id)
    if (!res.ok) setStatus('Lỗi xóa: '+(res.error||'unknown'))
    else { setStatus('Đã xóa'); await loadFiles() }
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="glass p-6">
        <h2 className="text-2xl font-poppins mb-4">Admin - Upload & Quản lý file</h2>
        <div className="mb-4">
          <label className="block mb-1">Mật khẩu admin</label>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} className="p-2 w-full rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Upload file Excel (.xlsx)</label>
          <input type="file" accept=".xlsx,.xls" onChange={handleUpload} />
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Danh sách file đã upload</h3>
          {files.length ? (
            <ul>
              {files.map(f=>(
                <li key={f.id} className="flex items-center justify-between mb-2">
                  <span>{f.name}</span>
                  <div className="flex gap-2">
                    <button onClick={()=>handleSelectFile(f.id)} className="px-2 py-1 rounded bg-white/10">Xem</button>
                    <button onClick={()=>setSelectedFileId(f.id) & handleSelectFile(f.id)} className="px-2 py-1 rounded bg-white/10">Chọn</button>
                    <button onClick={()=>handleDelete(f.id)} className="px-2 py-1 rounded bg-rose-500 text-white">Xóa</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : <div>Chưa có file</div>}
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Preview câu hỏi (file chọn)</h3>
          {previewQuestions.length ? (
            <ol className="pl-5">
              {previewQuestions.map(q => (
                <li key={q.id} className="mb-2">
                  <div className="font-semibold">{q.question}</div>
                  <div className="text-sm">Options: {q.options.join(' | ')} — Đúng: {q.correct}</div>
                </li>
              ))}
            </ol>
          ) : <div>Chưa chọn hoặc file chưa có câu hợp lệ</div>}
        </div>
        <div className="flex gap-2">
          <button onClick={applyAsActive} className="px-4 py-2 rounded bg-indigo-600 text-white">Áp dụng làm bộ câu hỏi</button>
        </div>
        {status && <div className="mt-4 text-sm">{status}</div>}
      </div>
    </div>
  )
}
