const themeSeeds = {
  'manga:恋愛': ['薫る花は凛と咲く', '君に届け', 'アオハライド', 'かぐや様は告らせたい', '山田くんとLv999の恋をする', 'ホリミヤ', 'うるわしの宵の月', '花野井くんと恋の病'],
  'manga:青春': ['ブルーピリオド', 'ハイキュー!!', 'アオのハコ', 'ちはやふる', 'スキップとローファー', 'メダリスト', '君に届け', '四月は君の嘘'],
  'manga:ファンタジー': ['葬送のフリーレン', '鋼の錬金術師', 'ダンジョン飯', 'とんがり帽子のアトリエ', '転生したらスライムだった件', '進撃の巨人', 'メイドインアビス', '魔入りました！入間くん'],
  'manga:ミステリー': ['薬屋のひとりごと', '名探偵コナン', 'ミステリと言う勿れ', '憂国のモリアーティ', '金田一少年の事件簿', 'MONSTER', '約束のネバーランド', '僕だけがいない街'],
  'manga:感動': ['四月は君の嘘', '聲の形', 'フルーツバスケット', '3月のライオン', '宇宙兄弟', '葬送のフリーレン', 'かくかくしかじか', 'ONE PIECE'],
  'novel:恋愛': ['わたしの幸せな結婚', '君の膵臓をたべたい', '傲慢と善良', '汝、星のごとく', '夜は短し歩けよ乙女', 'ぼくは明日、昨日のきみとデートする', '植物図鑑', '阪急電車'],
  'novel:青春': ['成瀬は天下を取りにいく', '夜のピクニック', 'かがみの孤城', '桐島、部活やめるってよ', 'あの花が咲く丘で、君とまた出会えたら。', '六人の嘘つきな大学生', '風が強く吹いている', '夜は短し歩けよ乙女'],
  'novel:ミステリー': ['変な家', '変な絵', '十角館の殺人', '爆弾', 'medium 霊媒探偵城塚翡翠', '方舟', '容疑者Xの献身', '白夜行'],
  'novel:ファンタジー': ['ハリー・ポッターと賢者の石', '十二国記', '鹿の王', '精霊の守り人', 'かがみの孤城', '新世界より', '本好きの下剋上', '夜市'],
  'novel:感動': ['カフネ', 'アルジャーノンに花束を', '君の膵臓をたべたい', 'そして、バトンは渡された', '旅猫リポート', '西の魔女が死んだ', '52ヘルツのクジラたち', '流浪の月'],
}

function cleanText(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\\s　・･:：!！?？,，.。'"“”‘’「」『』【】()（）\\[\\]<>＜＞\\-―ー]/g, '')
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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GETのみ対応しています' })
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY
  if (!apiKey) {
    return res.status(503).json({
      error: 'Google Books APIキーがまだ設定されていません。',
    })
  }

  const q = String(req.query.q || '').trim()
  const volumeId = String(req.query.id || '').trim()
  const type = req.query.type === 'novel' ? 'novel' : 'manga'

  const normalize = (item) => {
    const info = item?.volumeInfo || {}
    const image = bestImage(info)

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
      image,
      infoLink: info.infoLink || '',
      publishedDate: info.publishedDate || '',
      description: info.description || '',
    }
  }

  try {
    if (volumeId) {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(volumeId)}?key=${encodeURIComponent(apiKey)}`
      )
      const data = await response.json()

      if (!response.ok) {
        return res.status(response.status).json({
          error: data?.error?.message || '作品情報を取得できませんでした',
        })
      }

      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
      return res.status(200).json({ item: normalize(data) })
    }

    if (!q) {
      return res.status(400).json({ error: '検索語を入力してください' })
    }

    const requestGoogle = async (searchQuery, useLangRestrict = true, maxResults = 20) => {
      const params = new URLSearchParams({
        q: searchQuery,
        maxResults: String(maxResults),
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

    const curatedTitles = themeSeeds[`${type}:${q}`]

    if (curatedTitles) {
      const picked = await Promise.all(curatedTitles.map(async (title) => {
        const candidates = await requestGoogle(`intitle:${title}`, true, 6).catch(() => [])
        if (!candidates.length) return null

        const target = cleanText(title)
        const sorted = candidates
          .map((item) => {
            const info = item?.volumeInfo || {}
            const candidate = cleanText(info.title)
            let score = 0
            if (candidate === target) score += 100
            else if (candidate.startsWith(target) || target.startsWith(candidate)) score += 70
            else if (candidate.includes(target) || target.includes(candidate)) score += 45
            if (info.imageLinks) score += 10
            if (/1|１|一巻|第1巻/.test(String(info.title || ''))) score += 3
            return { item, score }
          })
          .sort((a, b) => b.score - a.score)

        return sorted[0]?.item || candidates[0]
      }))

      const seen = new Set()
      const items = picked
        .filter(Boolean)
        .map(normalize)
        .filter((item) => {
          if (seen.has(item.id)) return false
          seen.add(item.id)
          return true
        })

      if (items.length >= 4) {
        res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400')
        return res.status(200).json({ items, curated: true })
      }
    }

    const hint = type === 'manga' ? '漫画' : '小説'
    let rawItems = await requestGoogle(`${q} ${hint}`, true)

    if (!rawItems.length) rawItems = await requestGoogle(q, true)
    if (!rawItems.length) rawItems = await requestGoogle(q, false)

    const items = rawItems.map(normalize)

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600')
    return res.status(200).json({ items, curated: false })
  } catch (error) {
    const status = Number(error.status) || 500
    return res.status(status).json({
      error: error.message || '作品検索で通信エラーが発生しました',
    })
  }
}
