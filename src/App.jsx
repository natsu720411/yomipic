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
} from 'lucide-react'

const seedWorks = [
  { id: 1, type: 'manga', title: '放課後、君と青い空', author: '水野ひかり', genre: '青春・恋愛', score: 4.7, reviews: 128, saves: 942, rank: 1, trend: 18, accent: 'linear-gradient(145deg,#7c3aed,#ec4899)', tagline: '夕焼けの教室から始まる、少し不器用な青春。' },
  { id: 2, type: 'manga', title: '境界線のランナー', author: '高瀬ユウ', genre: 'スポーツ', score: 4.6, reviews: 94, saves: 721, rank: 2, trend: 31, accent: 'linear-gradient(145deg,#0ea5e9,#14b8a6)', tagline: '負けたくない理由を、走りながら見つけていく。' },
  { id: 3, type: 'manga', title: '深夜0時の図書室', author: '佐倉まお', genre: 'ミステリー', score: 4.5, reviews: 83, saves: 665, rank: 3, trend: 47, accent: 'linear-gradient(145deg,#312e81,#6366f1)', tagline: '閉館後だけ開く、不思議な図書室の秘密。' },
  { id: 4, type: 'manga', title: 'となりの魔法使い', author: '南しずく', genre: 'ファンタジー', score: 4.4, reviews: 61, saves: 508, rank: 4, trend: 12, accent: 'linear-gradient(145deg,#059669,#84cc16)', tagline: '普通の大学生活に、魔法がひとつ混ざったら。' },
  { id: 5, type: 'novel', title: '君が忘れた夏の名前', author: '朝倉 澪', genre: '青春小説', score: 4.8, reviews: 156, saves: 1102, rank: 1, trend: 26, accent: 'linear-gradient(145deg,#0284c7,#f59e0b)', tagline: '思い出せない約束を追う、ひと夏の物語。' },
  { id: 6, type: 'novel', title: '透明な夜に手紙を書く', author: '白石 遥', genre: '恋愛小説', score: 4.7, reviews: 131, saves: 980, rank: 2, trend: 39, accent: 'linear-gradient(145deg,#4338ca,#a855f7)', tagline: '届かないはずの手紙から始まる静かな恋。' },
  { id: 7, type: 'novel', title: '珈琲店ノクターンの事件簿', author: '久遠 理人', genre: 'ミステリー', score: 4.5, reviews: 77, saves: 604, rank: 3, trend: 52, accent: 'linear-gradient(145deg,#78350f,#d97706)', tagline: '一杯の珈琲と、小さな謎を解く夜。' },
  { id: 8, type: 'novel', title: '星降る駅で待っている', author: '伊月かなえ', genre: 'ファンタジー', score: 4.4, reviews: 69, saves: 577, rank: 4, trend: 21, accent: 'linear-gradient(145deg,#1e3a8a,#8b5cf6)', tagline: '終電のあとにだけ現れる駅をめぐる物語。' },
]

const moods = ['😭 泣ける', '😂 笑える', '💕 キュン', '🔥 熱い', '🤯 衝撃', '📖 一気読み']

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

