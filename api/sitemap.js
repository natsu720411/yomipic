function env() {
  const rawUrl = String(process.env.VITE_SUPABASE_URL || '').trim()
  const key = String(process.env.VITE_SUPABASE_ANON_KEY || '').trim()
  if (!rawUrl || !key) throw new Error('Supabase environment variables are missing')

  return {
    url: new URL(rawUrl).origin,
    key,
  }
}

async function supabaseFetch(path) {
  const { url, key } = env()
  const response = await fetch(`${url}${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })

  if (!response.ok) throw new Error('Failed to load sitemap data')
  return response.json()
}

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function detailUrl(workId) {
  const [type, rawId] = String(workId || '').split('::')
  if (!rawId?.startsWith('google-')) return null

  const book = rawId.slice(7)
  if (!book) return null

  const params = new URLSearchParams({
    book,
    type: type === 'novel' ? 'novel' : 'manga',
  })

  return `https://yomipic.vercel.app/?${params.toString()}`
}

const discoveryPages = [
  ['恋愛', 'manga'],
  ['青春', 'manga'],
  ['ファンタジー', 'manga'],
  ['ミステリー', 'manga'],
  ['感動', 'manga'],
  ['恋愛', 'novel'],
  ['青春', 'novel'],
  ['ミステリー', 'novel'],
  ['ファンタジー', 'novel'],
  ['感動', 'novel'],
]

function discoveryUrl(query, type) {
  const params = new URLSearchParams({ q: query, type })
  return `https://yomipic.vercel.app/?${params.toString()}`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed')
  }

  try {
    const [reviews, saves] = await Promise.all([
      supabaseFetch('/rest/v1/reviews?select=work_id,created_at&order=created_at.desc&limit=1000'),
      supabaseFetch('/rest/v1/saves?select=work_id,created_at&order=created_at.desc&limit=5000'),
    ])

    const pages = new Map()

    for (const row of [...(reviews || []), ...(saves || [])]) {
      const url = detailUrl(row.work_id)
      if (!url) continue

      const previous = pages.get(url)
      const date = row.created_at ? new Date(row.created_at) : null
      if (!previous || (date && date > previous)) pages.set(url, date)
    }

    const urls = [
      `  <url>
    <loc>https://yomipic.vercel.app/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
      ...discoveryPages.map(([query, type]) => `  <url>
    <loc>${xmlEscape(discoveryUrl(query, type))}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`),
      ...[...pages.entries()].map(([url, date]) => `  <url>
    <loc>${xmlEscape(url)}</loc>
    ${date ? `<lastmod>${date.toISOString().slice(0, 10)}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`),
    ]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).send(xml)
  } catch {
    const fallbackUrls = [
      'https://yomipic.vercel.app/',
      ...discoveryPages.map(([query, type]) => discoveryUrl(query, type)),
    ]
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${fallbackUrls.map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`).join('\n')}
</urlset>`
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    return res.status(200).send(fallback)
  }
}
