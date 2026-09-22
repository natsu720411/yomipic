export default async function handler(req, res) {
  const rawUrl = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY

  if (!rawUrl || !key) {
    return res.status(500).json({
      ok: false,
      stage: 'env',
      hasUrl: Boolean(rawUrl),
      hasKey: Boolean(key),
      error: 'Supabase environment variables are missing',
    })
  }

  const url = String(rawUrl).trim()

  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return res.status(500).json({
      ok: false,
      stage: 'url',
      error: 'VITE_SUPABASE_URL is not a valid URL',
      urlLength: url.length,
    })
  }

  try {
    const endpoint = `${parsed.origin}/rest/v1/reviews?select=id&limit=1`
    const response = await fetch(endpoint, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    })

    const body = await response.text()

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        stage: 'supabase',
        status: response.status,
        host: parsed.host,
        error: body.slice(0, 500),
      })
    }

    return res.status(200).json({
      ok: true,
      stage: 'done',
      host: parsed.host,
      message: 'Supabase connection is working',
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      stage: 'fetch',
      host: parsed.host,
      error: error instanceof Error ? error.message : 'Supabase connection failed',
    })
  }
}