function reviewWork(review) {
  const [type = 'book', id = review.work_id] = String(review.work_id || '').split('::')
  return {
    id,
    type,
    title: review.title,
    author: review.author || '',
    genre: review.genre || (type === 'manga' ? '漫画' : '小説'),
    image: review.image_url || '',
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
    <div className={`cover ${small ? 'cover-small' : ''}`} style={{ background: work.accent }}>
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

function ResultCard({ work, saved, onSave, onReview }) {
  return (
    <article className="work-card real-work-card">
      <Cover work={work} />
      <div className="work-body">
        <div className="work-meta">{work.genre || '書籍'}</div>
        <h3>{work.title}</h3>
        <p className="author">{work.author || '著者情報なし'}</p>
        <div className="metrics result-metrics">
          <Stars score={work.score} />
          {work.ratingsCount ? <span><MessageCircle size={14} /> {work.ratingsCount}</span> : null}
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
            className={`save-button ${saved ? 'saved' : ''}`}
            onClick={() => onSave(work.id)}
            aria-label={saved ? '読みたいから外す' : '読みたいに追加'}
          >
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
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
  const [reviewOpen, setReviewOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [mood, setMood] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [sharedReviews, setSharedReviews] = useState([])
  const [communityError, setCommunityError] = useState('')
  const [postingReview, setPostingReview] = useState(false)
  const [deviceId] = useState(() => getDeviceId())
  const [liveResults, setLiveResults] = useState([])
  const [liveLoading, setLiveLoading] = useState(false)
  const [liveError, setLiveError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    localStorage.setItem('yomipic-saved', JSON.stringify([...saved]))
  }, [saved])

  useEffect(() => {
    let active = true

    fetch('/api/community?kind=reviews')
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || '感想を取得できませんでした')
        if (active) setSharedReviews(data.reviews || [])
      })
      .catch((error) => {
        if (active) setCommunityError(error.message || '感想を取得できませんでした')
      })

    return () => { active = false }
  }, [])

  const works = useMemo(() => {
    let list = seedWorks.filter((work) => work.type === type)
    if (sort === 'rising') return [...list].sort((a, b) => b.trend - a.trend)
    if (sort === 'rated') return [...list].sort((a, b) => b.score - a.score)
    return [...list].sort((a, b) => a.rank - b.rank)
  }, [type, sort])

  const toggleSaved = (id) => {
    setSaved((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const openReview = (work) => {
    setSelected(work)
    setReviewOpen(true)
    setRating(5)
    setMood('')
    setReviewText('')
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

  const searchBooks = async (event, forcedQuery) => {
    event?.preventDefault()
    const term = (forcedQuery ?? query).trim()
    if (!term) return

    if (forcedQuery !== undefined) setQuery(forcedQuery)
    setHasSearched(true)
    setLiveLoading(true)
    setLiveError('')

    try {
      const response = await fetch(`/api/books?q=${encodeURIComponent(term)}&type=${type}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '検索に失敗しました')
      setLiveResults(data.items || [])
      setTimeout(() => document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30)
    } catch (error) {
      setLiveResults([])
      setLiveError(error.message || '検索に失敗しました')
    } finally {
      setLiveLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ヨミピク トップ">
          <span className="brand-icon"><BookOpen size={21} /></span>
          <span>ヨミピク</span>
        </a>

        <nav className="desktop-nav" aria-label="メインメニュー">
          <a href="#ranking">ランキング</a>
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
                <span className="section-kicker">REAL BOOK SEARCH</span>
                <h2>「{query}」の検索結果</h2>
                <p>Google Booksの書籍データから検索しています。</p>
              </div>
              <div className="type-switch" role="tablist" aria-label="検索する作品タイプ">
                <button className={type === 'manga' ? 'active' : ''} onClick={() => setType('manga')}>漫画</button>
                <button className={type === 'novel' ? 'active' : ''} onClick={() => setType('novel')}>小説</button>
              </div>
            </div>

            {liveLoading ? (
              <div className="search-status"><LoaderCircle size={28} className="spin" /><p>作品を探しています…</p></div>
            ) : liveError ? (
              <div className="search-status error-status">
                <Search size={26} />
                <h3>実作品検索を使う準備があと1つ必要です</h3>
                <p>{liveError}</p>
              </div>
            ) : liveResults.length ? (
              <div className="ranking-grid">
                {liveResults.map((work) => (
                  <ResultCard key={work.id} work={work} saved={saved.has(work.id)} onSave={toggleSaved} onReview={openReview} />
                ))}
              </div>
            ) : (
              <div className="search-status"><Search size={28} /><h3>作品が見つかりませんでした</h3><p>タイトルや作者名を変えて検索してみてください。</p></div>
            )}
          </section>
        )}

        <section className="content-section" id="ranking">
          <div className="section-top">
            <div>
              <span className="section-kicker">RANKING</span>
              <h2>いま読まれている作品</h2>
              <p>ここは独自ランキング機能のデザイン確認用サンプルです。次の段階で実データ化します。</p>
            </div>

            <div className="type-switch" role="tablist" aria-label="作品タイプ">
              <button className={type === 'manga' ? 'active' : ''} onClick={() => setType('manga')}>漫画</button>
              <button className={type === 'novel' ? 'active' : ''} onClick={() => setType('novel')}>小説</button>
            </div>
          </div>

          <div className="sort-tabs">
            <button className={sort === 'weekly' ? 'active' : ''} onClick={() => setSort('weekly')}>
              <Flame size={16} /> 今週人気
            </button>
            <button className={sort === 'rising' ? 'active' : ''} onClick={() => setSort('rising')}>
              <TrendingUp size={16} /> 急上昇
            </button>
            <button className={sort === 'rated' ? 'active' : ''} onClick={() => setSort('rated')}>
              <Star size={16} /> 高評価
            </button>
          </div>

          <div className="ranking-grid">
            {works.map((work, index) => (
              <article className="work-card" key={work.id}>
                <div className={`rank-badge rank-${index + 1}`}>
                  {index < 3 ? <Trophy size={13} /> : null}
                  {index + 1}
                </div>
                <Cover work={work} />
                <div className="work-body">
                  <div className="work-meta">{work.genre}</div>
                  <h3>{work.title}</h3>
                  <p className="author">{work.author}</p>
                  <p className="tagline">{work.tagline}</p>
                  <div className="metrics">
                    <Stars score={work.score} />
                    <span><MessageCircle size={14} /> {work.reviews}</span>
                    <span><Bookmark size={14} /> {work.saves + (saved.has(work.id) ? 1 : 0)}</span>
                  </div>
                  <div className="card-actions">
                    <button className="ghost-button" onClick={() => openReview(work)}>
                      <PenLine size={16} /> 感想
                    </button>
                    <button
                      className={`save-button ${saved.has(work.id) ? 'saved' : ''}`}
                      onClick={() => toggleSaved(work.id)}
                      aria-label={saved.has(work.id) ? '読みたいから外す' : '読みたいに追加'}
                    >
                      {saved.has(work.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="discover-section" id="discover">
          <div className="discover-copy">
            <span className="section-kicker">DISCOVER</span>
            <h2>気分から、次の作品を探そう。</h2>
            <p>ランキングだけでは見つからない一冊へ。気分に近い言葉で実作品を検索できます。</p>
          </div>
          <div className="mood-grid">
            {moods.map((item) => {
              const word = item.replace(/^\S+\s/, '')
              return <button key={item} onClick={() => searchBooks(null, word)}>{item}<ChevronRight size={17} /></button>
            })}
          </div>
        </section>

        <section className="content-section review-section" id="reviews">
          <div className="section-top">
            <div>
              <span className="section-kicker">REVIEWS</span>
              <h2>みんなのひとこと感想</h2>
              <p>長文じゃなくてもOK。あなたが投稿した感想はこの端末に保存されます。</p>
            </div>
          </div>

          {communityError && (
            <div className="community-note">{communityError}</div>
          )}

          <div className="review-feed">
            {sharedReviews.length > 0 ? sharedReviews.slice(0, 8).map((review) => {
              const work = reviewWork(review)
              return (
                <article className="review-card" key={review.id}>
                  <div className="review-user"><span>Y</span><div><strong>ヨミピク読者</strong><small>{new Date(review.created_at).toLocaleDateString('ja-JP')}</small></div></div>
                  <div className="review-work"><Cover work={work} small /><div><small>{work.genre}</small><strong>{work.title}</strong></div></div>
                  <div className="review-score"><Stars score={review.rating} /> {review.mood && <span>{review.mood}</span>}</div>
                  <p>{review.body}</p>
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
            <span className="section-kicker light">YOUR BOOKSHELF</span>
            <h2>あなたの「好き」を、本棚に。</h2>
            <p>「読みたい」はこの端末に保存されるので、ページを閉じても残ります。</p>
          </div>
          <a href="#search-results">作品を探す <ChevronRight size={18} /></a>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-icon"><BookOpen size={19} /></span><span>ヨミピク</span></a>
        <p>漫画・小説のランキングと感想を楽しむ読書コミュニティ。</p>
        <small>© 2026 YomiPic. ランキング部分の作品は現在UI確認用の架空データです。実作品検索にはGoogle Booksを利用します。</small>
      </footer>

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
