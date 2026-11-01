export const SESSION_KEY = 'farmspot-session'

function readToken() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY))?.token || null } catch { return null }
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function request(method, path, body) {
  const token = readToken()
  try {
    const res = await fetch(BASE_URL + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    })

    // An expired or invalid session: clear it and go back to the sign-in screen.
    if (res.status === 401 && sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.removeItem(SESSION_KEY)
      window.location.reload()
    }
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