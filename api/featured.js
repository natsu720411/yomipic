const rankings = {
  manga: [
    { title: 'キングダム', author: '原泰久', baseline: 100 },
    { title: '葬送のフリーレン', author: '山田鐘人', baseline: 95 },
    { title: 'ONE PIECE', author: '尾田栄一郎', baseline: 93 },
    { title: 'メダリスト', author: 'つるまいかだ', baseline: 88 },
    { title: 'ブルーロック', author: '金城宗幸', baseline: 86 },
    { title: '呪術廻戦', author: '芥見下々', baseline: 84 },
    { title: '薫る花は凛と咲く', author: '三香見サカ', baseline: 82 },
    { title: 'SPY×FAMILY', author: '遠藤達哉', baseline: 80 },
    { title: '薬屋のひとりごと', author: '日向夏', baseline: 78 },
    { title: 'ダンダダン', author: '龍幸伸', baseline: 76 },
  ],
  novel: [
    { title: 'プロジェクト・ヘイル・メアリー', author: 'アンディ・ウィアー', baseline: 100 },
    { title: '変な地図', author: '雨穴', baseline: 95 },
    { title: 'わたしの幸せな結婚', author: '顎木あくみ', baseline: 92 },
    { title: '成瀬は都を駆け抜ける', author: '宮島未奈', baseline: 87 },
    { title: '爆弾', author: '呉勝浩', baseline: 84 },
    { title: '国宝', author: '吉田修一', baseline: 82 },
    { title: 'カフネ', author: '阿部暁子', baseline: 80 },
    { title: '方舟', author: '夕木春央', baseline: 78 },
    { title: '十角館の殺人', author: '綾辻行人', baseline: 76 },
    { title: '三体', author: '劉慈欣', baseline: 74 },
  ],
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s　・･:：!！?？,，.。'"“”‘’「」『』【】()（）\[\]<>＜＞\-―ー]/g, '')
    .replace(/第?\d+巻?$/g, '')
}

function bestImage(info) {
  const links = info?.imageLinks || {}
  const raw = links.extraLarge || links.large || links.medium || links.small || links.thumbnail || links.smallThumbnail || ''
  if (!raw) return ''

  try {
    const url = new URL(raw.replace(/^http:/, 'https:'))
    if (url.hostname.includes('books.google')) {
      url.searchParams.set('zoom', '2')
      url.searchParams.delete('edge')
    }
    return url.toString()
  } catch {
    return raw.replace(/^http:/, 'https:')
  }
}

function normalize(item, type, seed, seedRank) {
  const info = item?.volumeInfo || {}
  return {
    id: `google-${item.id}`,
    sourceId: item.id,
    type,
    title: seed.title,
    sourceTitle: info.title || seed.title,
    author: seed.author || (Array.isArray(info.authors) ? info.authors.join(' / ') : ''),
    genre: Array.isArray(info.categories) && info.categories.length
      ? info.categories.slice(0, 2).join('・')
      : (type === 'manga' ? '漫画' : '小説'),
    score: Number(info.averageRating || 0),
    ratingsCount: Number(info.ratingsCount || 0),
    image: bestImage(info),
    infoLink: info.infoLink || '',
    publishedDate: info.publishedDate || '',
    description: info.description || '',
    baselineScore: seed.baseline,
    seedRank,
    seeded: true,
  }
}

async function findBook(seed, type, apiKey) {
  const params = new URLSearchParams({
    q: `intitle:${seed.title} inauthor:${seed.author}`,
    maxResults: '8',
    printType: 'books',
    orderBy: 'relevance',
    langRestrict: 'ja',
    key: apiKey,
  })

  let response = await fetch(`https://www.googleapis.com/books/v1/volumes?${params.toString()}`)
  let data = await response.json()

  if (!response.ok) throw new Error(data?.error?.message || 'Google Booksからデータを取得できませんでした')

  let items = data.items || []
  if (!items.length) {
    const fallback = new URLSearchParams({
      q: seed.title,
      maxResults: '8',
      printType: 'books',
      orderBy: 'relevance',
      langRestrict: 'ja',
      key: apiKey,
    })
    response = await fetch(`https://www.googleapis.com/books/v1/volumes?${fallback.toString()}`)
    data = await response.json()
    if (!response.ok) throw new Error(data?.error?.message || 'Google Booksからデータを取得できませんでした')
    items = data.items || []
  }

  const seedTitle = normalizeText(seed.title)
  const seedAuthor = normalizeText(seed.author)

  const scored = items.map((item) => {
    const info = item?.volumeInfo || {}
    const title = normalizeText(info.title)
    const authors = normalizeText((info.authors || []).join(' '))
    let score = 0

    if (title === seedTitle) score += 100
    else if (title.startsWith(seedTitle) || seedTitle.startsWith(title)) score += 70
    else if (title.includes(seedTitle) || seedTitle.includes(title)) score += 45

    if (seedAuthor && authors.includes(seedAuthor)) score += 35
    if (info.imageLinks) score += 10
    if (/\b1\b|１|一巻|第1巻/.test(String(info.title || ''))) score += 5

    return { item, score }
  }).sort((a, b) => b.score - a.score)

  return scored[0]?.score >= 45 ? scored[0].item : items[0] || null
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GETのみ対応しています' })
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'Google Books APIキーが設定されていません' })
  }

  const type = req.query.type === 'novel' ? 'novel' : 'manga'
  const seeds = rankings[type]

  try {
    const found = await Promise.all(
      seeds.map((seed) => findBook(seed, type, apiKey).catch(() => null))
    )

    const items = found
      .map((item, index) => item ? normalize(item, type, seeds[index], index + 1) : null)
      .filter(Boolean)

    res.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate=86400')
    return res.status(200).json({
      items,
      methodology: '公開ランキング・販売動向を参考にした初期順位に、ヨミピク内の反応を加味します。',
      sources: [
        {
          label: 'BookLive 2026年上半期ランキング',
          url: type === 'manga'
            ? 'https://booklive.jp/feature/index/id/firsthalfcm'
            : 'https://booklive.jp/feature/index/id/firsthalfbk',
        },
        {
          label: 'ORICON 年間本ランキング2025',
          url: 'https://www.oricon.co.jp/special/73240/',
        },
      ],
    })
  } catch (error) {
    return res.status(500).json({ error: error.message || '初期ランキングを取得できませんでした' })
  }
}
