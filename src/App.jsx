import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Search,
  Flame,
  TrendingUp,
  Star,
  MessageCircle,
  Bookmark,
  BookmarkCheck,
  PenLine,
  X,
  ChevronRight,
  Sparkles,
  Trophy,
  ExternalLink,
  LoaderCircle,
  Share2,
  Trash2,
} from 'lucide-react'

const moods = ['😭 泣ける', '😂 笑える', '💕 キュン', '🔥 熱い', '🤯 衝撃', '📖 一気読み']

const discoveryTopics = [
  { slug: 'romance', label: '恋愛漫画', query: '恋愛', type: 'manga', emoji: '💕', description: '胸キュンから大人の恋まで、定番の恋愛漫画を中心に探せます。' },
  { slug: 'youth', label: '青春漫画', query: '青春', type: 'manga', emoji: '🌸', description: '学校、友情、部活、成長を描く青春漫画の定番作品を探せます。' },
  { slug: 'fantasy', label: 'ファンタジー漫画', query: 'ファンタジー', type: 'manga', emoji: '✨', description: '冒険や魔法、異世界など世界観を楽しめるファンタジー漫画を探せます。' },
  { slug: 'mystery', label: 'ミステリー漫画', query: 'ミステリー', type: 'manga', emoji: '🔎', description: '謎解き、事件、サスペンスを楽しめるミステリー漫画を探せます。' },
  { slug: 'emotional', label: '泣ける漫画', query: '感動', type: 'manga', emoji: '😭', description: '家族、友情、別れ、成長を描いた心に残る漫画を探せます。' },
  { slug: 'isekai', label: '異世界漫画', query: '異世界', type: 'manga', emoji: '🪄', description: '転生・召喚・異世界冒険など人気の異世界漫画を中心に探せます。' },
  { slug: 'sports', label: 'スポーツ漫画', query: 'スポーツ', type: 'manga', emoji: '🏐', description: 'バレー、サッカー、バスケなど熱いスポーツ漫画の定番作品を探せます。' },
  { slug: 'horror', label: 'ホラー漫画', query: 'ホラー', type: 'manga', emoji: '👻', description: '怪異、都市伝説、心理ホラーなど怖くて続きが気になる漫画を探せます。' },
  { slug: 'romance', label: '恋愛小説', query: '恋愛', type: 'novel', emoji: '💗', description: '切ない恋から温かな恋愛まで、読み継がれる恋愛小説を探せます。' },
  { slug: 'youth', label: '青春小説', query: '青春', type: 'novel', emoji: '📚', description: '学生生活、友情、成長を描いた青春小説の定番作品を探せます。' },
  { slug: 'mystery', label: 'ミステリー小説', query: 'ミステリー', type: 'novel', emoji: '🕵️', description: '本格推理からサスペンスまで、人気のミステリー小説を探せます。' },
  { slug: 'fantasy', label: 'ファンタジー小説', query: 'ファンタジー', type: 'novel', emoji: '🌙', description: '壮大な世界観や不思議な物語を楽しめるファンタジー小説を探せます。' },
  { slug: 'emotional', label: '泣ける小説', query: '感動', type: 'novel', emoji: '🥹', description: '読後に余韻が残る、感動や人とのつながりを描いた小説を探せます。' },
  { slug: 'sf', label: 'SF小説', query: 'SF', type: 'novel', emoji: '🚀', description: '宇宙、未来、科学をテーマにした国内外の定番SF小説を探せます。' },
  { slug: 'horror', label: 'ホラー小説', query: 'ホラー', type: 'novel', emoji: '🕯️', description: '怪談、心理恐怖、異常な日常を描く人気ホラー小説を探せます。' },
  { slug: 'historical', label: '歴史小説', query: '歴史', type: 'novel', emoji: '🏯', description: '戦国・幕末など歴史の人物や時代を描いた定番小説を探せます。' },
]

function rankingHref(type) {
  return `/ranking/${type === 'novel' ? 'novel' : 'manga'}`
}

function topicHref(topic) {
  return `/theme/${topic.type}/${topic.slug}`
}

function searchHref(query, type) {
  const topic = discoveryTopics.find((item) => item.query === query && item.type === type)
  if (topic) return topicHref(topic)

  const params = new URLSearchParams({
    q: query,
    type: type === 'novel' ? 'novel' : 'manga',
  })
  return `/?${params.toString()}`
}

function searchPageLabel(query, type) {
  const topic = discoveryTopics.find((item) => item.query === query && item.type === type)
  return topic?.label || `${query}${type === 'novel' ? '小説' : '漫画'}`
}

function routeInfo() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const rankingMatch = path.match(/^\/ranking\/(manga|novel)$/)
  if (rankingMatch) return { kind: 'ranking', type: rankingMatch[1] }

  const themeMatch = path.match(/^\/theme\/(manga|novel)\/([a-z0-9-]+)$/)
  if (themeMatch) {
    const topic = discoveryTopics.find((item) => item.type === themeMatch[1] && item.slug === themeMatch[2])
    if (topic) return { kind: 'theme', type: topic.type, topic }
  }

  return { kind: 'home' }
}

function getDeviceId() {
  const key = 'yomipic-device-id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `device-${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(key, id)
  }
  return id
}

function dbWorkId(work) {
  return `${work.type || 'book'}::${work.id}`
}

function seriesTitle(value) {
  return String(value || '')
    .trim()
    .replace(/\s*(?:第?\s*[0-9０-９]+\s*巻|vol\.?\s*[0-9０-９]+|volume\s*[0-9０-９]+|[（(]\s*[0-9０-９]+\s*[）)]|\s[0-9０-９]{1,3})\s*$/iu, '')
    .trim()
}

function seriesKey(type, title) {
  return `${type || 'book'}::${seriesTitle(title).normalize('NFKC').toLowerCase()}`
}

function sourceBookId(work) {
  if (!work) return ''
  if (work.sourceId) return String(work.sourceId)
  const id = String(work.id || '')
  return id.startsWith('google-') ? id.slice(7) : ''
}

