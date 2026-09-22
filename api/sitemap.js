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

const landingPages = [
  '/ranking/manga',
  '/ranking/novel',
  '/theme/manga/romance',
  '/theme/manga/youth',
  '/theme/manga/fantasy',
  '/theme/manga/mystery',
  '/theme/manga/emotional',
  '/theme/manga/isekai',
  '/theme/manga/sports',
  '/theme/manga/horror',
  '/theme/novel/romance',
  '/theme/novel/youth',
  '/theme/novel/mystery',
  '/theme/novel/fantasy',
  '/theme/novel/emotional',
  '/theme/novel/sf',
  '/theme/novel/horror',
  '/theme/novel/historical',
]

function landingUrl(path) {
  return `https://yomipic.vercel.app${path}`
}

function urlEntry(url, { lastmod, changefreq = 'weekly', priority = '0.8' } = {}) {
  return `  <url>
    <loc>${xmlEscape(url)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed')
  }

  const today = new Date().toISOString().slice(0, 10)

  try {
    const [reviews, saves] = await Promise.all([
      supabaseFetch('/rest/v1/reviews?select=work_id,created_at&order=created_at.desc&limit=1000'),
      supabaseFetch('/rest/v1/saves?select=work_id,created_at&order=created_at.desc&limit=5000'),
    ])

    const detailPages = new Map()

    for (const row of [...(reviews || []), ...(saves || [])]) {
      const url = detailUrl(row.work_id)
      if (!url) continue

      const previous = detailPages.get(url)
      const date = row.created_at ? new Date(row.created_at) : null
      if (!previous || (date && date > previous)) detailPages.set(url, date)
    }

    const urls = [
      urlEntry('https://yomipic.vercel.app/', { lastmod: today, changefreq: 'daily', priority: '1.0' }),
      ...landingPages.map((path) => urlEntry(landingUrl(path), { lastmod: today, priority: path.startsWith('/ranking/') ? '0.9' : '0.8' })),
      ...[...detailPages.entries()].map(([url, date]) =>
        urlEntry(url, { lastmod: date ? date.toISOString().slice(0, 10) : undefined, priority: '0.7' })
      ),
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
      ...landingPages.map(landingUrl),
    ]
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${fallbackUrls.map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`).join('\n')}
</urlset>`
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    return res.status(200).send(fallback)
  }
}
