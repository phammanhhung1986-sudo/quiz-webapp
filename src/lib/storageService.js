import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const useSupabase = !!(SUPABASE_URL && SUPABASE_KEY)
let supabase = null
if (useSupabase) supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const LOCAL_KEY = 'quiz_files_v1'
export async function listFiles() {
  if (useSupabase) {
    const { data, error } = await supabase.storage.from('question-files').list('', { limit: 100 })
    if (error) throw error
    return data.map(d => ({ id: d.name, name: d.name, created_at: d.created_at ?? null }))
  } else {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return []
    try { return JSON.parse(raw).map(f => ({ id: f.id, name: f.name, created_at: f.created_at })) } catch { return [] }
  }
}
export async function uploadFile(file) {
  if (useSupabase) {
    const path = `${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage.from('question-files').upload(path, file, { cacheControl: '3600', upsert: true })
    if (error) return { ok: false, error: error.message }
    const { data: urlData } = supabase.storage.from('question-files').getPublicUrl(path)
    return { ok: true, id: path, name: file.name, publicUrl: urlData.publicUrl }
  } else {
    const reader = new FileReader()
    return new Promise((resolve) => {
      reader.onload = () => {
        const arr = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
        const id = `${Date.now()}_${file.name}`
        arr.unshift({ id, name: file.name, created_at: new Date().toISOString(), dataUrl: reader.result })
        localStorage.setItem(LOCAL_KEY, JSON.stringify(arr.slice(0, 50)))
        resolve({ ok: true, id, name: file.name })
      }
      reader.onerror = () => resolve({ ok: false, error: 'Không đọc được file.' })
      reader.readAsDataURL(file)
    })
  }
}
export async function deleteFile(id) {
  if (useSupabase) {
    const { error } = await supabase.storage.from('question-files').remove([id])
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } else {
    try {
      const arr = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
      const filtered = arr.filter(f => f.id !== id)
      localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered))
      return { ok: true }
    } catch (e) { return { ok: false, error: e.message } }
  }
}
export async function getFileBlob(id) {
  if (useSupabase) {
    const { data, error } = await supabase.storage.from('question-files').download(id)
    if (error) throw error
    return data
  } else {
    const arr = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
    const f = arr.find(x => x.id === id)
    if (!f) throw new Error('File không tồn tại (local).')
    const res = await fetch(f.dataUrl)
    return await res.blob()
  }
}
