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

const intentGuides = [
  { slug: 'completed', label: '完結漫画', query: '完結漫画', type: 'manga', emoji: '✅', description: '最後までまとめて読める、完結済みの定番漫画を中心に選びました。' },
  { slug: 'binge', label: '一気読みしたい漫画', query: '一気読み漫画', type: 'manga', emoji: '📚', description: '続きが気になって止まりにくい、テンポよく読み進めやすい漫画を集めました。' },
  { slug: 'college', label: '大学生におすすめ漫画', query: '大学生漫画', type: 'manga', emoji: '🎓', description: '進路、人間関係、挑戦や成長など、大学生にも刺さりやすいテーマの漫画を選びました。' },
  { slug: 'short', label: '短く読める漫画', query: '短編漫画', type: 'manga', emoji: '⏱️', description: '少ない巻数や短編で読み切りやすく、初めてでも手に取りやすい漫画を集めました。' },
  { slug: 'bedtime', label: '寝る前に読みたい小説', query: '寝る前小説', type: 'novel', emoji: '🌙', description: '寝る前の静かな時間に読みやすい、やさしい余韻や落ち着いた物語の小説を選びました。' },
  { slug: 'binge', label: '一気読みしたい小説', query: '一気読み小説', type: 'novel', emoji: '⚡', description: '展開が気になり、ページをめくる手が止まりにくい小説を中心に集めました。' },
  { slug: 'college', label: '大学生におすすめ小説', query: '大学生小説', type: 'novel', emoji: '🎒', description: '青春、将来、人間関係、自分らしさなど、大学生が共感しやすい小説を選びました。' },
  { slug: 'short', label: '短く読める小説', query: '短編小説', type: 'novel', emoji: '☕', description: '短編集や比較的コンパクトな作品を中心に、すきま時間でも楽しみやすい小説を集めました。' },
]

function rankingHref(type) {
  return `/ranking/${type === 'novel' ? 'novel' : 'manga'}`
}

function topicHref(topic) {
  return `/theme/${topic.type}/${topic.slug}`
}

function guideHref(guide) {
  return `/guide/${guide.type}/${guide.slug}`
}

function seriesHref(work) {
  const title = seriesTitle(work?.seriesTitle || work?.title || '')
  if (!title) return '#'
  return `/series/${work?.type === 'novel' ? 'novel' : 'manga'}/${encodeURIComponent(title)}`
}

function landingForQuery(query, type) {
  const topic = discoveryTopics.find((item) => item.query === query && item.type === type)
  if (topic) return { kind: 'theme', item: topic }
  const guide = intentGuides.find((item) => item.query === query && item.type === type)
  if (guide) return { kind: 'guide', item: guide }
  return null
}

function searchHref(query, type) {
  const landing = landingForQuery(query, type)
  if (landing?.kind === 'theme') return topicHref(landing.item)
  if (landing?.kind === 'guide') return guideHref(landing.item)

  const params = new URLSearchParams({
    q: query,
    type: type === 'novel' ? 'novel' : 'manga',
  })
  return `/?${params.toString()}`
}

