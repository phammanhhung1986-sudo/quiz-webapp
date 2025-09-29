import * as XLSX from 'xlsx'

export async function parseExcelFile(file) {
  const errors = []
  try {
    const arrayBuffer = await file.arrayBuffer()
    const wb = XLSX.read(arrayBuffer, { type: 'array' })
    const first = wb.SheetNames[0]
    const ws = wb.Sheets[first]
    const raw = XLSX.utils.sheet_to_json(ws, { defval: '' })
    if (!raw || raw.length === 0) {
      errors.push('Không có dữ liệu trong sheet đầu tiên.')
      return { questions: [], errors }
    }
    const questions = []
    raw.forEach((row, idx) => {
      const Q = row['Q'] ?? row['q'] ?? ''
      const options = [
        row['option 1'] ?? row['Option 1'] ?? row['A'] ?? '',
        row['option 2'] ?? row['Option 2'] ?? row['B'] ?? '',
        row['option 3'] ?? row['Option 3'] ?? row['C'] ?? '',
        row['option 4'] ?? row['Option 4'] ?? row['D'] ?? '',
      ].map(s => String(s).trim())
      const correct = (row['ĐÚNG'] ?? row['DUNG'] ?? row['Answer'] ?? '').toString().trim()
      const type = (row['Type'] ?? '').toString().trim().toLowerCase() || 'multiple'
      const explanation = (row['Explanation'] ?? '').toString().trim() || ''
      const validOptions = options.every(o => o && o.length > 0)
      if (!Q || !validOptions || !correct) return
      questions.push({
        id: idx + 1,
        question: String(Q).trim(),
        options,
        correct,
        type,
        explanation
      })
    })
    if (!questions.length) errors.push('Không tìm thấy câu hỏi hợp lệ (cần đủ 4 option & đáp án khớp).')
    return { questions, errors }
  } catch (err) {
    return { questions: [], errors: ['Lỗi đọc file: ' + err.message] }
  }
}
