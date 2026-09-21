import { useMemo, useState } from 'react'
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
} from 'lucide-react'

const seedWorks = [
  {
    id: 1,
    type: 'manga',
    title: '放課後、君と青い空',
    author: '水野ひかり',
    genre: '青春・恋愛',
    score: 4.7,
    reviews: 128,
    saves: 942,
    rank: 1,
    trend: 18,
    accent: 'linear-gradient(145deg,#7c3aed,#ec4899)',
    tagline: '夕焼けの教室から始まる、少し不器用な青春。',
  },
  {
    id: 2,
    type: 'manga',
    title: '境界線のランナー',
    author: '高瀬ユウ',
    genre: 'スポーツ',
    score: 4.6,
    reviews: 94,
    saves: 721,
    rank: 2,
    trend: 31,
    accent: 'linear-gradient(145deg,#0ea5e9,#14b8a6)',
    tagline: '負けたくない理由を、走りながら見つけていく。',
  },
  {
    id: 3,
    type: 'manga',
    title: '深夜0時の図書室',
    author: '佐倉まお',
    genre: 'ミステリー',
    score: 4.5,
    reviews: 83,
    saves: 665,
    rank: 3,
    trend: 47,
    accent: 'linear-gradient(145deg,#312e81,#6366f1)',
    tagline: '閉館後だけ開く、不思議な図書室の秘密。',
  },
  {
    id: 4,
    type: 'manga',
    title: 'となりの魔法使い',
    author: '南しずく',
    genre: 'ファンタジー',
    score: 4.4,
    reviews: 61,
    saves: 508,
    rank: 4,
    trend: 12,
    accent: 'linear-gradient(145deg,#059669,#84cc16)',
    tagline: '普通の大学生活に、魔法がひとつ混ざったら。',
  },
  {
    id: 5,
    type: 'novel',
    title: '君が忘れた夏の名前',
    author: '朝倉 澪',
    genre: '青春小説',
    score: 4.8,
    reviews: 156,
    saves: 1102,
    rank: 1,
    trend: 26,
    accent: 'linear-gradient(145deg,#0284c7,#f59e0b)',
    tagline: '思い出せない約束を追う、ひと夏の物語。',
  },
  {
    id: 6,
    type: 'novel',
    title: '透明な夜に手紙を書く',
    author: '白石 遥',
    genre: '恋愛小説',
    score: 4.7,
    reviews: 131,
    saves: 980,
    rank: 2,
    trend: 39,
    accent: 'linear-gradient(145deg,#4338ca,#a855f7)',
    tagline: '届かないはずの手紙から始まる静かな恋。',
  },
  {
    id: 7,
    type: 'novel',
    title: '珈琲店ノクターンの事件簿',
    author: '久遠 理人',
    genre: 'ミステリー',
    score: 4.5,
    reviews: 77,
    saves: 604,
    rank: 3,
    trend: 52,
    accent: 'linear-gradient(145deg,#78350f,#d97706)',
    tagline: '一杯の珈琲と、小さな謎を解く夜。',
  },
  {
    id: 8,
    type: 'novel',
    title: '星降る駅で待っている',
    author: '伊月かなえ',
    genre: 'ファンタジー',
    score: 4.4,
    reviews: 69,
    saves: 577,
    rank: 4,
    trend: 21,
    accent: 'linear-gradient(145deg,#1e3a8a,#8b5cf6)',
    tagline: '終電のあとにだけ現れる駅をめぐる物語。',
  },
]

const moods = ['😭 泣ける', '😂 笑える', '💕 キュン', '🔥 熱い', '🤯 衝撃', '📖 一気読み']

function Cover({ work, small = false }) {
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
  return (
    <span className="score">
      <Star size={15} fill="currentColor" />
      {score.toFixed(1)}
    </span>
  )
}