function searchPageLabel(query, type) {
  const landing = landingForQuery(query, type)
  return landing?.item?.label || `${query}${type === 'novel' ? '小説' : '漫画'}`
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

  const guideMatch = path.match(/^\/guide\/(manga|novel)\/([a-z0-9-]+)$/)
  if (guideMatch) {
    const guide = intentGuides.find((item) => item.type === guideMatch[1] && item.slug === guideMatch[2])
    if (guide) return { kind: 'guide', type: guide.type, guide }
  }

  const seriesMatch = path.match(/^\/series\/(manga|novel)\/(.+)$/)
  if (seriesMatch) {
    try {
      return { kind: 'series', type: seriesMatch[1], title: decodeURIComponent(seriesMatch[2]) }
    } catch {
      return { kind: 'series', type: seriesMatch[1], title: seriesMatch[2] }
    }
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

function seriesWorkId(work) {
  const type = work?.type === 'novel' ? 'novel' : 'manga'
  const title = seriesTitle(work?.seriesTitle || work?.title || '')
  return `${type}::series-${encodeURIComponent(title.normalize('NFKC').toLowerCase())}`
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

function seriesKey(type, title) {
  const normalized = seriesTitle(title)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s　・･:：!！?？,，.。'"“”‘’「」『』【】()（）\[\]<>＜＞\-―ー]/g, '')
  return `${type || 'book'}::${normalized}`
}

function sourceBookId(work) {
  if (!work) return ''
  if (work.sourceId) return String(work.sourceId)
  const id = String(work.id || '')
  return id.startsWith('google-') ? id.slice(7) : ''
}

function detailHref(work) {
  return seriesHref(work)
}

function buildDetailUrl(work) {
  return new URL(seriesHref(work), window.location.origin).toString()
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
        <img src={work.image} alt={`${work.title}の書影`} loading="lazy" decoding="async" />
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
  const [detailReturnUrl, setDetailReturnUrl] = useState('')
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
      const route = routeInfo()
      const params = new URLSearchParams(window.location.search)
      const legacyBookId = params.get('book')
      const legacyType = params.get('type') === 'novel' ? 'novel' : 'manga'
      const urlType = route.kind === 'series' ? route.type : legacyType
      const seriesName = route.kind === 'series' ? seriesTitle(route.title) : ''

      if (!legacyBookId && !seriesName) {
        if (active) setDetailWork(null)
        return
      }

      try {
        if (seriesName) {
          const response = await fetch(`/api/books?q=${encodeURIComponent(seriesName)}&type=${urlType}`)
          const data = await response.json()
          if (!response.ok) throw new Error(data.error || '作品情報を取得できませんでした')

          const expectedKey = seriesKey(urlType, seriesName)
          const item = (data.items || []).find((candidate) => seriesKey(urlType, candidate.title) === expectedKey)
            || (data.items || [])[0]

          if (active && item) {
            setType(urlType)
            setDetailWork({
              ...item,
              title: seriesName,
              seriesTitle: seriesName,
            })
          }
          return
        }

        const response = await fetch(`/api/books?id=${encodeURIComponent(legacyBookId)}&type=${urlType}`)
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || '作品情報を取得できませんでした')
        if (active && data.item) {
          const normalizedTitle = seriesTitle(data.item.title)
          setType(urlType)
          setDetailWork({
            ...data.item,
            title: normalizedTitle,
            seriesTitle: normalizedTitle,
          })
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

  const savedSeriesKeys = useMemo(() => {
    const keys = new Set()

    for (const row of sharedSaves) {
      if (!saved.has(row.work_id)) continue
      const [rowType = 'book'] = String(row.work_id || '').split('::')
      keys.add(seriesKey(rowType, row.title))
    }

    return keys
  }, [saved, sharedSaves])

  const seriesStatsMap = useMemo(() => {
    const map = new Map()

    const ensure = (row) => {
      const [rowType = 'book'] = String(row.work_id || '').split('::')
      const key = seriesKey(rowType, row.title)
      if (!map.has(key)) map.set(key, { saves: 0, reviews: 0, ratingTotal: 0 })
      return map.get(key)
    }

    for (const row of sharedSaves) {
      ensure(row).saves += 1
    }

    for (const row of sharedReviews) {
      const stats = ensure(row)
      stats.reviews += 1
      stats.ratingTotal += Number(row.rating || 0)
    }

    for (const stats of map.values()) {
      stats.score = stats.reviews ? stats.ratingTotal / stats.reviews : 0
    }

    return map
  }, [sharedSaves, sharedReviews])

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
    const bySeries = new Map()

    for (const row of sharedSaves) {
      if (!saved.has(row.work_id)) continue
      const base = rowWork(row)
      const key = seriesKey(base.type, row.title)

      if (!bySeries.has(key)) {
        bySeries.set(key, {
          ...base,
          title: seriesTitle(row.title),
          seriesKey: key,
        })
      }
    }

    return [...bySeries.values()].map((work) => {
      const stats = seriesStatsMap.get(work.seriesKey) || {}
      return {
        ...work,
        score: stats.score || 0,
        reviews: stats.reviews || 0,
        saves: stats.saves || 0,
      }
    })
  }, [saved, sharedSaves, seriesStatsMap])

  const detailDbId = detailWork ? (detailWork.dbId || dbWorkId(detailWork)) : ''
  const detailSeriesKey = detailWork ? seriesKey(detailWork.type, detailWork.seriesTitle || detailWork.title) : ''
  const detailReviews = useMemo(
    () => detailSeriesKey
      ? sharedReviews.filter((review) => {
          const [rowType = 'book'] = String(review.work_id || '').split('::')
          return seriesKey(rowType, review.title) === detailSeriesKey
        })
      : [],
    [detailSeriesKey, sharedReviews],
  )
  const detailAverage = detailReviews.length
    ? detailReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / detailReviews.length
    : 0
  const detailSaveCount = useMemo(
    () => detailSeriesKey
      ? sharedSaves.filter((row) => {
          const [rowType = 'book'] = String(row.work_id || '').split('::')
          return seriesKey(rowType, row.title) === detailSeriesKey
        }).length
      : 0,
    [detailSeriesKey, sharedSaves],
  )

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
    const canonicalTitle = seriesTitle(work?.seriesTitle || work?.title)
    if (!canonicalTitle) return

    setDetailReturnUrl(`${window.location.pathname}${window.location.search}${window.location.hash}`)
    setDetailWork({
      ...work,
      title: canonicalTitle,
      seriesTitle: canonicalTitle,
    })
    setShareStatus('')
    window.history.pushState({ yomipicDetail: true }, '', seriesHref({ ...work, title: canonicalTitle }))
  }

  const closeDetail = () => {
    setDetailWork(null)
    setShareStatus('')

    const target = detailReturnUrl && !detailReturnUrl.startsWith('/series/')
      ? detailReturnUrl
      : '/'

    window.history.replaceState({}, '', target)
    setDetailReturnUrl('')
    setPageRoute(routeInfo())
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
    const origin = 'https://yomipic.vercel.app'
    const homeTitle = 'ヨミピク｜漫画・小説の人気ランキング・感想・読みたい本棚'
    const homeDescription = 'ヨミピクは、漫画・小説を検索し、みんなの感想や評価、人気ランキングから次に読む一冊を探せる読書コミュニティ。気になる作品は「読みたい本棚」に保存できます。'
    const searchLabel = query ? searchPageLabel(query, type) : ''
    const rankingLabel = pageRoute.type === 'novel' ? '小説' : '漫画'
    const rankingDescription = `${rankingLabel}の人気作品をタイトル単位で紹介。公開ランキング・販売動向を参考にした初期順位へ、ヨミピク内の「読みたい」と感想を反映しています。`
    const themeDescription = pageRoute.kind === 'theme' && pageRoute.topic
      ? `${pageRoute.topic.label}のおすすめ・定番作品を探せます。${pageRoute.topic.description} 感想や「読みたい」数もチェックできます。`
      : ''
    const guideDescription = pageRoute.kind === 'guide' && pageRoute.guide
      ? `${pageRoute.guide.label}を探す特集ページ。${pageRoute.guide.description} 感想や「読みたい」数も比較できます。`
      : ''
    const seriesName = detailWork?.seriesTitle || detailWork?.title || (pageRoute.kind === 'series' ? pageRoute.title : '')
    const seriesDescription = seriesName
      ? `${seriesName}の感想・評価をヨミピクでチェック。巻ごとの反応を作品タイトル単位にまとめ、みんなのレビューや「読みたい」数を確認できます。`
      : ''
    const searchDescription = searchLabel
      ? `${searchLabel}をヨミピクで検索。実在する作品を探し、みんなの感想・評価・「読みたい」数を確認できます。`
      : homeDescription

    const isArbitrarySearch = !detailWork && hasSearched && query && pageRoute.kind === 'home'
    const pageTitle = detailWork
      ? `${seriesName}の感想・評価｜ヨミピク`
      : pageRoute.kind === 'ranking'
        ? `${rankingLabel}人気ランキング｜おすすめ作品・感想｜ヨミピク`
        : pageRoute.kind === 'theme' && pageRoute.topic
          ? `${pageRoute.topic.label}おすすめ・人気作品｜ヨミピク`
          : pageRoute.kind === 'guide' && pageRoute.guide
            ? `${pageRoute.guide.label}｜おすすめ作品特集｜ヨミピク`
            : pageRoute.kind === 'series' && pageRoute.title
              ? `${pageRoute.title}の感想・評価｜ヨミピク`
              : hasSearched && query
                ? `${searchLabel}を探す｜ヨミピク`
                : homeTitle

    const pageDescription = detailWork
      ? seriesDescription
      : pageRoute.kind === 'ranking'
        ? rankingDescription
        : pageRoute.kind === 'theme'
          ? themeDescription
          : pageRoute.kind === 'guide'
            ? guideDescription
            : pageRoute.kind === 'series'
              ? seriesDescription
              : hasSearched && query
                ? searchDescription
                : homeDescription

    const pageUrl = detailWork
      ? buildDetailUrl(detailWork)
      : pageRoute.kind === 'ranking'
        ? `${origin}${rankingHref(pageRoute.type)}`
        : pageRoute.kind === 'theme' && pageRoute.topic
          ? `${origin}${topicHref(pageRoute.topic)}`
          : pageRoute.kind === 'guide' && pageRoute.guide
            ? `${origin}${guideHref(pageRoute.guide)}`
            : pageRoute.kind === 'series' && pageRoute.title
              ? `${origin}${seriesHref({ type: pageRoute.type, title: pageRoute.title })}`
              : hasSearched && query
                ? `${origin}/?q=${encodeURIComponent(query)}&type=${type}`
                : `${origin}/`

    const pageImage = detailWork?.image || `${origin}/favicon.svg`

    const setMeta = (selector, value) => {
      const element = document.querySelector(selector)
      if (element) element.setAttribute('content', value)
    }

    const upsertJsonLd = (id, data) => {
      let script = document.getElementById(id)
      if (!data) {
        script?.remove()
        return
      }
      if (!script) {
        script = document.createElement('script')
        script.id = id
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(data)
    }

    document.title = pageTitle
    setMeta('meta[name="description"]', pageDescription)
    setMeta('meta[name="robots"]', isArbitrarySearch ? 'noindex,follow,max-image-preview:large' : 'index,follow,max-image-preview:large')
    setMeta('meta[property="og:title"]', pageTitle)
    setMeta('meta[property="og:description"]', pageDescription)
    setMeta('meta[property="og:url"]', pageUrl)
    setMeta('meta[property="og:image"]', pageImage)
    setMeta('meta[name="twitter:title"]', pageTitle)
    setMeta('meta[name="twitter:description"]', pageDescription)
    setMeta('meta[name="twitter:image"]', pageImage)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', pageUrl)

    const bookData = detailWork
      ? {
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: seriesName,
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
      : null
    upsertJsonLd('yomipic-book-jsonld', bookData)

    const listWorks = !detailWork && pageRoute.kind === 'ranking'
      ? works.slice(0, 10)
      : !detailWork && (pageRoute.kind === 'theme' || pageRoute.kind === 'guide')
        ? liveResults.slice(0, 10)
        : []

    const listName = pageRoute.kind === 'ranking'
      ? `${rankingLabel}人気ランキング`
      : pageRoute.kind === 'theme'
        ? `${pageRoute.topic?.label || searchLabel}おすすめ作品`
        : pageRoute.kind === 'guide'
          ? `${pageRoute.guide?.label || searchLabel}おすすめ作品`
          : ''

    const listData = listWorks.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: listName,
          itemListElement: listWorks.map((work, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: seriesTitle(work.title),
            url: new URL(detailHref(work), origin).toString(),
          })),
        }
      : null
    upsertJsonLd('yomipic-list-jsonld', listData)

    let breadcrumbLabel = ''
    if (pageRoute.kind === 'ranking') breadcrumbLabel = `${rankingLabel}人気ランキング`
    if (pageRoute.kind === 'theme') breadcrumbLabel = pageRoute.topic?.label || ''
    if (pageRoute.kind === 'guide') breadcrumbLabel = pageRoute.guide?.label || ''
    if (pageRoute.kind === 'series') breadcrumbLabel = pageRoute.title || ''
    if (detailWork) breadcrumbLabel = seriesName

    const breadcrumbItems = breadcrumbLabel
      ? [
          { '@type': 'ListItem', position: 1, name: 'ヨミピク', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: breadcrumbLabel, item: pageUrl },
        ]
      : []

    upsertJsonLd(
      'yomipic-breadcrumb-jsonld',
      breadcrumbItems.length
        ? { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbItems }
        : null,
    )

    return () => {
      document.title = homeTitle
    }
  }, [
    detailWork,
    detailAverage,
    detailReviews.length,
    hasSearched,
    query,
    type,
    pageRoute,
    works,
    liveResults,
  ])

  const saveWork = async (work) => {
    if (!work || work.demo || savingId) return

    const key = seriesKey(work.type, work.seriesTitle || work.title)
    const stableId = seriesWorkId(work)
    const ownRows = sharedSaves.filter((row) => {
      if (!saved.has(row.work_id)) return false
      const [rowType = 'book'] = String(row.work_id || '').split('::')
      return seriesKey(rowType, row.title) === key
    })
    const ownIds = [...new Set(ownRows.map((row) => row.work_id))]
    const isSaved = ownIds.length > 0 || savedSeriesKeys.has(key)

    setSavingId(key)
    setCommunityError('')

    try {
      if (isSaved) {
        const idsToRemove = ownIds.length ? ownIds : [stableId]

        for (const id of idsToRemove) {
          const response = await fetch('/api/community', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              kind: 'unsave',
              deviceId,
              work: {
                workId: id,
                title: seriesTitle(work.title),
                author: work.author || '',
                imageUrl: work.image || '',
                genre: work.genre || '',
              },
            }),
          })

          const data = await response.json()
          if (!response.ok) throw new Error(data.error || '「読みたい」を解除できませんでした')
        }

        const removeSet = new Set(idsToRemove)
        setSaved((prev) => {
          const next = new Set(prev)
          for (const id of removeSet) next.delete(id)
          return next
        })
        setSharedSaves((prev) => prev.filter((row) => !removeSet.has(row.work_id)))
      } else {
        const response = await fetch('/api/community', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind: 'save',
            deviceId,
            work: {
              workId: stableId,
              title: seriesTitle(work.title),
              author: work.author || '',
              imageUrl: work.image || '',
              genre: work.genre || '',
            },
          }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || '「読みたい」を保存できませんでした')

        setSaved((prev) => new Set([...prev, stableId]))
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
            workId: seriesWorkId(selected),
            title: seriesTitle(selected.title),
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
    const landing = landingForQuery(term, targetType)

    if (forcedQuery !== undefined) setQuery(forcedQuery)
    if (forcedType) setType(targetType)

    if (!options.keepUrl) {
      window.history.replaceState({ yomipicSearch: true }, '', searchHref(term, targetType))
    }

    if (landing?.kind === 'theme') {
      setPageRoute({ kind: 'theme', type: targetType, topic: landing.item })
    } else if (landing?.kind === 'guide') {
      setPageRoute({ kind: 'guide', type: targetType, guide: landing.item })
    } else {
      setPageRoute({ kind: 'home' })
    }

    setHasSearched(true)
    setLiveLoading(true)
    setLiveError('')

    try {
      const response = await fetch(`/api/books?q=${encodeURIComponent(term)}&type=${targetType}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '検索に失敗しました')
      const uniqueSeries = []
      const seenSeries = new Set()
      for (const item of (data.items || [])) {
        const key = seriesKey(item.type, item.title)
        if (seenSeries.has(key)) continue
        seenSeries.add(key)
        uniqueSeries.push({
          ...item,
          title: seriesTitle(item.title),
          seriesTitle: seriesTitle(item.title),
        })
      }
      setLiveResults(uniqueSeries)
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

  const switchSearchType = (targetType) => {
    const nextType = targetType === 'novel' ? 'novel' : 'manga'

    if (pageRoute.kind === 'theme' && pageRoute.topic) {
      const counterpart = discoveryTopics.find((item) => item.type === nextType && item.slug === pageRoute.topic.slug)
      if (counterpart) {
        searchBooks(null, counterpart.query, nextType)
        return
      }
    }

    if (pageRoute.kind === 'guide' && pageRoute.guide) {
      const counterpart = intentGuides.find((item) => item.type === nextType && item.slug === pageRoute.guide.slug)
      if (counterpart) {
        searchBooks(null, counterpart.query, nextType)
        return
      }
    }

    if (query) searchBooks(null, query, nextType)
    else setType(nextType)
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

      if (route.kind === 'guide') {
        searchBooks(null, route.guide.query, route.type, { keepUrl: true, noScroll: true })
        return
      }

      if (route.kind === 'series') {
        setType(route.type)
        setHasSearched(false)
        setQuery('')
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
        <a className="brand" href="/" aria-label="ヨミピク トップ">
          <span className="brand-icon"><BookOpen size={21} /></span>
          <span>ヨミピク</span>
        </a>

        <nav className="desktop-nav" aria-label="メインメニュー">
          <a href={rankingHref('manga')} onClick={(event) => navigateRanking(event, 'manga')}>漫画ランキング</a>
          <a href={rankingHref('novel')} onClick={(event) => navigateRanking(event, 'novel')}>小説ランキング</a>
          <a href="/#discover">人気テーマ</a>
          <a href="/#reviews">みんなの感想</a>
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
            {pageRoute.kind === 'ranking' ? (
              <>
                <h1>{pageRoute.type === 'novel' ? '小説' : '漫画'}人気ランキング<br /><span>次に読む作品を見つけよう。</span></h1>
                <p>巻ごとではなく作品タイトル単位で集計。外部の人気情報を土台に、ヨミピク内の「読みたい」と感想を反映します。</p>
              </>
            ) : pageRoute.kind === 'theme' && pageRoute.topic ? (
              <>
                <h1>{pageRoute.topic.label}<br /><span>おすすめ・人気作品</span></h1>
                <p>{pageRoute.topic.description} 感想や「読みたい」数も見ながら選べます。</p>
              </>
            ) : pageRoute.kind === 'guide' && pageRoute.guide ? (
              <>
                <h1>{pageRoute.guide.label}<br /><span>今の気分に合う一冊を。</span></h1>
                <p>{pageRoute.guide.description} 感想や「読みたい」数も見ながら比較できます。</p>
              </>
            ) : (
              <>
                <h1>次に読む一冊が、<br /><span>きっと見つかる。</span></h1>
                <p>漫画と小説の人気ランキングをチェック。読んだ作品には、気軽にひとこと感想を残せます。</p>
              </>
            )}

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
              <span>人気テーマ:</span>
              {discoveryTopics.filter((topic) => topic.type === type).slice(0, 5).map((topic) => (
                <a
                  key={`hero-${topic.type}-${topic.slug}`}
                  href={topicHref(topic)}
                  onClick={(event) => {
                    event.preventDefault()
                    searchBooks(null, topic.query, topic.type)
                  }}
                >
                  {topic.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
        </section>

        {pageRoute.kind !== 'home' && (
          <nav className="breadcrumbs" aria-label="パンくず">
            <a href="/">ヨミピク</a>
            <ChevronRight size={14} />
            <span>
              {pageRoute.kind === 'ranking'
                ? `${pageRoute.type === 'novel' ? '小説' : '漫画'}人気ランキング`
                : pageRoute.kind === 'theme'
                  ? pageRoute.topic?.label
                  : pageRoute.kind === 'guide'
                    ? pageRoute.guide?.label
                    : pageRoute.kind === 'series'
                      ? pageRoute.title
                      : ''}
            </span>
          </nav>
        )}

        {hasSearched && (
          <section className="content-section search-results-section" id="search-results">
            <div className="section-top">
              <div>
                <span className="section-kicker">BOOK DISCOVERY</span>
                <h2>{searchPageLabel(query, type)}を探す</h2>
                <p className="search-intro">
                  {pageRoute.kind === 'theme' && pageRoute.topic
                    ? pageRoute.topic.description
                    : pageRoute.kind === 'guide' && pageRoute.guide
                      ? pageRoute.guide.description
                      : `${searchPageLabel(query, type)}の実在作品を検索しています。気になる作品は感想・評価や「読みたい」数を確認して、本棚に保存できます。`}
                </p>
                <small className="search-source-note">書籍情報はGoogle Booksのデータを利用しています。</small>
              </div>
              <div className="type-switch" role="tablist" aria-label="検索する作品タイプ">
                <button
                  className={type === 'manga' ? 'active' : ''}
                  onClick={() => switchSearchType('manga')}
                >
                  漫画
                </button>
                <button
                  className={type === 'novel' ? 'active' : ''}
                  onClick={() => switchSearchType('novel')}
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
                      saved={savedSeriesKeys.has(seriesKey(work.type, work.title))}
                      saving={savingId === seriesKey(work.type, work.title)}
                      saveCount={seriesStatsMap.get(seriesKey(work.type, work.title))?.saves || 0}
                      reviewCount={seriesStatsMap.get(seriesKey(work.type, work.title))?.reviews || 0}
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

            {pageRoute.kind === 'theme' && pageRoute.topic && (
              <div className="theme-explainer">
                <h3>{pageRoute.topic.label}を探すときのポイント</h3>
                <p>{pageRoute.topic.description} ヨミピクでは、作品名だけでなく感想や「読みたい」数も一緒に見られるので、次に読む候補を比較しやすくしています。</p>
              </div>
            )}

            {pageRoute.kind === 'guide' && pageRoute.guide && (
              <div className="theme-explainer">
                <h3>{pageRoute.guide.label}の選び方</h3>
                <p>{pageRoute.guide.description} ここでは定番作品を中心に並べ、シリーズ単位の感想や「読みたい」数も一緒に比較できます。</p>
              </div>
            )}

            <nav className="related-searches" aria-label="関連ページ">
              <strong>{pageRoute.kind === 'guide' ? 'ほかの読書特集も見る' : `ほかの${type === 'manga' ? '漫画' : '小説'}テーマも見る`}</strong>
              <div>
                {(pageRoute.kind === 'guide' ? intentGuides : discoveryTopics)
                  .filter((item) => item.type === type && item.query !== query)
                  .slice(0, 5)
                  .map((item) => (
                    <a
                      key={`related-${item.type}-${item.slug}`}
                      href={pageRoute.kind === 'guide' ? guideHref(item) : topicHref(item)}
                      onClick={(event) => {
                        event.preventDefault()
                        searchBooks(null, item.query, item.type)
                      }}
                    >
                      {item.emoji} {item.label}
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
                        className={`wishlist-button compact ${savedSeriesKeys.has(seriesKey(work.type, work.title)) ? 'saved' : ''}`}
                        onClick={() => saveWork(work)}
                        disabled={savingId === seriesKey(work.type, work.title)}
                        aria-label={savedSeriesKeys.has(seriesKey(work.type, work.title)) ? '読みたいを解除' : '読みたいに追加'}
                      >
                        {savingId === seriesKey(work.type, work.title)
                          ? <LoaderCircle size={16} className="spin" />
                          : savedSeriesKeys.has(seriesKey(work.type, work.title))
                            ? <BookmarkCheck size={16} />
                            : <Bookmark size={16} />}
                        <span>{savedSeriesKeys.has(seriesKey(work.type, work.title)) ? '読みたい解除' : '読みたい'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {pageRoute.kind === 'ranking' && (
          <section className="seo-guide-section" aria-labelledby="ranking-guide-title">
            <span className="section-kicker">HOW TO READ</span>
            <h2 id="ranking-guide-title">{type === 'novel' ? '小説' : '漫画'}ランキングの見方</h2>
            <div className="seo-guide-grid">
              <article>
                <h3>作品タイトル単位で集計</h3>
                <p>巻ごとに順位を分けず、同じシリーズへの「読みたい」と感想をまとめて集計しています。</p>
              </article>
              <article>
                <h3>初期順位＋ヨミピク内の反応</h3>
                <p>公開ランキングや販売動向を参考にした初期順位を土台に、ヨミピク内の反応が増えるほど順位が変化します。</p>
              </article>
              <article>
                <h3>気になる作品は本棚へ</h3>
                <p>「読みたい」を押すと、この端末の読みたい本棚からあとで見返せます。</p>
              </article>
            </div>
            <div className="seo-guide-links">
              <strong>テーマから探す</strong>
              {discoveryTopics.filter((topic) => topic.type === type).map((topic) => (
                <a key={`guide-${topic.type}-${topic.slug}`} href={topicHref(topic)}>{topic.emoji} {topic.label}</a>
              ))}
            </div>
          </section>
        )}

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
                      <button className="bookshelf-remove-button" onClick={() => saveWork(work)} disabled={savingId === seriesKey(work.type, work.title)}>
                        {savingId === seriesKey(work.type, work.title) ? <LoaderCircle size={14} className="spin" /> : <BookmarkCheck size={14} />}
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

        <section className="content-section intent-section" id="reading-guides">
          <div className="section-top">
            <div>
              <span className="section-kicker">READING GUIDES</span>
              <h2>今の状況から、読みたい作品を探す。</h2>
              <p>「完結済み」「一気読みしたい」「大学生におすすめ」など、ジャンルより具体的な条件から探せます。</p>
            </div>
          </div>
          <div className="intent-guide-grid">
            {intentGuides.map((guide) => (
              <a
                key={`intent-${guide.type}-${guide.slug}`}
                href={guideHref(guide)}
                onClick={(event) => {
                  event.preventDefault()
                  searchBooks(null, guide.query, guide.type)
                }}
              >
                <span className="intent-guide-emoji">{guide.emoji}</span>
                <div>
                  <small>{guide.type === 'manga' ? '漫画' : '小説'}</small>
                  <strong>{guide.label}</strong>
                  <p>{guide.description}</p>
                </div>
                <ChevronRight size={18} />
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
        <a className="brand footer-brand" href="/"><span className="brand-icon"><BookOpen size={19} /></span><span>ヨミピク</span></a>
        <p>漫画・小説のランキングと感想を楽しむ読書コミュニティ。</p>
        <nav className="footer-links" aria-label="フッターメニュー">
          <a href={rankingHref('manga')}>漫画ランキング</a>
          <a href={rankingHref('novel')}>小説ランキング</a>
          {discoveryTopics.slice(0, 4).map((topic) => (
            <a key={`footer-${topic.type}-${topic.slug}`} href={topicHref(topic)}>{topic.label}</a>
          ))}
          {intentGuides.slice(0, 4).map((guide) => (
            <a key={`footer-guide-${guide.type}-${guide.slug}`} href={guideHref(guide)}>{guide.label}</a>
          ))}
        </nav>
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
                    className={`wishlist-button detail-wishlist ${savedSeriesKeys.has(detailSeriesKey) ? 'saved' : ''}`}
                    onClick={() => saveWork(detailWork)}
                    disabled={savingId === detailSeriesKey}
                  >
                    {savingId === detailSeriesKey
                      ? <LoaderCircle size={17} className="spin" />
                      : savedSeriesKeys.has(detailSeriesKey)
                        ? <BookmarkCheck size={17} />
                        : <Bookmark size={17} />}
                    <span>{savedSeriesKeys.has(detailSeriesKey) ? '読みたい解除' : '読みたい'}</span>
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