function detailHref(work) {
  const sourceId = sourceBookId(work)
  if (!sourceId) return '#'
  const params = new URLSearchParams({
    book: sourceId,
    type: work?.type === 'novel' ? 'novel' : 'manga',
  })
  return `/?${params.toString()}`
}

function buildDetailUrl(work) {
  return new URL(detailHref(work), window.location.origin).toString()
}

function rowWork(row) {
  const [type = 'book', id = row.work_id] = String(row.work_id || '').split('::')
  return {
    id,
    dbId: row.work_id,
    type,
    title: row.title,
    author: row.author || '',
    genre: row.genre || (type === 'manga' ? '漫画' : '小説'),
    image: row.image_url || '',
    score: 0,
    reviews: 0,
    saves: 0,
    tagline: 'ヨミピクで読者から反応が集まっている作品です。',
  }
}

function Cover({ work, small = false }) {
  if (work.image) {
    return (
      <div className={`cover cover-photo ${small ? 'cover-small' : ''}`}>
        <img src={work.image} alt={`${work.title}の書影`} loading="lazy" />
      </div>
    )
  }

  return (
    <div className={`cover ${small ? 'cover-small' : ''}`} style={{ background: work.accent || 'linear-gradient(145deg,#7c3aed,#ec4899)' }}>
      <div className="cover-mark">Y</div>
      <div className="cover-copy">
        <span>{work.type === 'manga' ? 'COMIC' : 'NOVEL'}</span>
        <strong>{work.title}</strong>
      </div>
    </div>
  )
}

function Stars({ score }) {
  if (!score) return <span className="score muted-score">評価前</span>
  return (
    <span className="score">
      <Star size={15} fill="currentColor" />
      {Number(score).toFixed(1)}
    </span>
  )
}

