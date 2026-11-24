import { useEffect, useMemo, useRef, useState } from 'react'
import { completedMangaPicks, completedIntentGuides } from '../completed-manga-data.js'
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

const popularSeries = [
  { type: 'manga', title: 'キングダム', author: '原泰久' },
  { type: 'manga', title: '葬送のフリーレン', author: '山田鐘人' },
  { type: 'manga', title: 'ONE PIECE', author: '尾田栄一郎' },
  { type: 'manga', title: 'メダリスト', author: 'つるまいかだ' },
  { type: 'manga', title: 'ブルーロック', author: '金城宗幸' },
  { type: 'manga', title: '呪術廻戦', author: '芥見下々' },
  { type: 'manga', title: '薫る花は凛と咲く', author: '三香見サカ' },
  { type: 'manga', title: 'SPY×FAMILY', author: '遠藤達哉' },
  { type: 'manga', title: '薬屋のひとりごと', author: '日向夏' },
  { type: 'manga', title: 'ダンダダン', author: '龍幸伸' },
  { type: 'novel', title: 'プロジェクト・ヘイル・メアリー', author: 'アンディ・ウィアー' },
  { type: 'novel', title: '変な地図', author: '雨穴' },
  { type: 'novel', title: 'わたしの幸せな結婚', author: '顎木あくみ' },
  { type: 'novel', title: '成瀬は都を駆け抜ける', author: '宮島未奈' },
  { type: 'novel', title: '爆弾', author: '呉勝浩' },
  { type: 'novel', title: '国宝', author: '吉田修一' },
  { type: 'novel', title: 'カフネ', author: '阿部暁子' },
  { type: 'novel', title: '方舟', author: '夕木春央' },
  { type: 'novel', title: '十角館の殺人', author: '綾辻行人' },
  { type: 'novel', title: '三体', author: '劉慈欣' },
]

const searchAliases = [
  ['manga', 'ハガレン', '鋼の錬金術師'],
  ['manga', 'はがれん', '鋼の錬金術師'],
  ['manga', '進撃', '進撃の巨人'],
  ['manga', 'しんげき', '進撃の巨人'],
  ['manga', 'スラダン', 'SLAM DUNK'],
  ['manga', 'slam dunk', 'SLAM DUNK'],
  ['manga', 'ヒロアカ', '僕のヒーローアカデミア'],
  ['manga', '僕アカ', '僕のヒーローアカデミア'],
  ['manga', '東リベ', '東京卍リベンジャーズ'],
  ['manga', 'とうりべ', '東京卍リベンジャーズ'],
  ['manga', 'デスノ', 'DEATH NOTE'],
  ['manga', 'デスノート', 'DEATH NOTE'],
  ['manga', 'フリーレン', '葬送のフリーレン'],
  ['manga', '鬼滅', '鬼滅の刃'],
  ['manga', 'きめつ', '鬼滅の刃'],
  ['manga', '呪術', '呪術廻戦'],
  ['manga', 'じゅじゅつ', '呪術廻戦'],
  ['manga', 'ワンピ', 'ONE PIECE'],
  ['manga', 'ワンピース', 'ONE PIECE'],
  ['manga', 'コナン', '名探偵コナン'],
  ['manga', '薬屋', '薬屋のひとりごと'],
  ['manga', 'ファブル', 'ザ・ファブル'],
  ['manga', '五等分', '五等分の花嫁'],
  ['manga', '高木さん', 'からかい上手の高木さん'],
  ['novel', 'ヘイルメアリー', 'プロジェクト・ヘイル・メアリー'],
  ['novel', '変な家', '変な家2 ～11の間取り図～'],
]

function normalizeSearchText(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ぁ-ゖ]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 0x60))
    .replace(/[\s　・･:：!！?？,，.。'"“”‘’「」『』【】()（）\[\]<>＜＞\-―ー]/g, '')
}

function editDistance(a, b) {
  const left = normalizeSearchText(a)
  const right = normalizeSearchText(b)
  if (!left) return right.length
  if (!right) return left.length
  const prev = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let i = 1; i <= left.length; i += 1) {
    let diagonal = prev[0]
    prev[0] = i
    for (let j = 1; j <= right.length; j += 1) {
      const above = prev[j]
      const cost = left[i - 1] === right[j - 1] ? 0 : 1
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diagonal + cost)
      diagonal = above
    }
  }
  return prev[right.length]
}

function resolveSearchTerm(term, type) {
  const normalized = normalizeSearchText(term)
  const alias = searchAliases.find(([aliasType, value]) => aliasType === type && normalizeSearchText(value) === normalized)
  if (alias) return alias[2]

  if (normalized.length < 3) return term

  const pool = [
    ...popularSeries.filter((work) => work.type === type).map((work) => work.title),
    ...(type === 'manga' ? completedMangaPicks.map((work) => work.title) : []),
  ]
  const exact = pool.find((title) => normalizeSearchText(title) === normalized)
  if (exact) return exact

  let best = null
  let bestDistance = Infinity
  for (const title of pool) {
    const distance = editDistance(normalized, title)
    if (distance < bestDistance) {
      best = title
      bestDistance = distance
    }
  }
  const allowed = normalized.length <= 5 ? 1 : 2
  return best && bestDistance <= allowed ? best : term
}

function sortReviewRows(rows, mode) {
  let values = [...rows]
  if (mode === 'no-spoiler') values = values.filter((review) => !reviewBodyInfo(review.body).spoiler)
  if (mode === 'high') return values.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0) || new Date(b.created_at) - new Date(a.created_at))
  if (mode === 'low') return values.sort((a, b) => Number(a.rating || 0) - Number(b.rating || 0) || new Date(b.created_at) - new Date(a.created_at))
  return values.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

const intentGuides = [
  { slug: 'completed', label: '完結漫画おすすめランキング100選', query: '完結漫画', type: 'manga', emoji: '✅', description: '最後まで読める完結済み漫画100作品を、巻数・ジャンル・読み方から比較して選べます。' },
  ...completedIntentGuides.map(({ titles, seoTitle, metaDescription, ...guide }) => guide),
  { slug: 'binge', label: '一気読みしたい漫画', query: '一気読み漫画', type: 'manga', emoji: '📚', description: '続きが気になって止まりにくい、テンポよく読み進めやすい漫画を集めました。' },
  { slug: 'college', label: '大学生におすすめ漫画', query: '大学生漫画', type: 'manga', emoji: '🎓', description: '進路、人間関係、挑戦や成長など、大学生にも刺さりやすいテーマの漫画を選びました。' },
  { slug: 'short', label: '短く読める漫画', query: '短編漫画', type: 'manga', emoji: '⏱️', description: '少ない巻数や短編で読み切りやすく、初めてでも手に取りやすい漫画を集めました。' },
  { slug: 'bedtime', label: '寝る前に読みたい小説', query: '寝る前小説', type: 'novel', emoji: '🌙', description: '寝る前の静かな時間に読みやすい、やさしい余韻や落ち着いた物語の小説を選びました。' },
  { slug: 'binge', label: '一気読みしたい小説', query: '一気読み小説', type: 'novel', emoji: '⚡', description: '展開が気になり、ページをめくる手が止まりにくい小説を中心に集めました。' },
  { slug: 'college', label: '大学生におすすめ小説', query: '大学生小説', type: 'novel', emoji: '🎒', description: '青春、将来、人間関係、自分らしさなど、大学生が共感しやすい小説を選びました。' },
  { slug: 'short', label: '短く読める小説', query: '短編小説', type: 'novel', emoji: '☕', description: '短編集や比較的コンパクトな作品を中心に、すきま時間でも楽しみやすい小説を集めました。' },

]


