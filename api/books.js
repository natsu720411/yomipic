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

  const requestGoogle = async (searchQuery, useLangRestrict = true) => {
    const params = new URLSearchParams({
      q: searchQuery,
      maxResults: '20',
      printType: 'books',
      orderBy: 'relevance',
      key: apiKey,
    })

    if (useLangRestrict) params.set('langRestrict', 'ja')

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      const message = data?.error?.message || 'Google Booksからデータを取得できませんでした'
      const error = new Error(message)
      error.status = response.status
      throw error
    }

    return data.items || []
  }

  try {
    const hint = type === 'manga' ? '漫画' : '小説'

    // Google Booksのカテゴリ情報は作品ごとに揺れがあるため、
    // subject:comics / subject:fiction に固定せず段階的に検索する。
    let rawItems = await requestGoogle(`${q} ${hint}`, true)

    if (!rawItems.length) {
      rawItems = await requestGoogle(q, true)
    }

    if (!rawItems.length) {
      rawItems = await requestGoogle(q, false)
    }

    const items = rawItems.map((item) => {
      const info = item.volumeInfo || {}
      const image = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || ''

      return {
        id: `google-${item.id}`,
        sourceId: item.id,
        type,
        title: info.title || 'タイトル不明',
        author: Array.isArray(info.authors) ? info.authors.join(' / ') : '',
        genre: Array.isArray(info.categories) && info.categories.length
          ? info.categories.slice(0, 2).join('・')
          : (type === 'manga' ? '漫画' : '小説'),
        score: Number(info.averageRating || 0),
        ratingsCount: Number(info.ratingsCount || 0),
        image: image ? image.replace(/^http:/, 'https:') : '',
        infoLink: info.infoLink || '',
        publishedDate: info.publishedDate || '',
      }
    })

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600')
    return res.status(200).json({ items })
  } catch (error) {
    const status = Number(error.status) || 500
    return res.status(status).json({
      error: error.message || '作品検索で通信エラーが発生しました',
    })
  }
}