function ResultCard({ work, saved, saveCount, reviewCount, onSave, onReview, onOpen, saving }) {
  return (
    <article className="work-card real-work-card">
      <a
        className="work-cover-button"
        href={detailHref(work)}
        onClick={(event) => { event.preventDefault(); onOpen(work) }}
        aria-label={`${work.title}の詳細を見る`}
      >
        <Cover work={work} />
      </a>
      <div className="work-body">
        <div className="work-meta">{work.genre || '書籍'}</div>
        <a className="work-title-button" href={detailHref(work)} onClick={(event) => { event.preventDefault(); onOpen(work) }}>{work.title}</a>
        <p className="author">{work.author || '著者情報なし'}</p>
        <div className="metrics result-metrics">
          <Stars score={work.score} />
          <span><MessageCircle size={14} /> {reviewCount}</span>
          <span><Bookmark size={14} /> {saveCount}</span>
        </div>
        <div className="card-actions">
          <button className="ghost-button" onClick={() => onReview(work)}>
            <PenLine size={16} /> 感想
          </button>
          {work.infoLink ? (
            <a className="info-link" href={work.infoLink} target="_blank" rel="noreferrer" aria-label="Google Booksで作品情報を見る">
              <ExternalLink size={17} />
            </a>
          ) : null}
          <button
            className={`wishlist-button ${saved ? 'saved' : ''}`}
            onClick={() => onSave(work)}
            disabled={saving}
            aria-label={saved ? '読みたいを解除' : '読みたいに追加'}
          >
            {saving ? <LoaderCircle size={17} className="spin" /> : saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
            <span>{saving ? '更新中' : saved ? '読みたい解除' : '読みたい'}</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default function App() {
  const [type, setType] = useState('manga')
  const [sort, setSort] = useState('weekly')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('yomipic-saved') || '[]')) } catch { return new Set() }
  })
  const [selected, setSelected] = useState(null)
  const [detailWork, setDetailWork] = useState(null)
  const [shareStatus, setShareStatus] = useState('')
  const [reviewOpen, setReviewOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [mood, setMood] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [sharedReviews, setSharedReviews] = useState([])
  const [sharedSaves, setSharedSaves] = useState([])
  const [starterByType, setStarterByType] = useState({ manga: [], novel: [] })
  const [rankingLoading, setRankingLoading] = useState(false)
  const [communityError, setCommunityError] = useState('')
  const [postingReview, setPostingReview] = useState(false)
  const [deletingReviewId, setDeletingReviewId] = useState(null)
  const [savingId, setSavingId] = useState('')
  const [deviceId] = useState(() => getDeviceId())
  const [liveResults, setLiveResults] = useState([])
  const [liveLoading, setLiveLoading] = useState(false)
  const [liveError, setLiveError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [pageRoute, setPageRoute] = useState(() => routeInfo())

  useEffect(() => {
    localStorage.setItem('yomipic-saved', JSON.stringify([...saved]))
  }, [saved])

  useEffect(() => {
    let active = true

    fetch(`/api/community?deviceId=${encodeURIComponent(deviceId)}`)
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'みんなの反応を取得できませんでした')
        if (active) {
          setSharedReviews(data.reviews || [])
          setSharedSaves(data.saves || [])
        }
      })
      .catch((error) => {
        if (active) setCommunityError(error.message || 'みんなの反応を取得できませんでした')
      })

    return () => { active = false }
  }, [deviceId])

  useEffect(() => {
    let active = true
    setRankingLoading(true)

    fetch(`/api/featured?type=${type}`)
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || '初期ランキングを取得できませんでした')
        if (active) {
          setStarterByType((prev) => ({ ...prev, [type]: data.items || [] }))
        }
      })
      .catch((error) => {
        if (active && !starterByType[type]?.length) {
          setCommunityError(error.message || '初期ランキングを取得できませんでした')
        }
      })
      .finally(() => {
        if (active) setRankingLoading(false)
      })

    return () => { active = false }
  }, [type])

  useEffect(() => {
    let active = true

    const loadDetailFromUrl = async () => {
      const params = new URLSearchParams(window.location.search)
      const bookId = params.get('book')
      const urlType = params.get('type') === 'novel' ? 'novel' : 'manga'

      if (!bookId) {
        if (active) setDetailWork(null)
        return
      }

      try {
        const response = await fetch(`/api/books?id=${encodeURIComponent(bookId)}&type=${urlType}`)
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || '作品情報を取得できませんでした')
        if (active && data.item) {
          setType(urlType)
          setDetailWork(data.item)
        }
      } catch (error) {
        if (active) setCommunityError(error.message || '共有された作品情報を開けませんでした')
      }
    }

    loadDetailFromUrl()
    window.addEventListener('popstate', loadDetailFromUrl)

    return () => {
      active = false
      window.removeEventListener('popstate', loadDetailFromUrl)
    }
  }, [])

  const saveCountMap = useMemo(() => {
    const map = new Map()
    for (const row of sharedSaves) {
      map.set(row.work_id, (map.get(row.work_id) || 0) + 1)
    }
    return map
  }, [sharedSaves])

  const reviewCountMap = useMemo(() => {
    const map = new Map()
    for (const row of sharedReviews) {
      map.set(row.work_id, (map.get(row.work_id) || 0) + 1)
    }
    return map
  }, [sharedReviews])

  const communityWorks = useMemo(() => {
    const map = new Map()

    const ensure = (row) => {
      const base = rowWork(row)
      const key = seriesKey(base.type, row.title)

      if (!map.has(key)) {
        map.set(key, {
          ...base,
          title: seriesTitle(row.title),
          seriesKey: key,
          sourceWorkIds: new Set(),
        })
      }

      const work = map.get(key)
      work.sourceWorkIds.add(row.work_id)

      if (!work.image && row.image_url) work.image = row.image_url
      if (!work.author && row.author) work.author = row.author
      if (!work.genre && row.genre) work.genre = row.genre

      return work
    }

    for (const row of sharedSaves) {
      const work = ensure(row)
      work.saves += 1
      const age = Date.now() - new Date(row.created_at).getTime()
      if (age < 7 * 86400000) work.recent = (work.recent || 0) + 1
    }

    for (const row of sharedReviews) {
      const work = ensure(row)
      work.reviews += 1
      work.ratingTotal = (work.ratingTotal || 0) + Number(row.rating || 0)
      const age = Date.now() - new Date(row.created_at).getTime()
      if (age < 7 * 86400000) work.recent = (work.recent || 0) + 2
    }

    return [...map.values()].map((work) => ({
      ...work,
      sourceWorkIds: [...work.sourceWorkIds],
      score: work.reviews ? work.ratingTotal / work.reviews : 0,
      popularity: work.saves * 2 + work.reviews * 3 + (work.recent || 0),
    }))
  }, [sharedSaves, sharedReviews])

  const works = useMemo(() => {
    const community = communityWorks.filter((work) => work.type === type)
    const communityBySeries = new Map(
      community.map((work) => [work.seriesKey || seriesKey(work.type, work.title), work])
    )
    const used = new Set()

    const seeded = (starterByType[type] || []).map((starter) => {
      const id = dbWorkId(starter)
      const key = seriesKey(starter.type, starter.title)
      const reactions = communityBySeries.get(key)
      used.add(key)

      const saves = reactions?.saves || 0
      const reviews = reactions?.reviews || 0
      const recent = reactions?.recent || 0
      const baseline = Math.max(0, Number(starter.baselineScore || 0) - 60)

      return {
        ...starter,
        dbId: id,
        seriesKey: key,
        saves,
        reviews,
        recent,
        score: reviews ? reactions.score : 0,
        popularity: baseline + saves * 7 + reviews * 10 + recent * 4,
        tagline: reactions
          ? '作品タイトル単位で、各巻に付いたヨミピク内の反応をまとめて反映しています。'
          : '公開ランキングや販売動向を参考にした初期ランキング作品です。',
      }
    })

    const communityOnly = community
      .filter((work) => !used.has(work.seriesKey || seriesKey(work.type, work.title)))
      .map((work) => ({
        ...work,
        title: seriesTitle(work.title),
        popularity: (work.saves || 0) * 7 + (work.reviews || 0) * 10 + (work.recent || 0) * 4,
      }))

    const combined = [...seeded, ...communityOnly]

    if (sort === 'rising') {
      return combined.sort((a, b) =>
        (b.recent || 0) - (a.recent || 0) ||
        ((b.saves || 0) + (b.reviews || 0)) - ((a.saves || 0) + (a.reviews || 0)) ||
        b.popularity - a.popularity
      )
    }
    if (sort === 'rated') {
      return combined.sort((a, b) =>
        b.score - a.score ||
        b.reviews - a.reviews ||
        b.popularity - a.popularity
      )
    }
    return combined.sort((a, b) => b.popularity - a.popularity)
  }, [communityWorks, starterByType, type, sort])

  const rankingIsEmpty = works.length === 0

  const bookshelfWorks = useMemo(() => {
    const byId = new Map()
    for (const row of sharedSaves) {
      if (!byId.has(row.work_id)) byId.set(row.work_id, rowWork(row))
    }

    return [...saved]
      .map((id) => byId.get(id))
      .filter(Boolean)
      .map((work) => ({
        ...work,
        score: (() => {
          const reviews = sharedReviews.filter((review) => review.work_id === work.dbId)
          return reviews.length
            ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
            : 0
        })(),
        reviews: reviewCountMap.get(work.dbId) || 0,
        saves: saveCountMap.get(work.dbId) || 0,
      }))
  }, [saved, sharedSaves, sharedReviews, reviewCountMap, saveCountMap])

  const detailDbId = detailWork ? (detailWork.dbId || dbWorkId(detailWork)) : ''
  const detailReviews = useMemo(
    () => detailDbId ? sharedReviews.filter((review) => review.work_id === detailDbId) : [],
    [detailDbId, sharedReviews],
  )
  const detailAverage = detailReviews.length
    ? detailReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / detailReviews.length
    : 0
  const detailSaveCount = detailDbId ? (saveCountMap.get(detailDbId) || 0) : 0

  useEffect(() => {
    if (!detailWork && !reviewOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (reviewOpen) setReviewOpen(false)
        else closeDetail()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [detailWork, reviewOpen])

  const openDetail = (work) => {
    setDetailWork(work)
    setShareStatus('')

    const sourceId = sourceBookId(work)
    if (!sourceId) return

    const url = new URL(window.location.href)
    url.hash = ''
    url.searchParams.set('book', sourceId)
    url.searchParams.set('type', work?.type === 'novel' ? 'novel' : 'manga')
    window.history.pushState({ yomipicDetail: true }, '', url)
  }

  const closeDetail = () => {
    setDetailWork(null)
    setShareStatus('')
    const url = new URL(window.location.href)
    url.searchParams.delete('book')
    if (!url.searchParams.get('q')) url.searchParams.delete('type')
    window.history.replaceState({}, '', url)
  }

  const shareDetail = async () => {
    if (!detailWork) return

    const url = buildDetailUrl(detailWork)
    const shareData = {
      title: `${detailWork.title} | ヨミピク`,
      text: `「${detailWork.title}」の感想・評価をヨミピクで見る`,
      url,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        setShareStatus('共有しました')
      } else {
        await navigator.clipboard.writeText(url)
        setShareStatus('リンクをコピーしました')
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url)
          setShareStatus('リンクをコピーしました')
        } catch {
          setShareStatus('共有リンクをコピーできませんでした')
        }
      }
    }
  }

  useEffect(() => {
    const homeTitle = 'ヨミピク｜漫画・小説の人気ランキング・感想・読みたい本棚'
    const homeDescription = 'ヨミピクは、漫画・小説を検索し、みんなの感想や評価、人気ランキングから次に読む一冊を探せる読書コミュニティ。気になる作品は「読みたい本棚」に保存できます。'
    const searchLabel = query ? searchPageLabel(query, type) : ''
    const searchDescription = searchLabel
      ? `${searchLabel}を探すならヨミピク。実在する作品を検索し、みんなの感想・評価・「読みたい」数を見ながら次に読む一冊を見つけられます。`
      : homeDescription
    const detailDescription = detailWork
      ? `${detailWork.title}${detailWork.author ? `（${detailWork.author}）` : ''}の感想・評価をヨミピクでチェック。みんなのレビューや「読みたい」数から、次に読む一冊を探せます。`
      : (hasSearched && query ? searchDescription : homeDescription)
    const pageTitle = detailWork
      ? `${detailWork.title}の感想・評価｜ヨミピク`
      : (hasSearched && query ? `${searchLabel}を探す｜おすすめ作品・感想｜ヨミピク` : homeTitle)
    const pageUrl = detailWork
      ? buildDetailUrl(detailWork)
      : (hasSearched && query
          ? new URL(searchHref(query, type), 'https://yomipic.vercel.app').toString()
          : 'https://yomipic.vercel.app/')
    const pageImage = detailWork?.image || 'https://yomipic.vercel.app/favicon.svg'

    const setMeta = (selector, value) => {
      const element = document.querySelector(selector)
      if (element) element.setAttribute('content', value)
    }

    document.title = pageTitle
    setMeta('meta[name="description"]', detailDescription)
    setMeta('meta[property="og:title"]', pageTitle)
    setMeta('meta[property="og:description"]', detailDescription)
    setMeta('meta[property="og:url"]', pageUrl)
    setMeta('meta[property="og:image"]', pageImage)
    setMeta('meta[name="twitter:title"]', pageTitle)
    setMeta('meta[name="twitter:description"]', detailDescription)
    setMeta('meta[name="twitter:image"]', pageImage)

    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', pageUrl)

    let script = document.getElementById('yomipic-book-jsonld')
    if (detailWork) {
      if (!script) {
        script = document.createElement('script')
        script.id = 'yomipic-book-jsonld'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }

      const bookData = {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: detailWork.title,
        url: pageUrl,
        image: detailWork.image || undefined,
        genre: detailWork.genre || undefined,
        author: detailWork.author ? { '@type': 'Person', name: detailWork.author } : undefined,
        aggregateRating: detailReviews.length
          ? {
              '@type': 'AggregateRating',
              ratingValue: Number(detailAverage.toFixed(2)),
              reviewCount: detailReviews.length,
              bestRating: 5,
              worstRating: 1,
            }
          : undefined,
      }
      script.textContent = JSON.stringify(bookData)
    } else if (script) {
      script.remove()
    }

    return () => {
      document.title = homeTitle
    }
  }, [detailWork, detailAverage, detailReviews.length, hasSearched, query, type])

  const saveWork = async (work) => {
    if (!work || work.demo || savingId) return

    const id = work.dbId || dbWorkId(work)
    const isSaved = saved.has(id)

    setSavingId(id)
    setCommunityError('')

    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: isSaved ? 'unsave' : 'save',
          deviceId,
          work: {
            workId: id,
            title: work.title,
            author: work.author || '',
            imageUrl: work.image || '',
            genre: work.genre || '',
          },
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || (isSaved ? '「読みたい」を解除できませんでした' : '「読みたい」を保存できませんでした'))

      if (isSaved) {
        setSaved((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })

        setSharedSaves((prev) => {
          const index = prev.findIndex((row) => row.work_id === id)
          if (index < 0) return prev
          return [...prev.slice(0, index), ...prev.slice(index + 1)]
        })
      } else {
        setSaved((prev) => new Set([...prev, id]))
        if (data.save) setSharedSaves((prev) => [data.save, ...prev])
      }
    } catch (error) {
      setCommunityError(error.message || (isSaved ? '「読みたい」を解除できませんでした' : '「読みたい」を保存できませんでした'))
    } finally {
      setSavingId('')
    }
  }

  const deleteReview = async (review) => {
    if (!review?.is_mine || deletingReviewId) return

    const ok = window.confirm('この感想を削除しますか？')
    if (!ok) return

    setDeletingReviewId(review.id)
    setCommunityError('')

    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'delete-review',
          deviceId,
          reviewId: review.id,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '感想を削除できませんでした')

      setSharedReviews((prev) => prev.filter((item) => item.id !== review.id))
    } catch (error) {
      setCommunityError(error.message || '感想を削除できませんでした')
    } finally {
      setDeletingReviewId(null)
    }
  }

  const openReview = (work) => {
    setSelected(work)
    setReviewOpen(true)
    setRating(5)
    setMood('')
    setReviewText('')
    setCommunityError('')
  }

  const submitReview = async (event) => {
    event.preventDefault()
    if (!selected || !reviewText.trim() || postingReview) return

    setPostingReview(true)
    setCommunityError('')

    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'review',
          deviceId,
          work: {
            workId: dbWorkId(selected),
            title: selected.title,
            author: selected.author || '',
            imageUrl: selected.image || '',
            genre: selected.genre || '',
          },
          rating,
          mood,
          text: reviewText.trim(),
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '感想を投稿できませんでした')

      if (data.review) setSharedReviews((prev) => [data.review, ...prev])
      setReviewOpen(false)
      setReviewText('')
    } catch (error) {
      setCommunityError(error.message || '感想を投稿できませんでした')
    } finally {
      setPostingReview(false)
    }
  }

  const searchBooks = async (event, forcedQuery, forcedType, options = {}) => {
    event?.preventDefault()
    const term = (forcedQuery ?? query).trim()
    if (!term) return

    const targetType = forcedType === 'novel' ? 'novel' : (forcedType === 'manga' ? 'manga' : type)
    const topic = discoveryTopics.find((item) => item.query === term && item.type === targetType)

    if (forcedQuery !== undefined) setQuery(forcedQuery)
    if (forcedType) setType(targetType)

    if (!options.keepUrl) {
      const href = topic ? topicHref(topic) : searchHref(term, targetType)
      window.history.replaceState({ yomipicSearch: true }, '', href)
    }

    setPageRoute(topic ? { kind: 'theme', type: targetType, topic } : { kind: 'home' })
    setHasSearched(true)
    setLiveLoading(true)
    setLiveError('')

    try {
      const response = await fetch(`/api/books?q=${encodeURIComponent(term)}&type=${targetType}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '検索に失敗しました')
      setLiveResults(data.items || [])
      if (!options.noScroll) {
        setTimeout(() => document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30)
      }
    } catch (error) {
      setLiveResults([])
      setLiveError(error.message || '検索に失敗しました')
    } finally {
      setLiveLoading(false)
    }
  }

  const navigateRanking = (event, targetType) => {
    event?.preventDefault()
    const nextType = targetType === 'novel' ? 'novel' : 'manga'
    setType(nextType)
    setPageRoute({ kind: 'ranking', type: nextType })
    setHasSearched(false)
    setQuery('')
    window.history.pushState({ yomipicRanking: true }, '', rankingHref(nextType))
    setTimeout(() => document.getElementById('ranking')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30)
  }

  useEffect(() => {
    const loadRoute = () => {
      const route = routeInfo()
      setPageRoute(route)

      if (route.kind === 'ranking') {
        setType(route.type)
        setHasSearched(false)
        setQuery('')
        return
      }

      if (route.kind === 'theme') {
        searchBooks(null, route.topic.query, route.type, { keepUrl: true, noScroll: true })
        return
      }

      const params = new URLSearchParams(window.location.search)
      if (params.get('book')) return

      const initialQuery = String(params.get('q') || '').trim()
      if (!initialQuery) {
        setHasSearched(false)
        return
      }

      const initialType = params.get('type') === 'novel' ? 'novel' : 'manga'
      searchBooks(null, initialQuery, initialType, { keepUrl: true, noScroll: true })
    }

    loadRoute()
    window.addEventListener('popstate', loadRoute)
    return () => window.removeEventListener('popstate', loadRoute)
  }, [])

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ヨミピク トップ">
          <span className="brand-icon"><BookOpen size={21} /></span>
          <span>ヨミピク</span>
        </a>

        <nav className="desktop-nav" aria-label="メインメニュー">
          <a href="#ranking">ランキング</a>
          <a href="#bookshelf">読みたい本棚</a>
          <a href="#reviews">みんなの感想</a>
          <a href="#discover">作品を探す</a>
        </nav>

        <button className="header-action" onClick={() => {
          if (liveResults[0]) openReview(liveResults[0])
          else {
            document.getElementById('book-search')?.focus()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }}>
          <PenLine size={17} />
          感想を書く
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-inner">
            <div className="eyebrow"><Sparkles size={16} /> みんなの「読んだ」が、次の一冊につながる。</div>
            <h1>次に読む一冊が、<br /><span>きっと見つかる。</span></h1>
            <p>漫画と小説の人気ランキングをチェック。読んだ作品には、気軽にひとこと感想を残せます。</p>

            <form className="search-box" onSubmit={searchBooks}>
              <Search size={21} />
              <input
                id="book-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="実在する作品名・作者名から探す"
                aria-label="作品検索"
              />
              <button className="search-submit" type="submit" disabled={liveLoading}>
                {liveLoading ? <LoaderCircle size={17} className="spin" /> : '検索'}
              </button>
            </form>

            <div className="hero-chips">
              <span>検索例:</span>
              {['青春', 'ミステリー', '恋愛', 'ファンタジー'].map((word) => (
                <button key={word} onClick={() => searchBooks(null, word)}>{word}</button>
              ))}
            </div>
          </div>

          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
        </section>

        {hasSearched && (
          <section className="content-section search-results-section" id="search-results">
            <div className="section-top">
              <div>
                <span className="section-kicker">BOOK DISCOVERY</span>
                <h2>{searchPageLabel(query, type)}を探す</h2>
                <p className="search-intro">
                  {pageRoute.kind === 'theme' && pageRoute.topic
                    ? pageRoute.topic.description
                    : `${searchPageLabel(query, type)}の実在作品を検索しています。気になる作品は感想・評価や「読みたい」数を確認して、本棚に保存できます。`}
                </p>
                <small className="search-source-note">書籍情報はGoogle Booksのデータを利用しています。</small>
              </div>
              <div className="type-switch" role="tablist" aria-label="検索する作品タイプ">
                <button
                  className={type === 'manga' ? 'active' : ''}
                  onClick={() => query ? searchBooks(null, query, 'manga') : setType('manga')}
                >
                  漫画
                </button>
                <button
                  className={type === 'novel' ? 'active' : ''}
                  onClick={() => query ? searchBooks(null, query, 'novel') : setType('novel')}
                >
                  小説
                </button>
              </div>
            </div>

            {liveLoading ? (
              <div className="search-status"><LoaderCircle size={28} className="spin" /><p>作品を探しています…</p></div>
            ) : liveError ? (
              <div className="search-status error-status">
                <Search size={26} />
                <h3>作品を検索できませんでした</h3>
                <p>{liveError}</p>
              </div>
            ) : liveResults.length ? (
              <div className="ranking-grid">
                {liveResults.map((work) => {
                  const id = dbWorkId(work)
                  return (
                    <ResultCard
                      key={work.id}
                      work={work}
                      saved={saved.has(id)}
                      saving={savingId === id}
                      saveCount={saveCountMap.get(id) || 0}
                      reviewCount={reviewCountMap.get(id) || 0}
                      onSave={saveWork}
                      onReview={openReview}
                      onOpen={openDetail}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="search-status"><Search size={28} /><h3>作品が見つかりませんでした</h3><p>タイトルや作者名を変えて検索してみてください。</p></div>
            )}

            <nav className="related-searches" aria-label="関連テーマ">
              <strong>ほかの{type === 'manga' ? '漫画' : '小説'}テーマも見る</strong>
              <div>
                {discoveryTopics
                  .filter((topic) => topic.type === type && topic.query !== query)
                  .slice(0, 4)
                  .map((topic) => (
                    <a
                      key={`related-${topic.type}-${topic.query}`}
                      href={searchHref(topic.query, topic.type)}
                      onClick={(event) => {
                        event.preventDefault()
                        searchBooks(null, topic.query, topic.type)
                      }}
                    >
                      {topic.emoji} {topic.label}
                    </a>
                  ))}
              </div>
            </nav>
          </section>
        )}

        <section className="content-section" id="ranking">
          <div className="section-top">
            <div>
              <span className="section-kicker">RANKING</span>
              <h2>ヨミピク人気ランキング</h2>
              <p>{rankingIsEmpty ? 'ランキングを準備しています。' : '巻ごとではなく作品タイトル単位で集計し、公開ランキング・販売動向を参考にした初期順位へヨミピク内の「読みたい」と感想を反映します。'}</p>
              <div className="ranking-sources">
                参考：
                <a href="https://booklive.jp/feature/index/id/firsthalf" target="_blank" rel="noreferrer">BookLive 2026年上半期</a>
                <span>・</span>
                <a href="https://www.oricon.co.jp/special/73240/" target="_blank" rel="noreferrer">ORICON 2025年間本ランキング</a>
              </div>
            </div>

            <div className="type-switch" role="tablist" aria-label="作品タイプ">
              <a className={type === 'manga' ? 'active' : ''} href={rankingHref('manga')} onClick={(event) => navigateRanking(event, 'manga')}>漫画</a>
              <a className={type === 'novel' ? 'active' : ''} href={rankingHref('novel')} onClick={(event) => navigateRanking(event, 'novel')}>小説</a>
            </div>
          </div>

          <div className="sort-tabs">
            <button className={sort === 'weekly' ? 'active' : ''} onClick={() => setSort('weekly')}>
              <Flame size={16} /> 総合人気
            </button>
            <button className={sort === 'rising' ? 'active' : ''} onClick={() => setSort('rising')}>
              <TrendingUp size={16} /> 急上昇
            </button>
            <button className={sort === 'rated' ? 'active' : ''} onClick={() => setSort('rated')}>
              <Star size={16} /> 高評価
            </button>
          </div>

          {rankingLoading && rankingIsEmpty ? (
            <div className="search-status">
              <LoaderCircle size={28} className="spin" />
              <h3>ランキングを準備しています</h3>
              <p>定番作品の情報を取得しています…</p>
            </div>
          ) : rankingIsEmpty ? (
            <div className="search-status">
              <Trophy size={28} />
              <h3>ランキングを取得できませんでした</h3>
              <p>作品検索はそのまま使えます。少し時間を置いて再読み込みしてください。</p>
            </div>
          ) : (
            <div className="ranking-grid">
              {works.map((work, index) => (
                <article className="work-card" key={work.dbId || work.id}>
                  <div className={`rank-badge rank-${index + 1}`}>
                    {index < 3 ? <Trophy size={13} /> : null}
                    {index + 1}
                  </div>
                  <a
                    className="work-cover-button"
                    href={detailHref(work)}
                    onClick={(event) => { event.preventDefault(); openDetail(work) }}
                    aria-label={`${work.title}の詳細を見る`}
                  >
                    <Cover work={work} />
                  </a>
                  <div className="work-body">
                    <div className="work-meta">{work.seeded ? '定番候補 ・ ' : ''}{work.genre}</div>
                    <a className="work-title-button" href={detailHref(work)} onClick={(event) => { event.preventDefault(); openDetail(work) }}>{work.title}</a>
                    <p className="author">{work.author}</p>
                    <p className="tagline">{work.tagline}</p>
                    <div className="metrics">
                      <Stars score={work.score} />
                      <span><MessageCircle size={14} /> {work.reviews || 0}</span>
                      <span><Bookmark size={14} /> {work.saves || 0}</span>
                    </div>
                    <div className="card-actions">
                      <button className="ghost-button" onClick={() => openReview(work)}>
                        <PenLine size={16} /> 感想
                      </button>
                      <button
                        className={`wishlist-button compact ${saved.has(work.dbId || dbWorkId(work)) ? 'saved' : ''}`}
                        onClick={() => saveWork(work)}
                        disabled={savingId === (work.dbId || dbWorkId(work))}
                        aria-label={saved.has(work.dbId || dbWorkId(work)) ? '読みたいを解除' : '読みたいに追加'}
                      >
                        {savingId === (work.dbId || dbWorkId(work))
                          ? <LoaderCircle size={16} className="spin" />
                          : saved.has(work.dbId || dbWorkId(work))
                            ? <BookmarkCheck size={16} />
                            : <Bookmark size={16} />}
                        <span>{saved.has(work.dbId || dbWorkId(work)) ? '読みたい解除' : '読みたい'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="content-section bookshelf-section" id="bookshelf">
          <div className="section-top">
            <div>
              <span className="section-kicker">MY BOOKSHELF</span>
              <h2>読みたい本棚</h2>
              <p>「読みたい」に保存した作品を、この端末でいつでも見返せます。</p>
            </div>
            <div className="bookshelf-count"><BookmarkCheck size={17} /> {bookshelfWorks.length}冊</div>
          </div>

          {bookshelfWorks.length ? (
            <div className="bookshelf-grid">
              {bookshelfWorks.map((work) => (
                <article className="bookshelf-card" key={work.dbId}>
                  <a
                    className="bookshelf-cover"
                    href={detailHref(work)}
                    onClick={(event) => { event.preventDefault(); openDetail(work) }}
                    aria-label={`${work.title}の詳細を見る`}
                  >
                    <Cover work={work} />
                  </a>
                  <div className="bookshelf-body">
                    <span>{work.genre || (work.type === 'manga' ? '漫画' : '小説')}</span>
                    <a className="bookshelf-title-link" href={detailHref(work)} onClick={(event) => { event.preventDefault(); openDetail(work) }}>{work.title}</a>
                    <p>{work.author || '著者情報なし'}</p>
                    <div className="bookshelf-metrics">
                      <Stars score={work.score} />
                      <span><MessageCircle size={13} /> {work.reviews}</span>
                      <span><Bookmark size={13} /> {work.saves}</span>
                    </div>
                    <div className="bookshelf-actions">
                      <button className="bookshelf-remove-button" onClick={() => saveWork(work)} disabled={savingId === work.dbId}>
                        {savingId === work.dbId ? <LoaderCircle size={14} className="spin" /> : <BookmarkCheck size={14} />}
                        本棚から外す
                      </button>
                      <button className="bookshelf-detail-button" onClick={() => openDetail(work)}>
                        詳細を見る <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bookshelf-empty">
              <Bookmark size={30} />
              <h3>まだ「読みたい」がありません</h3>
              <p>気になる漫画や小説を検索して、「読みたい」を押すとここに並びます。</p>
              <a href="#top">作品を探す <ChevronRight size={16} /></a>
            </div>
          )}
        </section>

        <section className="discover-section" id="discover">
          <div className="discover-copy">
            <span className="section-kicker">DISCOVER</span>
            <h2>人気テーマから漫画・小説を探そう。</h2>
            <p>恋愛、青春、ミステリー、ファンタジーなど、読みたい気分に合わせて実在する漫画・小説を探せます。</p>
          </div>
          <div className="mood-grid topic-link-grid">
            {discoveryTopics.map((topic) => (
              <a
                key={`${topic.type}-${topic.query}`}
                href={searchHref(topic.query, topic.type)}
                onClick={(event) => {
                  event.preventDefault()
                  searchBooks(null, topic.query, topic.type)
                }}
              >
                <span><b>{topic.emoji}</b><small>{topic.type === 'manga' ? '漫画' : '小説'}</small>{topic.label}</span>
                <ChevronRight size={17} />
              </a>
            ))}
          </div>
        </section>

        <section className="content-section review-section" id="reviews">
          <div className="section-top">
            <div>
              <span className="section-kicker">REVIEWS</span>
              <h2>みんなのひとこと感想</h2>
              <p>長文じゃなくてもOK。投稿された感想は、すべてのヨミピク利用者に共有されます。</p>
            </div>
          </div>

          {communityError && (
            <div className="community-note">{communityError}</div>
          )}

          <div className="review-feed">
            {sharedReviews.length > 0 ? sharedReviews.slice(0, 8).map((review) => {
              const work = rowWork(review)
              return (
                <article className="review-card" key={review.id}>
                  <div className="review-user"><span>Y</span><div><strong>ヨミピク読者</strong><small>{new Date(review.created_at).toLocaleDateString('ja-JP')}</small></div></div>
                  <div className="review-work"><Cover work={work} small /><div><small>{work.genre}</small><strong>{work.title}</strong></div></div>
                  <div className="review-score"><Stars score={review.rating} /> {review.mood && <span>{review.mood}</span>}</div>
                  <p>{review.body}</p>
                  {review.is_mine && (
                    <div className="own-review-actions">
                      <span>自分の感想</span>
                      <button onClick={() => deleteReview(review)} disabled={deletingReviewId === review.id}>
                        {deletingReviewId === review.id ? <LoaderCircle size={14} className="spin" /> : <Trash2 size={14} />}
                        {deletingReviewId === review.id ? '削除中' : '削除'}
                      </button>
                    </div>
                  )}
                </article>
              )
            }) : (
              <div className="search-status review-empty">
                <MessageCircle size={28} />
                <h3>まだ感想がありません</h3>
                <p>実在する作品を検索して「感想」を押すと、ここにみんなの感想として表示されます。</p>
              </div>
            )}
          </div>
        </section>

        <section className="cta-section">
          <div>
            <span className="section-kicker light">COMMUNITY</span>
            <h2>あなたの「好き」がランキングを動かす。</h2>
            <p>「読みたい」と感想が集まるほど、ヨミピク独自ランキングが育っていきます。</p>
          </div>
          <a href="#search-results">作品を探す <ChevronRight size={18} /></a>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-icon"><BookOpen size={19} /></span><span>ヨミピク</span></a>
        <p>漫画・小説のランキングと感想を楽しむ読書コミュニティ。</p>
        <small>© 2026 YomiPic. 実作品検索にはGoogle Booksを利用しています。共有ランキングはヨミピク内の反応を集計しています。</small>
      </footer>

      {detailWork && (
        <div className="detail-page" role="dialog" aria-modal="true" aria-label={`${detailWork.title}の作品詳細`}>
          <div className="detail-header">
            <button className="detail-back" onClick={closeDetail}>
              <ChevronRight size={18} />
              戻る
            </button>
            <a className="brand detail-brand" href="#top" onClick={closeDetail}>
              <span className="brand-icon"><BookOpen size={18} /></span>
              <span>ヨミピク</span>
            </a>
            <button className="detail-close" onClick={closeDetail} aria-label="詳細を閉じる">
              <X size={20} />
            </button>
          </div>

          <div className="detail-scroll">
            <section className="detail-hero">
              <div className="detail-cover-wrap">
                <Cover work={detailWork} />
              </div>

              <div className="detail-main">
                <span className="detail-type">{detailWork.type === 'manga' ? '漫画' : '小説'} ・ {detailWork.genre || '書籍'}</span>
                <h1>{detailWork.title}</h1>
                <p className="detail-author">{detailWork.author || '著者情報なし'}</p>

                <div className="detail-stats">
                  <div>
                    <strong>{detailAverage ? detailAverage.toFixed(1) : '—'}</strong>
                    <span><Star size={15} fill={detailAverage ? 'currentColor' : 'none'} /> ヨミピク評価</span>
                  </div>
                  <div>
                    <strong>{detailReviews.length}</strong>
                    <span><MessageCircle size={15} /> 感想</span>
                  </div>
                  <div>
                    <strong>{detailSaveCount}</strong>
                    <span><Bookmark size={15} /> 読みたい</span>
                  </div>
                </div>

                <div className="detail-actions">
                  <button className="detail-review-button" onClick={() => openReview(detailWork)}>
                    <PenLine size={17} /> 感想を書く
                  </button>
                  <button
                    className={`wishlist-button detail-wishlist ${saved.has(detailDbId) ? 'saved' : ''}`}
                    onClick={() => saveWork(detailWork)}
                    disabled={savingId === detailDbId}
                  >
                    {savingId === detailDbId
                      ? <LoaderCircle size={17} className="spin" />
                      : saved.has(detailDbId)
                        ? <BookmarkCheck size={17} />
                        : <Bookmark size={17} />}
                    <span>{saved.has(detailDbId) ? '読みたい解除' : '読みたい'}</span>
                  </button>
                  <button className="detail-share-button" onClick={shareDetail}>
                    <Share2 size={17} /> 共有
                  </button>
                  {detailWork.infoLink && (
                    <a className="detail-info-link" href={detailWork.infoLink} target="_blank" rel="noreferrer">
                      <ExternalLink size={17} /> 書籍情報
                    </a>
                  )}
                  {shareStatus && <span className="share-status">{shareStatus}</span>}
                </div>
              </div>
            </section>

            <section className="detail-reviews-section">
              <div className="detail-section-head">
                <div>
                  <span className="section-kicker">REVIEWS</span>
                  <h2>この作品の感想</h2>
                </div>
                <button onClick={() => openReview(detailWork)}><PenLine size={16} /> 感想を書く</button>
              </div>

              {detailReviews.length ? (
                <div className="detail-review-list">
                  {detailReviews.map((review) => (
                    <article className="detail-review-item" key={review.id}>
                      <div className="detail-review-top">
                        <div className="review-user">
                          <span>Y</span>
                          <div>
                            <strong>ヨミピク読者</strong>
                            <small>{new Date(review.created_at).toLocaleDateString('ja-JP')}</small>
                          </div>
                        </div>
                        <div className="review-score">
                          <Stars score={review.rating} />
                          {review.mood && <span>{review.mood}</span>}
                        </div>
                      </div>
                      <p>{review.body}</p>
                      {review.is_mine && (
                        <div className="own-review-actions">
                          <span>自分の感想</span>
                          <button onClick={() => deleteReview(review)} disabled={deletingReviewId === review.id}>
                            {deletingReviewId === review.id ? <LoaderCircle size={14} className="spin" /> : <Trash2 size={14} />}
                            {deletingReviewId === review.id ? '削除中' : '削除'}
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="detail-empty">
                  <MessageCircle size={28} />
                  <h3>まだ感想がありません</h3>
                  <p>この作品の最初の感想を投稿してみましょう。</p>
                  <button onClick={() => openReview(detailWork)}>感想を書く</button>
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {reviewOpen && selected && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setReviewOpen(false)}>
          <div className="review-modal" role="dialog" aria-modal="true" aria-label="感想を書く">
            <button className="modal-close" onClick={() => setReviewOpen(false)} aria-label="閉じる"><X size={20} /></button>
            <div className="modal-head">
              <Cover work={selected} small />
              <div><small>感想を書く</small><h3>{selected.title}</h3><p>{selected.author}</p></div>
            </div>

            <form onSubmit={submitReview}>
              <label>評価</label>
              <div className="rating-row">
                {[1,2,3,4,5].map((n) => (
                  <button type="button" key={n} onClick={() => setRating(n)} className={n <= rating ? 'on' : ''}>
                    <Star size={25} fill={n <= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
                <strong>{rating}.0</strong>
              </div>

              <label>どんな作品だった？ <span>任意</span></label>
              <div className="mood-select">
                {moods.map((item) => (
                  <button type="button" key={item} className={mood === item ? 'active' : ''} onClick={() => setMood(item)}>{item}</button>
                ))}
              </div>

              {communityError && <div className="modal-error">{communityError}</div>}

              <label htmlFor="reviewText">ひとこと感想</label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="読んだ直後の気持ちを気軽に書いてみよう"
                maxLength={240}
                required
              />
              <div className="form-bottom"><span>{reviewText.length}/240</span><button type="submit" disabled={postingReview}>{postingReview ? '投稿中…' : 'みんなに投稿する'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
