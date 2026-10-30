const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function request(method, path, body) {
  try {
    const res = await fetch(BASE_URL + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    })
    const text = await res.text()
    let data = null
    try { data = text ? JSON.parse(text) : null } catch { data = null }
    if (res.ok) return { ok: true, data }
    return { ok: false, data, message: data?.message || 'Something went wrong. Please try again.' }
  } catch {
    return { ok: false, data: null, message: "Can't reach the server. It may be starting up, so please wait a minute and try again." }
  }
}

// Fire-and-forget request that wakes a sleeping Render service. Never throws.
export function warmUp() {
  fetch(BASE_URL + '/api/health').catch(() => {})
}