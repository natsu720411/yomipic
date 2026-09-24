const ranked = (rows) => rows.map(([title, author = ''], index) => ({
  title,
  author,
  baseline: 180 - index * 3,
}))

const rankings = {
  manga: ranked([
    ['キングダム', '原泰久'],
    ['信じていた仲間達にダンジョン奥地で殺されかけたがギフト『無限ガチャ』でレベル９９９９の仲間達を手に入れて元パーティーメンバーと世界に復讐＆『ざまぁ！』します！', '大前貴史'],
    ['黄泉のツガイ', '荒川弘'],
    ['勇者パーティを追い出された器用貧乏　～パーティ事情で付与術士をやっていた剣士、万能へと至る～'],
    ['葬送のフリーレン', '山田鐘人'],
    ['ONE PIECE', '尾田栄一郎'],
    ['転生したらスライムだった件', '川上泰樹'],
    ['雑用付与術師が自分の最強に気付くまで'],
    ['メダリスト', 'つるまいかだ'],
    ['お気楽領主の楽しい領地防衛'],
    ['ブルーロック', '金城宗幸'],
    ['みいちゃんと山田さん'],
    ['NARUTO―ナルト―', '岸本斉史'],
    ['呪術廻戦', '芥見下々'],
    ['シャングリラ・フロンティア', '不二涼介'],
    ['俺だけレベルアップな件'],
    ['片田舎のおっさん、剣聖になる', '乍藤和樹'],
    ['引退したおっさん冒険者、再雇用で最強ギルドマスターになってしまう'],
    ['とんがり帽子のアトリエ', '白浜鴎'],
    ['宇宙兄弟', '小山宙哉'],
    ['SAKAMOTO DAYS', '鈴木祐斗'],
    ['転生したら第七王子だったので、気ままに魔術を極めます', '石沢庸介'],
    ['薫る花は凛と咲く', '三香見サカ'],
    ['チェンソーマン', '藤本タツキ'],
    ['ゴールデンカムイ', '野田サトル'],
    ['魔入りました！入間くん', '西修'],
    ['SPY×FAMILY', '遠藤達哉'],
    ['ヘルモード　～やり込み好きのゲーマーは廃設定の異世界で無双する～'],
    ['ワールドトリガー', '葦原大介'],
    ['貴族転生　～恵まれた生まれから最強の力を得る～'],
  ]),
  novel: ranked([
    ['プロジェクト・ヘイル・メアリー', 'アンディ・ウィアー'],
    ['変な地図', '雨穴'],
    ['わたしの幸せな結婚', '顎木あくみ'],
    ['イン・ザ・メガチャーチ'],
    ['化物語', '西尾維新'],
    ['隠蔽捜査', '今野敏'],
    ['成瀬は都を駆け抜ける', '宮島未奈'],
    ['イクサガミ', '今村翔吾'],
    ['拝啓見知らぬ旦那様、離婚していただきます'],
    ['シークレット・オブ・シークレッツ', 'ダン・ブラウン'],
    ['宝石商リチャード氏の謎鑑定', '辻村七子'],
    ['法廷占拠　爆弾２', '呉勝浩'],
    ['准教授・高槻彰良の推察', '澤村御影'],
    ['爆弾', '呉勝浩'],
    ['囚われた王女は二度、幸せな夢を見る'],
    ['館シリーズ', '綾辻行人'],
    ['烏に単は似合わない', '阿部智里'],
    ['殺し屋の営業術'],
    ['変な家2 ～11の間取り図～', '雨穴'],
    ['ビブリア古書堂の事件手帖', '三上延'],
    ['公爵家の長女でした'],
    ['暁星'],
    ['水無月家の許嫁', '友麻碧'],
    ['三体', '劉慈欣'],
    ['国宝', '吉田修一'],
    ['方舟', '夕木春央'],
    ['さよならジャバウォック'],
    ['探偵小石は恋しない'],
    ['皇帝の薬膳妃'],
    ['陰陽師', '夢枕獏'],
  ]),
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
    id: item?.id ? `google-${item.id}` : `seed-${type}-${seedRank}`,
    sourceId: item?.id || '',
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
  const exactQuery = seed.author
    ? `intitle:${seed.title} inauthor:${seed.author}`
    : `intitle:${seed.title}`

  const params = new URLSearchParams({
    q: exactQuery,
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
      q: `${seed.title} ${type === 'manga' ? '漫画' : '小説'}`,
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

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length)
  let cursor = 0

  const worker = async () => {
    while (true) {
      const index = cursor++
      if (index >= items.length) return
      results[index] = await mapper(items[index], index)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  )

  return results
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
    const found = await mapWithConcurrency(
      seeds,
      8,
      (seed) => findBook(seed, type, apiKey).catch(() => null),
    )

    const items = seeds.map((seed, index) => normalize(found[index], type, seed, index + 1))

    res.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate=86400')
    return res.status(200).json({
      items,
      methodology: 'BookLive 2026年上半期ランキングの順位を初期値にし、ヨミピク内の「読みたい」と感想を加味して順位が変化します。',
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