const completedMangaGroups = [
  {
    title: 'まず読みたい名作完結漫画',
    description: '王道の人気作や、読み終えたあとまで印象に残りやすい作品から選びたい人向け。',
    titles: ['鋼の錬金術師', '進撃の巨人', 'SLAM DUNK', 'ハイキュー!!', '鬼滅の刃', 'NARUTO―ナルト―'],
  },
  {
    title: '一気読みしたい完結漫画',
    description: '謎や続きが気になり、テンポよくページを進めたい人向け。',
    titles: ['DEATH NOTE', '約束のネバーランド', '僕だけがいない街', 'サマータイムレンダ', '彼方のアストラ', 'ゴールデンカムイ'],
  },
  {
    title: '比較的短く読み切りやすい完結漫画',
    description: '長編よりも、まずはまとまった物語を読み切りたい人向け。',
    titles: ['彼方のアストラ', '聲の形', 'チ。―地球の運動について―', '僕だけがいない街', '寄生獣', '四月は君の嘘'],
  },
  {
    title: '恋愛・青春を楽しめる完結漫画',
    description: '恋愛や成長、人間関係をじっくり味わいたい人向け。',
    titles: ['君に届け', 'ちはやふる', 'かぐや様は告らせたい', 'のだめカンタービレ', 'フルーツバスケット', '銀の匙 Silver Spoon'],
  },
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

function ResultCard({ work, saved, read, saveCount, reviewCount, onSave, onRead, onReview, onOpen, saving }) {
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
          <button
            className={`read-button compact ${read ? 'read' : ''}`}
            onClick={() => onRead(work)}
            aria-label={read ? '読んだを解除' : '読んだ作品に追加'}
          >
            <BookOpen size={16} />
            <span>{read ? '読んだ ✓' : '読んだ'}</span>
          </button>
        </div>
      </div>
    </article>
  )
}


const SPOILER_PREFIX = '[[YOMIPIC_SPOILER]]'

function reviewBodyInfo(body) {
  const raw = String(body || '')
  if (!raw.startsWith(SPOILER_PREFIX)) return { spoiler: false, text: raw }
  return { spoiler: true, text: raw.slice(SPOILER_PREFIX.length).trimStart() }
}

function ReviewBody({ body }) {
  const [revealed, setRevealed] = useState(false)
  const info = reviewBodyInfo(body)

  if (!info.spoiler) return <p>{info.text}</p>

  return (
    <div className={`spoiler-review ${revealed ? 'revealed' : ''}`}>
      <div className="spoiler-review-head">
        <strong>ネタバレあり</strong>
        <button type="button" onClick={() => setRevealed((value) => !value)}>
          {revealed ? '隠す' : '内容を見る'}
        </button>
      </div>
      {revealed
        ? <p>{info.text}</p>
        : <p className="spoiler-placeholder">内容を隠しています。読みたい場合だけ表示してください。</p>}
    </div>
  )
}

function workSnapshot(work) {
  return {
    id: work?.id || '',
    sourceId: work?.sourceId || '',
    type: work?.type === 'novel' ? 'novel' : 'manga',
    title: seriesTitle(work?.seriesTitle || work?.title || ''),
    author: work?.author || '',
    genre: work?.genre || '',
    image: work?.image || '',
    infoLink: work?.infoLink || '',
  }
}

function completedGenreGroup(category) {
  const value = String(category || '')
  if (/スポーツ|競技/.test(value)) return 'sports'
  if (/恋愛|ラブコメ|青春|学園|音楽/.test(value)) return 'romance'
  if (/サスペンス|ミステリー|SF/.test(value)) return 'mystery'
  if (/バトル|ファンタジー|ヒーロー|冒険/.test(value)) return 'action'
  return 'other'
}

function completedVolumeCount(work) {
  const match = String(work?.volumes || '').match(/\d+/)
  return match ? Number(match[0]) : 0
}


function completedLengthLabel(work) {
  const count = completedVolumeCount(work)
  if (!count) return '巻数を確認'
  if (count <= 10) return '短め・読み切りやすい'
  if (count <= 20) return 'ほどよい長さ'
  return 'じっくり長編'
}