export default function App() {
  const [type, setType] = useState('manga')
  const [sort, setSort] = useState('weekly')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(() => new Set())
  const [selected, setSelected] = useState(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [mood, setMood] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [postedReviews, setPostedReviews] = useState([])

  const works = useMemo(() => {
    let list = seedWorks.filter((work) => work.type === type)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((work) =>
        [work.title, work.author, work.genre].some((value) => value.toLowerCase().includes(q)),
      )
    }
    if (sort === 'rising') return [...list].sort((a, b) => b.trend - a.trend)
    if (sort === 'rated') return [...list].sort((a, b) => b.score - a.score)
    return [...list].sort((a, b) => a.rank - b.rank)
  }, [type, sort, query])

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

  const submitReview = (event) => {
    event.preventDefault()
    if (!selected || !reviewText.trim()) return
    setPostedReviews((prev) => [
      {
        id: Date.now(),
        workId: selected.id,
        rating,
        mood,
        text: reviewText.trim(),
      },
      ...prev,
    ])
    setReviewOpen(false)
    setReviewText('')
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

        <button className="header-action" onClick={() => openReview(works[0] || seedWorks[0])}>
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

            <div className="search-box">
              <Search size={21} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="作品名・作者名・ジャンルから探す"
                aria-label="作品検索"
              />
              <kbd>検索</kbd>
            </div>

            <div className="hero-chips">
              <span>人気:</span>
              <button onClick={() => setQuery('恋愛')}>恋愛</button>
              <button onClick={() => setQuery('ミステリー')}>ミステリー</button>
              <button onClick={() => setQuery('青春')}>青春</button>
              <button onClick={() => setQuery('ファンタジー')}>ファンタジー</button>
            </div>
          </div>

          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
        </section>

        <section className="content-section" id="ranking">
          <div className="section-top">
            <div>
              <span className="section-kicker">RANKING</span>
              <h2>いま読まれている作品</h2>
              <p>ヨミピク内の反応をもとにしたサンプルランキングです。</p>
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

          {works.length ? (
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
                      <span><MessageCircle size={14} /> {work.reviews + postedReviews.filter((r) => r.workId === work.id).length}</span>
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
          ) : (
            <div className="empty-state">
              <Search size={28} />
              <h3>該当する作品がありません</h3>
              <p>検索語を変えてもう一度試してみてください。</p>
              <button onClick={() => setQuery('')}>検索をリセット</button>
            </div>
          )}
        </section>

        <section className="discover-section" id="discover">
          <div className="discover-copy">
            <span className="section-kicker">DISCOVER</span>
            <h2>気分から、次の作品を探そう。</h2>
            <p>ランキングだけでは見つからない一冊へ。今の気分を選ぶだけで作品探しをもっと気軽に。</p>
          </div>
          <div className="mood-grid">
            {moods.map((item) => (
              <button key={item} onClick={() => setQuery('')}>{item}<ChevronRight size={17} /></button>
            ))}
          </div>
        </section>

        <section className="content-section review-section" id="reviews">
          <div className="section-top">
            <div>
              <span className="section-kicker">REVIEWS</span>
              <h2>みんなのひとこと感想</h2>
              <p>長文じゃなくてもOK。読んだ直後の気持ちを残せます。</p>
            </div>
          </div>

          <div className="review-feed">
            {postedReviews.length > 0 ? postedReviews.slice(0, 4).map((review) => {
              const work = seedWorks.find((item) => item.id === review.workId)
              return (
                <article className="review-card" key={review.id}>
                  <div className="review-user"><span>Y</span><div><strong>あなた</strong><small>たった今</small></div></div>
                  <div className="review-work"><Cover work={work} small /><div><small>{work.genre}</small><strong>{work.title}</strong></div></div>
                  <div className="review-score"><Stars score={review.rating} /> {review.mood && <span>{review.mood}</span>}</div>
                  <p>{review.text}</p>
                </article>
              )
            }) : (
              <>
                <article className="review-card">
                  <div className="review-user"><span>M</span><div><strong>mio</strong><small>12分前</small></div></div>
                  <div className="review-work"><Cover work={seedWorks[0]} small /><div><small>{seedWorks[0].genre}</small><strong>{seedWorks[0].title}</strong></div></div>
                  <div className="review-score"><Stars score={5} /><span>💕 キュン</span></div>
                  <p>会話のテンポが好き。放課後の空気感がすごくリアルで、一気に読んだ。</p>
                </article>
                <article className="review-card">
                  <div className="review-user"><span>K</span><div><strong>kei</strong><small>31分前</small></div></div>
                  <div className="review-work"><Cover work={seedWorks[6]} small /><div><small>{seedWorks[6].genre}</small><strong>{seedWorks[6].title}</strong></div></div>
                  <div className="review-score"><Stars score={4} /><span>🤯 衝撃</span></div>
                  <p>短い章ごとに謎がほどけていく感じが気持ちいい。寝る前に少しずつ読むのにも良さそう。</p>
                </article>
              </>
            )}
          </div>
        </section>

        <section className="cta-section">
          <div>
            <span className="section-kicker light">YOUR BOOKSHELF</span>
            <h2>あなたの「好き」を、本棚に。</h2>
            <p>読みたい作品や読んだ作品を集めて、自分だけの本棚をつくろう。</p>
          </div>
          <button onClick={() => toggleSaved(seedWorks[0].id)}>読みたい作品を追加する <ChevronRight size={18} /></button>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-icon"><BookOpen size={19} /></span><span>ヨミピク</span></a>
        <p>漫画・小説のランキングと感想を楽しむ読書コミュニティ。</p>
        <small>© 2026 YomiPic. 掲載中の作品データは初期デモ用の架空データです。</small>
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
              <div className="form-bottom"><span>{reviewText.length}/240</span><button type="submit">感想を投稿する</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
