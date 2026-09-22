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

function seriesTitle(value) {
  return String(value || '')
    .normalize('NFKC')
    .trim()
    .replace(/\s*(?:モノクロ版|カラー版|デジタル版|電子版|分冊版|新装版|完全版)\s*$/iu, '')
    .replace(/\s*(?:第?\s*[0-9]+\s*巻|vol\.?\s*[0-9]+|volume\s*[0-9]+|[（(]\s*[0-9]+\s*[）)]|\s[0-9]{1,3})\s*$/iu, '')
    .replace(/\s*(?:モノクロ版|カラー版|デジタル版|電子版|分冊版|新装版|完全版)\s*$/iu, '')
    .trim()
}

function detailUrl(row) {
  const [rawType] = String(row?.work_id || '').split('::')
  const type = rawType === 'novel' ? 'novel' : 'manga'
  const title = seriesTitle(row?.title)
  if (!title) return null

  return `https://yomipic.vercel.app/series/${type}/${encodeURIComponent(title)}`
}

const staticSeriesPages = [
  ['manga', 'キングダム'],
  ['manga', '葬送のフリーレン'],
  ['manga', 'ONE PIECE'],
  ['manga', 'メダリスト'],
  ['manga', 'ブルーロック'],
  ['manga', '呪術廻戦'],
  ['manga', '薫る花は凛と咲く'],
  ['manga', 'SPY×FAMILY'],
  ['manga', '薬屋のひとりごと'],
  ['manga', 'ダンダダン'],
  ['novel', 'プロジェクト・ヘイル・メアリー'],
  ['novel', '変な地図'],
  ['novel', 'わたしの幸せな結婚'],
  ['novel', '成瀬は都を駆け抜ける'],
  ['novel', '爆弾'],
  ['novel', '国宝'],
  ['novel', 'カフネ'],
  ['novel', '方舟'],
  ['novel', '十角館の殺人'],
  ['novel', '三体'],
].map(([type, title]) => `/series/${type}/${encodeURIComponent(title)}`)

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
  '/guide/manga/completed',
  '/guide/manga/binge',
  '/guide/manga/college',
  '/guide/manga/short',
  '/guide/novel/bedtime',
  '/guide/novel/binge',
  '/guide/novel/college',
  '/guide/novel/short',
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
      supabaseFetch('/rest/v1/reviews?select=work_id,title,created_at&order=created_at.desc&limit=1000'),
      supabaseFetch('/rest/v1/saves?select=work_id,title,created_at&order=created_at.desc&limit=5000'),
    ])

    const detailPages = new Map()

    for (const row of [...(reviews || []), ...(saves || [])]) {
      const url = detailUrl(row)
      if (!url) continue

      const previous = detailPages.get(url)
      const date = row.created_at ? new Date(row.created_at) : null
      if (!previous || (date && date > previous)) detailPages.set(url, date)
    }

    const urls = [
      urlEntry('https://yomipic.vercel.app/', { lastmod: today, changefreq: 'daily', priority: '1.0' }),
      ...landingPages.map((path) => urlEntry(landingUrl(path), { lastmod: today, priority: path.startsWith('/ranking/') ? '0.9' : '0.8' })),
      ...staticSeriesPages.map((path) => urlEntry(landingUrl(path), { lastmod: today, priority: '0.8' })),
      ...[...detailPages.entries()].filter(([url]) => !staticSeriesPages.some((path) => landingUrl(path) === url)).map(([url, date]) =>
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
      ...staticSeriesPages.map(landingUrl),
    ]
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${fallbackUrls.map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`).join('\n')}
</urlset>`
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    return res.status(200).send(fallback)
  }
}