function MangaComparison({ works, onRemove, onClear, onShare, shareStatus }) {
  return (
    <section className="manga-compare-panel" id="manga-compare" aria-labelledby="manga-compare-title">
      <div className="manga-compare-head">
        <div>
          <span>COMPARE</span>
          <h3 id="manga-compare-title">気になる漫画を比べる</h3>
          <p>最大3作品。巻数・ジャンル・読みごたえを並べて、次の1冊を決められます。</p>
        </div>
        {works.length > 0 && (
          <div className="manga-compare-head-actions">
            {works.length >= 2 && <button type="button" onClick={onShare}><Share2 size={13} /> 比較を共有</button>}
            <button type="button" onClick={onClear}>すべて外す</button>
            {shareStatus && <small>{shareStatus}</small>}
          </div>
        )}
      </div>

      {works.length < 2 ? (
        <div className="manga-compare-empty">
          <strong>{works.length ? 'あと1作品選ぶと比較できます' : '「比較に追加」を2〜3作品押してください'}</strong>
          <span>選択中 {works.length}/3</span>
          {works.length === 1 && (
            <button type="button" onClick={() => onRemove(works[0])}>「{works[0].title}」を外す</button>
          )}
        </div>
      ) : (
        <div className="manga-compare-scroll">
          <div className="manga-compare-grid" style={{ '--compare-count': works.length }}>
            <div className="compare-labels" aria-hidden="true">
              <strong>作品</strong>
              <span>巻数</span>
              <span>ジャンル</span>
              <span>読みごたえ</span>
              <span>こんな人に</span>
            </div>
            {works.map((work) => (
              <article key={work.title} className="compare-work">
                <div className="compare-work-title">
                  <small>{work.category}</small>
                  <strong>{work.title}</strong>
                  <em>{work.author}</em>
                </div>
                <b>{work.volumes}</b>
                <span>{work.category}</span>
                <span>{completedLengthLabel(work)}</span>
                <p>{work.note}</p>
                <div className="compare-work-actions">
                  <a href={seriesHref({ type: 'manga', title: work.title })}>作品を見る <ChevronRight size={14} /></a>
                  <button type="button" onClick={() => onRemove(work)}>外す</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
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
  const [reviewSpoiler, setReviewSpoiler] = useState(false)
  const [readWorks, setReadWorks] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem('yomipic-read-works') || '[]')
      return Array.isArray(value) ? value.slice(0, 200) : []
    } catch { return [] }
  })
  const [recentViews, setRecentViews] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem('yomipic-recent-views') || '[]')
      return Array.isArray(value) ? value.slice(0, 8) : []
    } catch { return [] }
  })
  const [completedVolumeFilter, setCompletedVolumeFilter] = useState('all')
  const [completedGenreFilter, setCompletedGenreFilter] = useState('all')
  const [completedSort, setCompletedSort] = useState('rank')
  const [diagnosisAnswers, setDiagnosisAnswers] = useState({ mood: '', length: '', pace: '' })
  const [compareTitles, setCompareTitles] = useState(() => {
    try {
      const value = new URLSearchParams(window.location.search).get('compare') || ''
      return value.split('|').map((item) => item.trim()).filter((title) => completedMangaPicks.some((work) => work.title === title)).slice(0, 3)
    } catch { return [] }
  })
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem('yomipic-search-history') || '[]')
      return Array.isArray(value) ? value.slice(0, 6) : []
    } catch { return [] }
  })
  const [diagnosisShareStatus, setDiagnosisShareStatus] = useState('')
  const [compareShareStatus, setCompareShareStatus] = useState('')
  const [reviewSort, setReviewSort] = useState('new')
  const [detailReviewSort, setDetailReviewSort] = useState('new')
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(() => window.matchMedia?.('(display-mode: standalone)')?.matches || false)
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
  const lastTrackedPage = useRef('')

  useEffect(() => {
    localStorage.setItem('yomipic-saved', JSON.stringify([...saved]))
  }, [saved])

  useEffect(() => {
    localStorage.setItem('yomipic-read-works', JSON.stringify(readWorks))
  }, [readWorks])

  useEffect(() => {
    localStorage.setItem('yomipic-recent-views', JSON.stringify(recentViews))
  }, [recentViews])

  useEffect(() => {
    localStorage.setItem('yomipic-search-history', JSON.stringify(searchHistory))
  }, [searchHistory])

  useEffect(() => {
    const onBeforeInstall = (event) => {
      event.preventDefault()
      setInstallPrompt(event)
    }
    const onInstalled = () => {
      setInstallPrompt(null)
      setIsInstalled(true)
      trackEvent('yomipic_pwa_installed')
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  useEffect(() => {
    if (!detailWork?.title) return
    const next = workSnapshot(detailWork)
    const key = seriesKey(next.type, next.title)
    setRecentViews((prev) => [
      next,
      ...prev.filter((item) => seriesKey(item.type, item.title) !== key),
    ].slice(0, 8))
  }, [detailWork])

  const readSeriesKeys = useMemo(
    () => new Set(readWorks.map((work) => seriesKey(work.type, work.title))),
    [readWorks],
  )

  const filteredCompletedMangaPicks = useMemo(() => {
    const filtered = completedMangaPicks.filter((work) => {
      const count = completedVolumeCount(work)
      const volumeMatches =
        completedVolumeFilter === 'all' ||
        (completedVolumeFilter === 'short' && count > 0 && count <= 10) ||
        (completedVolumeFilter === 'medium' && count >= 11 && count <= 20) ||
        (completedVolumeFilter === 'long' && count >= 21)

      const genreMatches =
        completedGenreFilter === 'all' ||
        completedGenreGroup(work.category) === completedGenreFilter

      return volumeMatches && genreMatches
    })

    if (completedSort === 'short') return [...filtered].sort((a, b) => completedVolumeCount(a) - completedVolumeCount(b))
    if (completedSort === 'long') return [...filtered].sort((a, b) => completedVolumeCount(b) - completedVolumeCount(a))
    return filtered
  }, [completedVolumeFilter, completedGenreFilter, completedSort])

  const diagnosisReady = Boolean(diagnosisAnswers.mood && diagnosisAnswers.length && diagnosisAnswers.pace)

  const diagnosisRecommendations = useMemo(() => {
    if (!diagnosisReady) return []

    const moodMatch = {
      hot: /スポーツ|バトル|ヒーロー|冒険/,
      emotional: /青春|人間ドラマ|音楽|恋愛/,
      romance: /恋愛|ラブコメ/,
      mystery: /サスペンス|ミステリー|SF|ダークファンタジー/,
    }[diagnosisAnswers.mood]

    return completedMangaPicks
      .map((work, index) => {
        const count = completedVolumeCount(work)
        let score = 50 - index * 0.45

        if (moodMatch?.test(work.category)) score += 18

        if (diagnosisAnswers.length === 'short' && count > 0 && count <= 10) score += 16
        if (diagnosisAnswers.length === 'medium' && count >= 11 && count <= 20) score += 16
        if (diagnosisAnswers.length === 'long' && count >= 21) score += 16

        if (diagnosisAnswers.pace === 'binge' && /一気|続き|謎|テンポ|伏線/.test(work.note)) score += 12
        if (diagnosisAnswers.pace === 'deep' && /成長|人間|世界観|じっくり|濃密/.test(work.note)) score += 12
        if (diagnosisAnswers.pace === 'easy' && count > 0 && count <= 15) score += 10

        return { ...work, diagnosisScore: score }
      })
      .sort((a, b) => b.diagnosisScore - a.diagnosisScore)
      .slice(0, 3)
  }, [diagnosisAnswers, diagnosisReady])

  const compareWorks = useMemo(
    () => compareTitles.map((title) => completedMangaPicks.find((work) => work.title === title)).filter(Boolean),
    [compareTitles],
  )

  const activeCompletedIntentGuide = pageRoute.kind === 'guide'
    ? completedIntentGuides.find((guide) => guide.slug === pageRoute.guide?.slug)
    : null

  const activeCompletedIntentPicks = useMemo(
    () => activeCompletedIntentGuide
      ? activeCompletedIntentGuide.titles
          .map((title) => completedMangaPicks.find((work) => work.title === title))
          .filter(Boolean)
      : [],
    [activeCompletedIntentGuide],
  )

  const searchSuggestions = useMemo(() => {
    const term = normalizeSearchText(query)
    if (!term) return []

    const pool = [
      ...popularSeries,
      ...completedMangaPicks.map((work) => ({ type: 'manga', title: work.title, author: work.author })),
    ]
    const seen = new Set()
    return pool.filter((work) => {
      const key = seriesKey(work.type, work.title)
      if (seen.has(key)) return false
      seen.add(key)
      const searchable = normalizeSearchText(`${work.title} ${work.author || ''}`)
      const aliases = searchAliases
        .filter(([aliasType,, target]) => aliasType === work.type && target === work.title)
        .map(([, alias]) => normalizeSearchText(alias))
      const fuzzy = term.length >= 3 && editDistance(term, work.title) <= (term.length <= 5 ? 1 : 2)
      return searchable.includes(term) || aliases.some((alias) => alias.includes(term) || term.includes(alias)) || fuzzy
    }).slice(0, 6)
  }, [query])

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

  const personalRecommendations = useMemo(() => {
    const signals = [...recentViews, ...readWorks, ...bookshelfWorks]
    if (!signals.length) return []

    const seen = new Set(signals.map((work) => seriesKey(work.type, work.title)))
    const groupCounts = new Map()

    for (const signal of signals) {
      if (signal.type !== 'manga') continue
      const known = completedMangaPicks.find((work) => seriesKey('manga', work.title) === seriesKey('manga', signal.title))
      const group = completedGenreGroup(known?.category || signal.genre || '')
      groupCounts.set(group, (groupCounts.get(group) || 0) + 1)
    }

    return completedMangaPicks
      .filter((work) => !seen.has(seriesKey('manga', work.title)))
      .map((work, index) => ({
        ...work,
        personalScore: (groupCounts.get(completedGenreGroup(work.category)) || 0) * 18 + Math.max(0, 30 - index * 0.2),
      }))
      .sort((a, b) => b.personalScore - a.personalScore)
      .slice(0, 6)
  }, [recentViews, readWorks, bookshelfWorks])

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

  const sortedFeedReviews = useMemo(
    () => sortReviewRows(sharedReviews, reviewSort),
    [sharedReviews, reviewSort],
  )

  const sortedDetailReviews = useMemo(
    () => sortReviewRows(detailReviews, detailReviewSort),
    [detailReviews, detailReviewSort],
  )

  const detailRecommendations = useMemo(() => {
    if (!detailWork) return []

    if (detailWork.type !== 'manga') {
      return popularSeries
        .filter((work) => work.type === detailWork.type && seriesKey(work.type, work.title) !== detailSeriesKey)
        .slice(0, 6)
    }

    const current = completedMangaPicks.find((work) => seriesKey('manga', work.title) === detailSeriesKey)
    const currentGroup = completedGenreGroup(current?.category || detailWork.genre || '')
    const currentCount = completedVolumeCount(current || {})

    const scored = completedMangaPicks
      .filter((work) => seriesKey('manga', work.title) !== detailSeriesKey)
      .map((work, index) => {
        const sameGroup = completedGenreGroup(work.category) === currentGroup ? 28 : 0
        const count = completedVolumeCount(work)
        const lengthScore = currentCount && count ? Math.max(0, 14 - Math.abs(currentCount - count) * 0.45) : 0
        return { ...work, type: 'manga', genre: work.category, recommendationScore: sameGroup + lengthScore + Math.max(0, 15 - index * 0.08) }
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)

    return scored.slice(0, 6)
  }, [detailWork, detailSeriesKey])

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
        trackEvent('yomipic_share', {
          method: 'native',
          content_type: detailWork.type === 'novel' ? 'novel' : 'manga',
          item_name: seriesTitle(detailWork.title),
        })
        setShareStatus('共有しました')
      } else {
        await navigator.clipboard.writeText(url)
        trackEvent('yomipic_share', {
          method: 'clipboard',
          content_type: detailWork.type === 'novel' ? 'novel' : 'manga',
          item_name: seriesTitle(detailWork.title),
        })
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
    const homeTitle = '漫画おすすめ2026｜3問診断・完結/巻数から30秒で選ぶ｜ヨミピク'
    const homeDescription = '次に読む漫画を30秒で決めたい人へ。3問の漫画診断、人気ランキング、完結漫画、全巻数、ジャンル、最大3作品の比較からおすすめを探せます。'
    const searchLabel = query ? searchPageLabel(query, type) : ''
    const rankingLabel = pageRoute.type === 'novel' ? '小説' : '漫画'
    const rankingDescription = pageRoute.type === 'manga'
      ? '2026年のおすすめ漫画30作品を紹介。オリコンの読者10,564人調査を初期順位の参考にし、ヨミピク内の「読みたい」と感想も反映します。完結・ジャンル別の探し方にも対応。'
      : '小説の人気作品をタイトル単位で紹介。公開ランキング・販売動向を参考にした初期順位へ、ヨミピク内の「読みたい」と感想を反映しています。'
    const themeDescription = pageRoute.kind === 'theme' && pageRoute.topic
      ? `${pageRoute.topic.label}のおすすめ・定番作品を探せます。${pageRoute.topic.description} 感想や「読みたい」数もチェックできます。`
      : ''
    const isCompletedMangaGuide = pageRoute.kind === 'guide' && pageRoute.guide?.type === 'manga' && pageRoute.guide?.slug === 'completed'
    const completedIntentSeo = pageRoute.kind === 'guide'
      ? completedIntentGuides.find((guide) => guide.slug === pageRoute.guide?.slug)
      : null
    const guideDescription = pageRoute.kind === 'guide' && pageRoute.guide
      ? isCompletedMangaGuide
        ? '完結漫画のおすすめランキング100作品を、全巻数つきで紹介。名作、一気読み、短い作品、恋愛・青春など目的別に絞り込み・比較できます。'
        : completedIntentSeo?.metaDescription || `${pageRoute.guide.label}を探す特集ページ。${pageRoute.guide.description} 感想や「読みたい」数も比較できます。`
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
        ? pageRoute.type === 'manga'
          ? '漫画おすすめランキング2026｜人気作品30選・完結/ジャンル別｜ヨミピク'
          : '小説人気ランキング30選｜おすすめ作品・感想｜ヨミピク'
        : pageRoute.kind === 'theme' && pageRoute.topic
          ? `${pageRoute.topic.label}おすすめ・人気作品｜ヨミピク`
          : pageRoute.kind === 'guide' && pageRoute.guide
            ? isCompletedMangaGuide
              ? '完結漫画おすすめランキング100選｜全巻数・ジャンル別【2026年】｜ヨミピク'
              : completedIntentSeo?.seoTitle || `${pageRoute.guide.label}｜おすすめ作品特集｜ヨミピク`
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

  useEffect(() => {
    if (typeof window.gtag !== 'function') return

    const pageLocation = window.location.href
    if (lastTrackedPage.current === pageLocation) return
    lastTrackedPage.current = pageLocation

    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: pageLocation,
      page_path: `${window.location.pathname}${window.location.search}`,
    })
  }, [detailWork, pageRoute, hasSearched, query, type])

  const trackEvent = (name, params = {}) => {
    if (typeof window.gtag !== 'function') return
    window.gtag('event', name, params)
  }

  const toggleCompare = (work) => {
    const title = work?.title
    if (!title) return

    const alreadySelected = compareTitles.includes(title)
    if (!alreadySelected && compareTitles.length >= 3) return

    setCompareShareStatus('')
    setCompareTitles((prev) => alreadySelected
      ? prev.filter((item) => item !== title)
      : [...prev, title]
    )

    trackEvent(alreadySelected ? 'yomipic_compare_remove' : 'yomipic_compare_add', {
      item_name: title,
      compare_count: alreadySelected ? Math.max(0, compareTitles.length - 1) : compareTitles.length + 1,
    })
  }

  const clearComparison = () => {
    setCompareTitles([])
    trackEvent('yomipic_compare_clear')
  }

  const shareComparison = async () => {
    if (compareWorks.length < 2) return
    const titles = compareWorks.map((work) => work.title)
    const params = new URLSearchParams()
    params.set('compare', titles.join('|'))
    const url = `https://yomipic.vercel.app/guide/manga/completed?${params.toString()}#manga-compare`
    const text = `${titles.join(' vs ')}をヨミピクで比較中！ #ヨミピク #漫画比較`

    try {
      if (navigator.share) {
        await navigator.share({ title: 'ヨミピク 漫画比較', text, url })
        setCompareShareStatus('共有しました')
        trackEvent('yomipic_compare_share', { method: 'native', items: titles.join('|') })
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        setCompareShareStatus('比較リンクをコピーしました')
        trackEvent('yomipic_compare_share', { method: 'clipboard', items: titles.join('|') })
      }
    } catch (error) {
      if (error?.name !== 'AbortError') setCompareShareStatus('共有できませんでした')
    }
  }

  const installPwa = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const choice = await installPrompt.userChoice.catch(() => null)
    trackEvent('yomipic_pwa_install_prompt', { outcome: choice?.outcome || 'unknown' })
    if (choice?.outcome === 'accepted') setInstallPrompt(null)
  }

  const shareDiagnosis = async () => {
    if (!diagnosisRecommendations.length) return
    const titles = diagnosisRecommendations.map((work) => work.title)
    const text = `ヨミピクの3問漫画診断で「${titles.join('・')}」がおすすめに出た！ #ヨミピク #漫画診断`
    const url = 'https://yomipic.vercel.app/#manga-diagnosis'

    try {
      if (navigator.share) {
        await navigator.share({ title: 'ヨミピク 3問漫画診断', text, url })
        setDiagnosisShareStatus('共有しました')
        trackEvent('yomipic_diagnosis_share', { method: 'native', picks: titles.join('|') })
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        setDiagnosisShareStatus('診断結果をコピーしました')
        trackEvent('yomipic_diagnosis_share', { method: 'clipboard', picks: titles.join('|') })
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(`${text}\n${url}`)
          setDiagnosisShareStatus('診断結果をコピーしました')
        } catch {
          setDiagnosisShareStatus('共有できませんでした')
        }
      }
    }
  }

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
        trackEvent('yomipic_unsave', {
          content_type: work.type === 'novel' ? 'novel' : 'manga',
          item_name: seriesTitle(work.title),
        })
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
        trackEvent('yomipic_save', {
          content_type: work.type === 'novel' ? 'novel' : 'manga',
          item_name: seriesTitle(work.title),
        })
      }
    } catch (error) {
      setCommunityError(error.message || (isSaved ? '「読みたい」を解除できませんでした' : '「読みたい」を保存できませんでした'))
    } finally {
      setSavingId('')
    }
  }

  const toggleRead = (work) => {
    if (!work?.title) return
    const snapshot = workSnapshot(work)
    const key = seriesKey(snapshot.type, snapshot.title)
    const isRead = readSeriesKeys.has(key)

    setReadWorks((prev) => isRead
      ? prev.filter((item) => seriesKey(item.type, item.title) !== key)
      : [snapshot, ...prev.filter((item) => seriesKey(item.type, item.title) !== key)].slice(0, 200)
    )

    trackEvent(isRead ? 'yomipic_unread' : 'yomipic_read', {
      content_type: snapshot.type,
      item_name: snapshot.title,
    })
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
    setReviewSpoiler(false)
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
          text: reviewSpoiler
            ? `${SPOILER_PREFIX}${reviewText.trim().slice(0, 220)}`
            : reviewText.trim().slice(0, 240),
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '感想を投稿できませんでした')

      if (data.review) setSharedReviews((prev) => [data.review, ...prev])
      trackEvent('yomipic_review', {
        content_type: selected.type === 'novel' ? 'novel' : 'manga',
        item_name: seriesTitle(selected.title),
        rating,
        mood: mood || 'none',
        spoiler: reviewSpoiler,
      })
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
    const resolvedTerm = landing ? term : resolveSearchTerm(term, targetType)

    setSearchHistory((prev) => [
      { term, type: targetType },
      ...prev.filter((item) => !(item.term === term && item.type === targetType)),
    ].slice(0, 6))
    setSearchFocused(false)

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
      const response = await fetch(`/api/books?q=${encodeURIComponent(resolvedTerm)}&type=${targetType}`)
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
      trackEvent('yomipic_search', {
        search_term: term,
        resolved_search_term: resolvedTerm,
        content_type: targetType,
        results_count: uniqueSeries.length,
      })
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
          <a href={rankingHref('manga')} onClick={(event) => navigateRanking(event, 'manga')}>おすすめ漫画</a>
          <a href="/guide/manga/completed">完結漫画</a>
          <a href="/#discover">ジャンルから探す</a>
          <a href="/#bookshelf">本棚</a>
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
        <section className={`hero ${pageRoute.kind === 'home' ? 'home-hero' : ''}`}>
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
              pageRoute.guide.type === 'manga' && pageRoute.guide.slug === 'completed' ? (
                <>
                  <h1>完結漫画おすすめランキング100選<br /><span>名作を最後まで一気読み。</span></h1>
                  <p>完結済み100作品を、巻数・ジャンル・一気読み向けなどから絞り込み。気になる作品は最大3作まで比較できます。</p>
                </>
              ) : (
                <>
                  <h1>{pageRoute.guide.label}<br /><span>今の気分に合う一冊を。</span></h1>
                  <p>{pageRoute.guide.description} 感想や「読みたい」数も見ながら比較できます。</p>
                </>
              )
            ) : (
              <>
                <div className="home-year-badge">2026年版・人気作品を更新</div>
                <h1>次に読む漫画、<br /><span>30秒で決める。</span></h1>
                <p>人気ランキング、完結済み、巻数、ジャンルからすぐ選べる。迷ったら上位作品から、こだわるなら条件から。小説も検索できます。</p>
              </>
            )}

            <div className="search-shell">
              <form className="search-box" onSubmit={searchBooks}>
                <Search size={21} />
                <input
                  id="book-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => window.setTimeout(() => setSearchFocused(false), 140)}
                  placeholder="作品名・作者名を入力すると候補が出ます"
                  aria-label="作品検索"
                  autoComplete="off"
                />
                {query && (
                  <button className="search-clear-button" type="button" onClick={() => setQuery('')} aria-label="検索文字を消す">
                    <X size={15} />
                  </button>
                )}
                <button className="search-submit" type="submit" disabled={liveLoading}>
                  {liveLoading ? <LoaderCircle size={17} className="spin" /> : '検索'}
                </button>
              </form>

              {searchFocused && (searchSuggestions.length > 0 || (!query.trim() && searchHistory.length > 0)) && (
                <div className="search-suggestion-panel">
                  {query.trim() ? (
                    <>
                      <strong>作品候補</strong>
                      {searchSuggestions.map((work) => (
                        <button
                          key={`suggest-${work.type}-${work.title}`}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => searchBooks(null, work.title, work.type)}
                        >
                          <Search size={14} />
                          <span><b>{work.title}</b><small>{work.author || ''} ・ {work.type === 'manga' ? '漫画' : '小説'}</small></span>
                          <ChevronRight size={14} />
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="search-history-head">
                        <strong>最近の検索</strong>
                        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => setSearchHistory([])}>履歴を消す</button>
                      </div>
                      {searchHistory.map((item) => (
                        <button
                          key={`history-${item.type}-${item.term}`}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => searchBooks(null, item.term, item.type)}
                        >
                          <Search size={14} />
                          <span><b>{item.term}</b><small>{item.type === 'manga' ? '漫画' : '小説'}で再検索</small></span>
                          <ChevronRight size={14} />
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="hero-chips">
              {pageRoute.kind === 'home' ? (
                <>
                  <span>すぐ探す:</span>
                  <a href="#manga-diagnosis">✨ 3問診断</a>
                  <a href="/guide/manga/completed">✅ 完結漫画</a>
                  <a href="/guide/manga/short">⏱ 10巻前後・短め</a>
                  <a href="/guide/manga/binge">📚 一気読み</a>
                  <a href="/theme/manga/romance">💕 恋愛</a>
                  <a href="/guide/manga/completed#manga-compare">⚖️ 作品比較</a>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            {pageRoute.kind === 'home' && works.length > 0 && (
              <div className="home-top-preview" aria-label="2026年おすすめ漫画上位3作品">
                <div className="home-top-preview-label">
                  <Flame size={16} />
                  <span>今、まず見る3作品</span>
                </div>
                {works.slice(0, 3).map((work, index) => (
                  <a
                    key={`hero-top-${work.id || work.title}`}
                    href={detailHref(work)}
                    onClick={(event) => { event.preventDefault(); openDetail(work) }}
                  >
                    <b>{index + 1}</b>
                    <Cover work={work} small />
                    <div>
                      <small>{work.genre || '漫画'}</small>
                      <strong>{work.title}</strong>
                    </div>
                    <ChevronRight size={15} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
        </section>

        {pageRoute.kind === 'home' && !hasSearched && (
          <section className="home-choice-hub" aria-labelledby="home-choice-title">
            <div className="home-choice-heading">
              <span>CHOOSE FAST</span>
              <h2 id="home-choice-title">「何を読む？」から探す。</h2>
              <p>人気サイトのように、作品名を知らなくても条件だけで次の漫画にたどり着ける入口をまとめました。</p>
            </div>
            <div className="home-choice-grid">
              <a className="choice-card choice-featured" href="#manga-diagnosis">
                <span>✨ 迷ったらこれ</span><strong>3問で漫画診断</strong><p>気分・長さ・読み方からおすすめ3作品を出します。</p><ChevronRight size={18} />
              </a>
              <a className="choice-card" href="/ranking/manga">
                <span>🏆 王道</span><strong>2026年 人気漫画TOP30</strong><p>まずは人気作から選ぶ。</p><ChevronRight size={18} />
              </a>
              <a className="choice-card" href="/guide/manga/completed">
                <span>✅ 待たずに読める</span><strong>完結漫画100選</strong><p>全巻数つき。最大3作品を比較できます。</p><ChevronRight size={18} />
              </a>
              <a className="choice-card" href="/guide/manga/short">
                <span>⏱ 時間がない</span><strong>短く読める漫画</strong><p>少ない巻数・短編から選ぶ。</p><ChevronRight size={18} />
              </a>
              <a className="choice-card" href="/guide/manga/binge">
                <span>📚 沼りたい</span><strong>一気読みしたい漫画</strong><p>続きが気になる作品をチェック。</p><ChevronRight size={18} />
              </a>
              <a className="choice-card" href="/theme/manga/romance">
                <span>💕 ときめきたい</span><strong>恋愛漫画</strong><p>胸キュン・ラブコメ・青春恋愛。</p><ChevronRight size={18} />
              </a>
            </div>
            <div className="home-trust-row">
              <div><strong>3問</strong><span>漫画おすすめ診断</span></div>
              <div><strong>100</strong><span>完結漫画＋全巻数</span></div>
              <div><strong>3冊</strong><span>同時に作品比較</span></div>
              <div><strong>無料</strong><span>本棚・読書記録</span></div>
            </div>
            {!isInstalled && installPrompt && (
              <button className="pwa-install-card" type="button" onClick={installPwa}>
                <BookOpen size={18} />
                <span><strong>ヨミピクをホーム画面に追加</strong><small>アプリのようにすぐ開けます。無料・インストール不要のWebアプリです。</small></span>
                <ChevronRight size={18} />
              </button>
            )}
          </section>
        )}

        {pageRoute.kind === 'home' && !hasSearched && (
          <section className="home-diagnosis" id="manga-diagnosis" aria-labelledby="diagnosis-title">
            <div className="diagnosis-head">
              <div>
                <span className="section-kicker">3 QUESTIONS</span>
                <h2 id="diagnosis-title">3問で、次に読む漫画を決める。</h2>
                <p>ヨミピクの完結漫画100作品から、今の気分に合う3作品を選びます。答えはいつでも変更できます。</p>
              </div>
              {diagnosisReady && (
                <button type="button" onClick={() => {
                  setDiagnosisAnswers({ mood: '', length: '', pace: '' })
                  setCompareTitles([])
                }}>やり直す</button>
              )}
            </div>

            <div className="diagnosis-questions">
              <fieldset>
                <legend><b>Q1</b><span>今どんな気分？</span></legend>
                <div>
                  {[
                    ['hot', '🔥 熱くなりたい'],
                    ['emotional', '😭 心を動かされたい'],
                    ['romance', '💕 キュンとしたい'],
                    ['mystery', '🧠 謎・伏線を楽しみたい'],
                  ].map(([value, label]) => (
                    <button key={value} type="button" className={diagnosisAnswers.mood === value ? 'active' : ''} onClick={() => setDiagnosisAnswers((prev) => ({ ...prev, mood: value }))}>{label}</button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend><b>Q2</b><span>どのくらいの長さ？</span></legend>
                <div>
                  {[
                    ['short', '⚡ 10巻以内'],
                    ['medium', '📚 11〜20巻'],
                    ['long', '🌙 21巻以上でもOK'],
                  ].map(([value, label]) => (
                    <button key={value} type="button" className={diagnosisAnswers.length === value ? 'active' : ''} onClick={() => setDiagnosisAnswers((prev) => ({ ...prev, length: value }))}>{label}</button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend><b>Q3</b><span>どう読みたい？</span></legend>
                <div>
                  {[
                    ['binge', '🚀 一気読みしたい'],
                    ['deep', '☕ じっくり浸りたい'],
                    ['easy', '🌿 気軽に読みたい'],
                  ].map(([value, label]) => (
                    <button key={value} type="button" className={diagnosisAnswers.pace === value ? 'active' : ''} onClick={() => setDiagnosisAnswers((prev) => ({ ...prev, pace: value }))}>{label}</button>
                  ))}
                </div>
              </fieldset>
            </div>

            {!diagnosisReady ? (
              <div className="diagnosis-waiting">
                <Sparkles size={20} />
                <span>3つ答えると、おすすめ3作品がここに出ます。</span>
              </div>
            ) : (
              <div className="diagnosis-results">
                <div className="diagnosis-result-title">
                  <div>
                    <span>YOUR PICKS</span>
                    <h3>今のあなたに、この3作品。</h3>
                    <p>気になる2〜3作品を「比較に追加」すると、そのまま違いを見比べられます。</p>
                  </div>
                  <div className="diagnosis-share-wrap">
                    <button type="button" onClick={shareDiagnosis}><Share2 size={14} /> 診断結果を共有</button>
                    {diagnosisShareStatus && <small>{diagnosisShareStatus}</small>}
                  </div>
                </div>
                <div className="diagnosis-result-grid">
                  {diagnosisRecommendations.map((work, index) => {
                    const comparing = compareTitles.includes(work.title)
                    return (
                      <article key={work.title}>
                        <b>{index + 1}</b>
                        <small>{work.category} ・ {work.volumes}</small>
                        <h4>{work.title}</h4>
                        <span>{work.author}</span>
                        <p>{work.note}</p>
                        <div>
                          <a href={seriesHref({ type: 'manga', title: work.title })}>作品を見る <ChevronRight size={14} /></a>
                          <button
                            type="button"
                            className={comparing ? 'selected' : ''}
                            disabled={!comparing && compareTitles.length >= 3}
                            onClick={() => toggleCompare(work)}
                          >{comparing ? '比較から外す' : '比較に追加'}</button>
                        </div>
                      </article>
                    )
                  })}
                </div>
                <MangaComparison works={compareWorks} onRemove={toggleCompare} onClear={clearComparison} onShare={shareComparison} shareStatus={compareShareStatus} />
              </div>
            )}
          </section>
        )}

        {pageRoute.kind === 'home' && !hasSearched && personalRecommendations.length > 0 && (
          <section className="personal-home-section" id="for-you">
            <div className="section-top">
              <div>
                <span className="section-kicker">FOR YOU</span>
                <h2>あなた向けの次の漫画。</h2>
                <p>「読みたい」「読んだ」「最近見た」の傾向から、この端末だけでおすすめを選んでいます。</p>
              </div>
            </div>
            <div className="personal-home-grid">
              {personalRecommendations.map((work) => (
                <a key={work.title} href={seriesHref({ type: 'manga', title: work.title })}>
                  <span>{work.category}</span>
                  <strong>{work.title}</strong>
                  <small>{work.author} ・ {work.volumes}</small>
                  <p>{work.note}</p>
                  <ChevronRight size={16} />
                </a>
              ))}
            </div>
          </section>
        )}

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
                <h2>{pageRoute.kind === 'guide' && pageRoute.guide?.slug === 'completed' && pageRoute.guide?.type === 'manga' ? 'まず読みたい完結漫画8作品' : `${searchPageLabel(query, type)}を探す`}</h2>
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
                      read={readSeriesKeys.has(seriesKey(work.type, work.title))}
                      saving={savingId === seriesKey(work.type, work.title)}
                      saveCount={seriesStatsMap.get(seriesKey(work.type, work.title))?.saves || 0}
                      reviewCount={seriesStatsMap.get(seriesKey(work.type, work.title))?.reviews || 0}
                      onSave={saveWork}
                      onRead={toggleRead}
                      onReview={openReview}
                      onOpen={openDetail}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="search-zero-state">
                <div className="search-status">
                  <Search size={28} />
                  <h3>「{query}」では見つかりませんでした</h3>
                  <p>表記を短くするか、作者名だけでも試せます。迷ったら人気作品から探してみてください。</p>
                  <button type="button" onClick={() => {
                    setQuery('')
                    setSearchFocused(true)
                    setTimeout(() => document.getElementById('book-search')?.focus(), 20)
                  }}>検索し直す</button>
                </div>
                <div className="zero-recommendations">
                  <strong>代わりに人気作品を見る</strong>
                  <div>
                    {popularSeries.filter((work) => work.type === type).slice(0, 6).map((work) => (
                      <a key={`zero-${work.type}-${work.title}`} href={seriesHref(work)}>
                        <span>{work.title}</span>
                        <small>{work.author}</small>
                        <ChevronRight size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {pageRoute.kind === 'theme' && pageRoute.topic && (
              <div className="theme-explainer">
                <h3>{pageRoute.topic.label}を探すときのポイント</h3>
                <p>{pageRoute.topic.description} ヨミピクでは、作品名だけでなく感想や「読みたい」数も一緒に見られるので、次に読む候補を比較しやすくしています。</p>
              </div>
            )}

            {pageRoute.kind === 'guide' && pageRoute.guide && (
              <div className="theme-explainer">
                <h3>{pageRoute.guide.type === 'manga' && pageRoute.guide.slug === 'completed' ? '完結漫画を選ぶポイント' : `${pageRoute.guide.label}の選び方`}</h3>
                <p>{pageRoute.guide.type === 'manga' && pageRoute.guide.slug === 'completed'
                  ? '完結漫画なら最終話まで待たずに読めるため、休日の一気読みや長編への挑戦にも向いています。短く読み切りたいなら10巻前後、じっくり浸りたいなら20巻以上を目安に、好きなジャンルから選ぶのがおすすめです。'
                  : `${pageRoute.guide.description} ここでは定番作品を中心に並べ、シリーズ単位の感想や「読みたい」数も一緒に比較できます。`}</p>
              </div>
            )}

            {activeCompletedIntentGuide && activeCompletedIntentPicks.length > 0 && (
              <section className="completed-intent-landing" aria-labelledby="completed-intent-title">
                <div className="completed-intent-head">
                  <span className="section-kicker">COMPLETED PICKS</span>
                  <h2 id="completed-intent-title">{activeCompletedIntentGuide.label}</h2>
                  <p>{activeCompletedIntentGuide.description}</p>
                  <div className="completed-intent-links">
                    <a href="/guide/manga/completed">完結漫画100選をすべて見る</a>
                    {completedIntentGuides.filter((guide) => guide.slug !== activeCompletedIntentGuide.slug).map((guide) => (
                      <a key={guide.slug} href={guideHref(guide)}>{guide.emoji} {guide.label}</a>
                    ))}
                  </div>
                </div>
                <div className="completed-intent-grid">
                  {activeCompletedIntentPicks.map((work, index) => {
                    const comparing = compareTitles.includes(work.title)
                    return (
                      <article key={work.title} className={`completed-intent-card ${comparing ? 'comparing' : ''}`}>
                        <b>{index + 1}</b>
                        <small>{work.category} ・ {work.volumes}</small>
                        <h3>{work.title}</h3>
                        <span>{work.author}</span>
                        <p>{work.note}</p>
                        <div>
                          <a href={seriesHref({ type: 'manga', title: work.title })}>作品を見る <ChevronRight size={14} /></a>
                          <button type="button" className={comparing ? 'selected' : ''} disabled={!comparing && compareTitles.length >= 3} onClick={() => toggleCompare(work)}>
                            {comparing ? '比較中 ✓' : '比較に追加'}
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
                <MangaComparison works={compareWorks} onRemove={toggleCompare} onClear={clearComparison} onShare={shareComparison} shareStatus={compareShareStatus} />
              </section>
            )}

            {pageRoute.kind === 'guide' && pageRoute.guide?.type === 'manga' && pageRoute.guide?.slug === 'completed' && (
              <section className="completed-guide-section" aria-labelledby="completed-30-title">
                <div className="completed-guide-head">
                  <span className="section-kicker">COMPLETE MANGA 100</span>
                  <h2 id="completed-30-title">完結漫画おすすめランキング100選</h2>
                  <p>完結済みの名作・人気作をジャンル横断で100作品紹介します。巻数・ジャンル・並び順で絞り込み、最大3作品まで比較できます。</p>
                  <p className="completed-volume-basis">巻数は原則として通常コミックス版を基準にしています。新装版・愛蔵版・文庫版などは巻数が異なる場合があります。</p>
                </div>
                <div className="completed-filter-bar" aria-label="完結漫画の絞り込み">
                  <label>
                    <span>巻数</span>
                    <select value={completedVolumeFilter} onChange={(event) => setCompletedVolumeFilter(event.target.value)}>
                      <option value="all">すべて</option>
                      <option value="short">10巻以内</option>
                      <option value="medium">11〜20巻</option>
                      <option value="long">21巻以上</option>
                    </select>
                  </label>
                  <label>
                    <span>ジャンル</span>
                    <select value={completedGenreFilter} onChange={(event) => setCompletedGenreFilter(event.target.value)}>
                      <option value="all">すべて</option>
                      <option value="action">バトル・冒険</option>
                      <option value="sports">スポーツ</option>
                      <option value="romance">恋愛・青春</option>
                      <option value="mystery">ミステリー・SF</option>
                      <option value="other">その他</option>
                    </select>
                  </label>
                  <label>
                    <span>並び順</span>
                    <select value={completedSort} onChange={(event) => setCompletedSort(event.target.value)}>
                      <option value="rank">おすすめ順</option>
                      <option value="short">巻数が少ない順</option>
                      <option value="long">巻数が多い順</option>
                    </select>
                  </label>
                  <strong>{filteredCompletedMangaPicks.length}作品</strong>
                  {(completedVolumeFilter !== 'all' || completedGenreFilter !== 'all' || completedSort !== 'rank') && (
                    <button type="button" onClick={() => { setCompletedVolumeFilter('all'); setCompletedGenreFilter('all'); setCompletedSort('rank') }}>絞り込みを解除</button>
                  )}
                </div>
                <div className="completed-pick-grid">
                  {filteredCompletedMangaPicks.map((work) => {
                    const comparing = compareTitles.includes(work.title)
                    return (
                      <article key={work.title} className={`completed-pick-card ${comparing ? 'comparing' : ''}`}>
                        <span className="completed-pick-rank">{completedMangaPicks.findIndex((item) => item.title === work.title) + 1}</span>
                        <a className="completed-pick-main" href={seriesHref({ type: 'manga', title: work.title })}>
                          <div>
                            <div className="completed-pick-meta">
                              <small>{work.category}</small>
                              <b>{work.volumes}</b>
                            </div>
                            <strong>{work.title}</strong>
                            <span>{work.author}</span>
                            <p>{work.note}</p>
                            {work.volumeNote && <em className="completed-volume-detail">※ {work.volumeNote}</em>}
                          </div>
                        </a>
                        <div className="completed-pick-controls">
                          <button
                            type="button"
                            className={comparing ? 'selected' : ''}
                            disabled={!comparing && compareTitles.length >= 3}
                            onClick={() => toggleCompare(work)}
                          >{comparing ? '比較中 ✓' : '比較'}</button>
                          <a href={seriesHref({ type: 'manga', title: work.title })} aria-label={`${work.title}を見る`}><ChevronRight size={17} /></a>
                        </div>
                      </article>
                    )
                  })}
                </div>
                <MangaComparison works={compareWorks} onRemove={toggleCompare} onClear={clearComparison} onShare={shareComparison} shareStatus={compareShareStatus} />
                <section className="completed-purpose-section" aria-labelledby="completed-purpose-title">
                  <h3 id="completed-purpose-title">目的別に完結漫画を探す</h3>
                  <div className="completed-purpose-grid">
                    {completedMangaGroups.map((group) => (
                      <article key={group.title}>
                        <h4>{group.title}</h4>
                        <p>{group.description}</p>
                        <div>
                          {group.titles.map((title) => (
                            <a key={title} href={seriesHref({ type: 'manga', title })}>{title}</a>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="completed-faq" aria-labelledby="completed-faq-title">
                  <h3 id="completed-faq-title">完結漫画選びのよくある疑問</h3>
                  <details>
                    <summary>完結漫画でまず読むなら、どんな作品がおすすめ？</summary>
                    <p>王道から選ぶなら『鋼の錬金術師』（全27巻）、『進撃の巨人』（全34巻）、『SLAM DUNK』（通常コミックス全31巻）、『ハイキュー!!』（全45巻）などから探すと選びやすいです。</p>
                  </details>
                  <details>
                    <summary>一気読みしやすい完結漫画は？</summary>
                    <p>謎や続きが気になる作品なら『DEATH NOTE』（全12巻）、『約束のネバーランド』（全20巻）、『僕だけがいない街』（全9巻・9巻は外伝）、『サマータイムレンダ』（全13巻）などが候補です。</p>
                  </details>
                  <details>
                    <summary>比較的短く読み切りやすい完結漫画は？</summary>
                    <p>長編を避けたいときは『彼方のアストラ』（全5巻）、『聲の形』（全7巻）、『チ。―地球の運動について―』（全8巻）、『僕だけがいない街』（全9巻・9巻は外伝）など、比較的コンパクトな作品から探すのがおすすめです。</p>
                  </details>
                </section>

                <div className="completed-guide-links">
                  <strong>ジャンルから完結漫画を探す</strong>
                  <a href="/theme/manga/fantasy">✨ ファンタジー漫画</a>
                  <a href="/theme/manga/sports">🏐 スポーツ漫画</a>
                  <a href="/theme/manga/romance">💕 恋愛漫画</a>
                  <a href="/theme/manga/mystery">🔎 ミステリー漫画</a>
                  <a href="/ranking/manga">🏆 漫画人気ランキング30選</a>
                  <a href="/guide/manga/completed-short">⚡ 10巻以内</a>
                  <a href="/guide/manga/completed-masterpiece">🏆 名作完結漫画</a>
                  <a href="/guide/manga/completed-binge">📚 一気読み完結漫画</a>
                  <a href="/guide/manga/completed-romance">💕 恋愛完結漫画</a>
                </div>
              </section>
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
              <h2>{type === 'manga' ? '2026年 おすすめ漫画ランキング' : '小説人気ランキング'}</h2>
              <p>{rankingIsEmpty
                ? 'ランキングを準備しています。'
                : type === 'manga'
                  ? '読者10,564人の2026年オリコン調査を初期順位の参考に、ヨミピク内の「読みたい」と感想を加えて並べています。'
                  : '公開ランキング・販売動向を参考にした初期順位へ、ヨミピク内の「読みたい」と感想を反映します。'}</p>
              <div className="ranking-sources">
                参考：
                {type === 'manga' ? (
                  <>
                    <a href="https://life.oricon.co.jp/rank-manga-apps/special/column/comic-ranking/" target="_blank" rel="noreferrer">オリコン 2026おすすめ漫画調査</a>
                    <span>・</span><span>ヨミピク内の反応</span>
                  </>
                ) : (
                  <>
                    <a href="https://booklive.jp/feature/index/id/firsthalf" target="_blank" rel="noreferrer">BookLive 2026年上半期</a>
                    <span>・</span>
                    <a href="https://www.oricon.co.jp/special/73240/" target="_blank" rel="noreferrer">ORICON 2025年間本ランキング</a>
                  </>
                )}
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
                    <div className="work-meta">{work.seeded ? (work.type === 'manga' ? '2026人気候補 ・ ' : '定番候補 ・ ') : ''}{work.genre}</div>
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
                      <button
                        className={`read-button compact ${readSeriesKeys.has(seriesKey(work.type, work.title)) ? 'read' : ''}`}
                        onClick={() => toggleRead(work)}
                      >
                        <BookOpen size={16} />
                        <span>{readSeriesKeys.has(seriesKey(work.type, work.title)) ? '読んだ ✓' : '読んだ'}</span>
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
            {type === 'manga' && (
              <a className="ranking-completed-link" href="/guide/manga/completed">
                <span>✅ 完結作品から選びたい人へ</span>
                <strong>完結漫画おすすめランキング100選を見る</strong>
                <ChevronRight size={18} />
              </a>
            )}
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
                      <button className={`bookshelf-read-button ${readSeriesKeys.has(seriesKey(work.type, work.title)) ? 'read' : ''}`} onClick={() => toggleRead(work)}>
                        <BookOpen size={14} /> {readSeriesKeys.has(seriesKey(work.type, work.title)) ? '読んだ ✓' : '読んだ'}
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

        <section className="content-section read-library-section" id="read-library">
          <div className="section-top">
            <div>
              <span className="section-kicker">READ</span>
              <h2>読んだ作品</h2>
              <p>読み終えた漫画・小説をこの端末に記録できます。作品ページの「読んだ」から追加・解除できます。</p>
            </div>
            <div className="bookshelf-count"><BookOpen size={17} /> {readWorks.length}作品</div>
          </div>
          {readWorks.length ? (
            <div className="read-library-grid">
              {readWorks.map((work) => (
                <article className="read-library-card" key={seriesKey(work.type, work.title)}>
                  <a href={seriesHref(work)} onClick={(event) => { event.preventDefault(); openDetail(work) }} className="read-library-cover">
                    <Cover work={work} small />
                  </a>
                  <div>
                    <small>{work.type === 'manga' ? '漫画' : '小説'}</small>
                    <a href={seriesHref(work)} onClick={(event) => { event.preventDefault(); openDetail(work) }}><strong>{work.title}</strong></a>
                    <span>{work.author || '著者情報なし'}</span>
                  </div>
                  <button type="button" onClick={() => toggleRead(work)}>解除</button>
                </article>
              ))}
            </div>
          ) : (
            <div className="bookshelf-empty compact-empty">
              <BookOpen size={28} />
              <h3>まだ「読んだ」作品がありません</h3>
              <p>作品詳細の「読んだ」を押すと、ここに読書記録として残せます。</p>
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

        <section className="content-section popular-series-section" id="popular-series">
          <div className="section-top">
            <div>
              <span className="section-kicker">POPULAR SERIES</span>
              <h2>人気作品から探す。</h2>
              <p>ランキングで注目されている漫画・小説を、作品タイトル単位のページからチェックできます。</p>
            </div>
          </div>
          <div className="popular-series-grid">
            {popularSeries.map((work) => (
              <a key={`popular-${work.type}-${work.title}`} href={seriesHref(work)}>
                <span>{work.type === 'manga' ? '漫画' : '小説'}</span>
                <strong>{work.title}</strong>
                <small>{work.author}</small>
                <ChevronRight size={17} />
              </a>
            ))}
          </div>
        </section>

        {recentViews.length > 0 && (
          <section className="content-section recent-section" id="recent">
            <div className="section-top">
              <div>
                <span className="section-kicker">RECENT</span>
                <h2>最近見た作品</h2>
                <p>さっき気になった作品へすぐ戻れます。この履歴はこの端末だけに保存されます。</p>
              </div>
              <button className="recent-clear" type="button" onClick={() => setRecentViews([])}>履歴を消す</button>
            </div>
            <div className="recent-view-grid">
              {recentViews.map((work) => (
                <a
                  key={seriesKey(work.type, work.title)}
                  href={seriesHref(work)}
                  onClick={(event) => { event.preventDefault(); openDetail(work) }}
                >
                  <Cover work={work} small />
                  <div>
                    <small>{work.type === 'manga' ? '漫画' : '小説'}</small>
                    <strong>{work.title}</strong>
                    <span>{work.author || '著者情報なし'}</span>
                  </div>
                  <ChevronRight size={16} />
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="content-section review-section" id="reviews">
          <div className="section-top">
            <div>
              <span className="section-kicker">REVIEWS</span>
              <h2>みんなのひとこと感想</h2>
              <p>長文じゃなくてもOK。投稿された感想は、すべてのヨミピク利用者に共有されます。</p>
            </div>
            <label className="review-sort-control">
              <span>並び替え</span>
              <select value={reviewSort} onChange={(event) => setReviewSort(event.target.value)}>
                <option value="new">新着順</option>
                <option value="high">高評価順</option>
                <option value="low">低評価順</option>
                <option value="no-spoiler">ネタバレなし</option>
              </select>
            </label>
          </div>

          {communityError && (
            <div className="community-note">{communityError}</div>
          )}

          <div className="review-feed">
            {sortedFeedReviews.length > 0 ? sortedFeedReviews.slice(0, 8).map((review) => {
              const work = rowWork(review)
              return (
                <article className="review-card" key={review.id}>
                  <div className="review-user"><span>Y</span><div><strong>ヨミピク読者</strong><small>{new Date(review.created_at).toLocaleDateString('ja-JP')}</small></div></div>
                  <div className="review-work"><Cover work={work} small /><div><small>{work.genre}</small><strong>{work.title}</strong></div></div>
                  <div className="review-score"><Stars score={review.rating} /> {review.mood && <span>{review.mood}</span>}</div>
                  <ReviewBody body={review.body} />
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

      {compareWorks.length > 0 && (
        <div className="compare-floating-tray" role="status" aria-live="polite">
          <div>
            <strong>{compareWorks.length}/3作品を比較中</strong>
            <span>{compareWorks.map((work) => work.title).join('・')}</span>
          </div>
          <a href="#manga-compare" onClick={() => setTimeout(() => document.getElementById('manga-compare')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 10)}>
            比較を見る <ChevronRight size={15} />
          </a>
          <button type="button" onClick={clearComparison} aria-label="比較をすべて解除"><X size={15} /></button>
        </div>
      )}

      <nav className="mobile-bottom-nav" aria-label="スマホメニュー">
        <a href="/"><BookOpen size={19} /><span>ホーム</span></a>
        <button type="button" onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          setTimeout(() => document.getElementById('book-search')?.focus(), 250)
        }}><Search size={19} /><span>検索</span></button>
        <a href="/#ranking"><Trophy size={19} /><span>ランキング</span></a>
        <a href="/#bookshelf"><BookmarkCheck size={19} /><span>本棚</span></a>
      </nav>

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
                  <button
                    className={`read-button detail-read-button ${readSeriesKeys.has(detailSeriesKey) ? 'read' : ''}`}
                    onClick={() => toggleRead(detailWork)}
                  >
                    <BookOpen size={17} />
                    <span>{readSeriesKeys.has(detailSeriesKey) ? '読んだ ✓' : '読んだ'}</span>
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
                <div className="detail-review-tools">
                  <select value={detailReviewSort} onChange={(event) => setDetailReviewSort(event.target.value)} aria-label="感想の並び順">
                    <option value="new">新着順</option>
                    <option value="high">高評価順</option>
                    <option value="low">低評価順</option>
                    <option value="no-spoiler">ネタバレなし</option>
                  </select>
                  <button onClick={() => openReview(detailWork)}><PenLine size={16} /> 感想を書く</button>
                </div>
              </div>

              {sortedDetailReviews.length ? (
                <div className="detail-review-list">
                  {sortedDetailReviews.map((review) => (
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
                      <ReviewBody body={review.body} />
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

            <section className="detail-related-section">
              <div className="detail-section-head">
                <div>
                  <span className="section-kicker">NEXT READ</span>
                  <h2>{detailWork.type === 'manga' ? 'この漫画が好きなら、次はこれ。' : 'この小説の次に読むなら。'}</h2>
                  <p>{detailWork.type === 'manga' ? 'ジャンルと巻数の近さから、次に読みやすい作品を選んでいます。' : '人気作品から次の候補を紹介します。'}</p>
                </div>
              </div>
              <div className="detail-related-links">
                {detailRecommendations.map((work) => (
                  <a key={`detail-related-${work.type || detailWork.type}-${work.title}`} href={seriesHref({ type: work.type || detailWork.type, title: work.title })}>
                    <span>{work.genre || work.category || (detailWork.type === 'manga' ? '漫画' : '小説')}</span>
                    <strong>{work.title}</strong>
                    <small>{work.author}{work.volumes ? ` ・ ${work.volumes}` : ''}</small>
                    <ChevronRight size={16} />
                  </a>
                ))}
              </div>
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

              <label className="spoiler-toggle">
                <input type="checkbox" checked={reviewSpoiler} onChange={(event) => setReviewSpoiler(event.target.checked)} />
                <span><strong>ネタバレを含む</strong><small>ONにすると、他の人には本文を隠して表示します。</small></span>
              </label>

              <label htmlFor="reviewText">ひとこと感想</label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="読んだ直後の気持ちを気軽に書いてみよう"
                maxLength={reviewSpoiler ? 220 : 240}
                required
              />
              <div className="form-bottom"><span>{reviewText.length}/{reviewSpoiler ? 220 : 240}</span><button type="submit" disabled={postingReview}>{postingReview ? '投稿中…' : 'みんなに投稿する'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
