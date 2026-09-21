export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GETのみ対応しています' })
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY
  if (!apiKey) {
    return res.status(503).json({
      error: 'Google Books APIキーがまだ設定されていません。Vercelの環境変数 GOOGLE_BOOKS_API_KEY を設定すると実作品検索が有効になります。',
    })
  }

  const q = String(req.query.q || '').trim()
  const type = req.query.type === 'novel' ? 'novel' : 'manga'

  if (!q) {
    return res.status(400).json({ error: '検索語を入力してください' })
  }

  const searchQuery = type === 'manga'
    ? `${q} subject:comics`
    : `${q} subject:fiction`

  const params = new URLSearchParams({
    q: searchQuery,
    maxResults: '20',
    printType: 'books',
    langRestrict: 'ja',
    orderBy: 'relevance',
    key: apiKey,
  })

  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      const message = data?.error?.message || 'Google Booksからデータを取得できませんでした'
      return res.status(response.status).json({ error: message })
    }

    const items = (data.items || []).map((item) => {
      const info = item.volumeInfo || {}
      const image = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || ''
      return {
        id: `google-${item.id}`,
        sourceId: item.id,
        type,
        title: info.title || 'タイトル不明',
        author: Array.isArray(info.authors) ? info.authors.join(' / ') : '',
        genre: Array.isArray(info.categories) ? info.categories.slice(0, 2).join('・') : (type === 'manga' ? '漫画' : '小説'),
        score: Number(info.averageRating || 0),
        ratingsCount: Number(info.ratingsCount || 0),
        image: image ? image.replace(/^http:/, 'https:') : '',
        infoLink: info.infoLink || '',
        publishedDate: info.publishedDate || '',
      }
    })

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).json({ items })
  } catch {
    return res.status(500).json({ error: '作品検索で通信エラーが発生しました' })
  }
}
