function env() {
  const rawUrl = String(process.env.VITE_SUPABASE_URL || '').trim()
  const key = String(process.env.VITE_SUPABASE_ANON_KEY || '').trim()
  if (!rawUrl || !key) throw new Error('Supabase environment variables are missing')

  let url
  try {
    url = new URL(rawUrl).origin
  } catch {
    throw new Error('VITE_SUPABASE_URL is not a valid URL')
  }

  return { url, key }
}

async function supabaseFetch(path, options = {}) {
  const { url, key } = env()
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const text = await response.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }

  if (!response.ok) {
    const error = new Error(typeof data === 'string' ? data : (data?.message || data?.hint || 'Supabase request failed'))
    error.status = response.status
    error.code = data?.code
    throw error
  }

  return data
}

function clean(value, max = 500) {
  if (value === null || value === undefined) return null
  return String(value).trim().slice(0, max) || null
}

function validWork(body) {
  const work = body?.work || {}
  return {
    workId: clean(work.workId || work.id, 300),
    title: clean(work.title, 300),
    author: clean(work.author, 300),
    imageUrl: clean(work.imageUrl || work.image, 1000),
    genre: clean(work.genre, 200),
  }
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const kind = String(req.query.kind || 'all')

      if (kind === 'write-check') {
        try {
          await supabaseFetch('/rest/v1/reviews', {
            method: 'POST',
            headers: { Prefer: 'return=minimal' },
            body: JSON.stringify({
              work_id: 'debug::permission-check',
              title: 'permission-check',
              rating: 0,
              body: 'permission-check',
              device_id: 'permission-check',
            }),
          })
          return res.status(500).json({
            ok: false,
            stage: 'unexpected',
            error: 'Validation unexpectedly passed',
          })
        } catch (error) {
          // rating=0 intentionally violates the database CHECK constraint.
          // 23514 means the request reached INSERT permission successfully and was rejected only by validation.
          if (error.code === '23514') {
            return res.status(200).json({
              ok: true,
              stage: 'insert-permission',
              message: 'Supabase insert permission is working',
            })
          }
          return res.status(Number(error.status) || 500).json({
            ok: false,
            stage: 'insert-permission',
            code: error.code || null,
            error: error.message || 'Insert permission check failed',
          })
        }
      }

      if (kind === 'reviews') {
        const reviews = await supabaseFetch(
          '/rest/v1/reviews?select=id,work_id,title,author,image_url,genre,rating,mood,body,created_at&order=created_at.desc&limit=100'
        )
        return res.status(200).json({ reviews: reviews || [] })
      }

      if (kind === 'saves') {
        const saves = await supabaseFetch(
          '/rest/v1/saves?select=id,work_id,title,author,image_url,genre,created_at&order=created_at.desc&limit=1000'
        )
        return res.status(200).json({ saves: saves || [] })
      }

      const [reviews, saves] = await Promise.all([
        supabaseFetch('/rest/v1/reviews?select=id,work_id,title,author,image_url,genre,rating,mood,body,created_at&order=created_at.desc&limit=100'),
        supabaseFetch('/rest/v1/saves?select=id,work_id,title,author,image_url,genre,created_at&order=created_at.desc&limit=1000'),
      ])

      return res.status(200).json({ reviews: reviews || [], saves: saves || [] })
    }

    if (req.method === 'POST') {
      const kind = req.body?.kind
      const deviceId = clean(req.body?.deviceId, 200)
      const work = validWork(req.body)

      if (!deviceId || !work.workId) {
        return res.status(400).json({ error: '必要な情報が不足しています' })
      }

      if (kind === 'unsave') {
        const deleted = await supabaseFetch('/rest/v1/rpc/delete_save', {
          method: 'POST',
          body: JSON.stringify({
            p_work_id: work.workId,
            p_device_id: deviceId,
          }),
        })

        return res.status(200).json({ deleted: Number(deleted) || 0 })
      }

      if (!work.title) {
        return res.status(400).json({ error: '作品情報が不足しています' })
      }

      if (kind === 'save') {
        try {
          const rows = await supabaseFetch('/rest/v1/saves', {
            method: 'POST',
            headers: { Prefer: 'return=representation' },
            body: JSON.stringify({
              work_id: work.workId,
              title: work.title,
              author: work.author,
              image_url: work.imageUrl,
              genre: work.genre,
              device_id: deviceId,
            }),
          })
          return res.status(201).json({ save: rows?.[0] || null, alreadySaved: false })
        } catch (error) {
          if (error.code === '23505' || error.status === 409) {
            return res.status(200).json({ save: null, alreadySaved: true })
          }
          throw error
        }
      }

      if (kind === 'review') {
        const rating = Number(req.body?.rating)
        const mood = clean(req.body?.mood, 100)
        const text = clean(req.body?.text, 240)

        if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !text) {
          return res.status(400).json({ error: '評価または感想の内容が正しくありません' })
        }

        const rows = await supabaseFetch('/rest/v1/reviews', {
          method: 'POST',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify({
            work_id: work.workId,
            title: work.title,
            author: work.author,
            image_url: work.imageUrl,
            genre: work.genre,
            rating,
            mood,
            body: text,
            device_id: deviceId,
          }),
        })

        return res.status(201).json({ review: rows?.[0] || null })
      }

      return res.status(400).json({ error: '不明な操作です' })
    }

    return res.status(405).json({ error: 'GET/POSTのみ対応しています' })
  } catch (error) {
    return res.status(Number(error.status) || 500).json({
      error: error.message || '共有データの処理に失敗しました',
    })
  }
}
