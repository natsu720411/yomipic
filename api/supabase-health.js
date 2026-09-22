export default async function handler(req, res) {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    return res.status(500).json({
      ok: false,
      error: 'Supabase environment variables are missing',
    })
  }

  try {
    const response = await fetch(`${url}/rest/v1/reviews?select=id&limit=1`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    })

    const text = await response.text()

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: text || 'Supabase request failed',
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'Supabase connection is working',
    })
  } catch {
    return res.status(500).json({
      ok: false,
      error: 'Supabase connection failed',
    })
  }
}
