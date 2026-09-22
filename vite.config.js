import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const seriesPages = [
  ['manga', 'キングダム', '原泰久'],
  ['manga', '葬送のフリーレン', '山田鐘人'],
  ['manga', 'ONE PIECE', '尾田栄一郎'],
  ['manga', 'メダリスト', 'つるまいかだ'],
  ['manga', 'ブルーロック', '金城宗幸'],
  ['manga', '呪術廻戦', '芥見下々'],
  ['manga', '薫る花は凛と咲く', '三香見サカ'],
  ['manga', 'SPY×FAMILY', '遠藤達哉'],
  ['manga', '薬屋のひとりごと', '日向夏'],
  ['manga', 'ダンダダン', '龍幸伸'],
  ['novel', 'プロジェクト・ヘイル・メアリー', 'アンディ・ウィアー'],
  ['novel', '変な地図', '雨穴'],
  ['novel', 'わたしの幸せな結婚', '顎木あくみ'],
  ['novel', '成瀬は都を駆け抜ける', '宮島未奈'],
  ['novel', '爆弾', '呉勝浩'],
  ['novel', '国宝', '吉田修一'],
  ['novel', 'カフネ', '阿部暁子'],
  ['novel', '方舟', '夕木春央'],
  ['novel', '十角館の殺人', '綾辻行人'],
  ['novel', '三体', '劉慈欣'],
].map(([type, title, author]) => ({
  path: `series/${type}/${title}`,
  title: `${title}の感想・評価｜ヨミピク`,
  description: `${title}${author ? `（${author}）` : ''}の感想・評価をチェック。巻ごとの反応を作品タイトル単位にまとめ、レビューや「読みたい」数から次に読む作品を探せます。`,
}))

const seoPages = [
  {
    path: 'ranking/manga',
    title: '漫画人気ランキング｜おすすめ作品・感想｜ヨミピク',
    description: '漫画の人気作品をタイトル単位で紹介。公開ランキング・販売動向を参考にした初期順位へ、ヨミピク内の「読みたい」と感想を反映しています。',
  },
  {
    path: 'ranking/novel',
    title: '小説人気ランキング｜おすすめ作品・感想｜ヨミピク',
    description: '小説の人気作品をタイトル単位で紹介。公開ランキング・販売動向を参考にした初期順位へ、ヨミピク内の「読みたい」と感想を反映しています。',
  },
  { path: 'theme/manga/romance', title: '恋愛漫画おすすめ・人気作品｜ヨミピク', description: '胸キュンから大人の恋まで、定番の恋愛漫画を中心に紹介。感想や「読みたい」数も見ながら次に読む作品を探せます。' },
  { path: 'theme/manga/youth', title: '青春漫画おすすめ・人気作品｜ヨミピク', description: '学校、友情、部活、成長を描く青春漫画の定番作品を紹介。感想や「読みたい」数も確認できます。' },
  { path: 'theme/manga/fantasy', title: 'ファンタジー漫画おすすめ・人気作品｜ヨミピク', description: '冒険や魔法、異世界など世界観を楽しめるファンタジー漫画の定番作品を紹介します。' },
  { path: 'theme/manga/mystery', title: 'ミステリー漫画おすすめ・人気作品｜ヨミピク', description: '謎解き、事件、サスペンスを楽しめるミステリー漫画の人気・定番作品を紹介します。' },
  { path: 'theme/manga/emotional', title: '泣ける漫画おすすめ・感動作品｜ヨミピク', description: '家族、友情、別れ、成長を描いた心に残る泣ける漫画・感動漫画を探せます。' },
  { path: 'theme/manga/isekai', title: '異世界漫画おすすめ・人気作品｜ヨミピク', description: '転生・召喚・異世界冒険など、人気の異世界漫画・定番作品を中心に紹介します。' },
  { path: 'theme/manga/sports', title: 'スポーツ漫画おすすめ・人気作品｜ヨミピク', description: 'バレー、サッカー、バスケなど、熱いスポーツ漫画の人気・定番作品を紹介します。' },
  { path: 'theme/manga/horror', title: 'ホラー漫画おすすめ・人気作品｜ヨミピク', description: '怪異、都市伝説、心理ホラーなど、怖くて続きが気になるホラー漫画を探せます。' },
  { path: 'theme/novel/romance', title: '恋愛小説おすすめ・人気作品｜ヨミピク', description: '切ない恋から温かな恋愛まで、読み継がれる恋愛小説の人気・定番作品を紹介します。' },
  { path: 'theme/novel/youth', title: '青春小説おすすめ・人気作品｜ヨミピク', description: '学生生活、友情、成長を描いた青春小説の人気・定番作品を紹介します。' },
  { path: 'theme/novel/mystery', title: 'ミステリー小説おすすめ・人気作品｜ヨミピク', description: '本格推理からサスペンスまで、人気のミステリー小説・定番作品を紹介します。' },
  { path: 'theme/novel/fantasy', title: 'ファンタジー小説おすすめ・人気作品｜ヨミピク', description: '壮大な世界観や不思議な物語を楽しめるファンタジー小説の人気・定番作品を紹介します。' },
  { path: 'theme/novel/emotional', title: '泣ける小説おすすめ・感動作品｜ヨミピク', description: '読後に余韻が残る、感動や人とのつながりを描いた泣ける小説を探せます。' },
  { path: 'theme/novel/sf', title: 'SF小説おすすめ・人気作品｜ヨミピク', description: '宇宙、未来、科学をテーマにした国内外の人気SF小説・定番作品を紹介します。' },
  { path: 'theme/novel/horror', title: 'ホラー小説おすすめ・人気作品｜ヨミピク', description: '怪談、心理恐怖、異常な日常を描く人気ホラー小説・定番作品を紹介します。' },
  { path: 'theme/novel/historical', title: '歴史小説おすすめ・人気作品｜ヨミピク', description: '戦国・幕末など歴史の人物や時代を描いた人気の歴史小説・定番作品を紹介します。' },
  { path: 'guide/manga/completed', title: '完結漫画おすすめ｜最後まで読める人気作品｜ヨミピク', description: '最後までまとめて読める、完結済みの定番漫画を中心に紹介。感想や「読みたい」数も見ながら選べます。' },
  { path: 'guide/manga/binge', title: '一気読みしたい漫画おすすめ｜ヨミピク', description: '続きが気になって止まりにくい、テンポよく読み進めやすい漫画を中心に紹介します。' },
  { path: 'guide/manga/college', title: '大学生におすすめの漫画｜ヨミピク', description: '進路、人間関係、挑戦や成長など、大学生にも刺さりやすいテーマの漫画を紹介します。' },
  { path: 'guide/manga/short', title: '短く読める漫画おすすめ｜少ない巻数・短編作品｜ヨミピク', description: '少ない巻数や短編で読み切りやすく、初めてでも手に取りやすい漫画を紹介します。' },
  { path: 'guide/novel/bedtime', title: '寝る前に読みたい小説おすすめ｜ヨミピク', description: '寝る前の静かな時間に読みやすい、やさしい余韻や落ち着いた物語の小説を紹介します。' },
  { path: 'guide/novel/binge', title: '一気読みしたい小説おすすめ｜ヨミピク', description: '展開が気になり、ページをめくる手が止まりにくい小説を中心に紹介します。' },
  { path: 'guide/novel/college', title: '大学生におすすめの小説｜ヨミピク', description: '青春、将来、人間関係、自分らしさなど、大学生が共感しやすい小説を紹介します。' },
  { path: 'guide/novel/short', title: '短く読める小説おすすめ｜短編・読みやすい作品｜ヨミピク', description: '短編集や比較的コンパクトな作品を中心に、すきま時間でも楽しみやすい小説を紹介します。' },
  ...seriesPages,
]

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function staticSeoPages() {
  return {
    name: 'yomipic-static-seo-pages',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve('dist')
      const indexPath = path.join(dist, 'index.html')
      if (!fs.existsSync(indexPath)) return

      const baseHtml = fs.readFileSync(indexPath, 'utf8')

      for (const page of seoPages) {
        const url = `https://yomipic.vercel.app/${page.path}`
        let html = baseHtml
          .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(page.title)}</title>`)
          .replace(/<meta\s+name="description"[\s\S]*?\/>/i, `<meta name="description" content="${escapeHtml(page.description)}" />`)
          .replace(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(page.title)}" />`)
          .replace(/<meta\s+property="og:description"[\s\S]*?>/i, `<meta property="og:description" content="${escapeHtml(page.description)}" />`)
          .replace(/<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${url}" />`)
          .replace(/<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`)
          .replace(/<meta\s+name="twitter:description"[\s\S]*?>/i, `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`)

        html = html.replace(
          '</head>',
          `    <link rel="canonical" href="${url}" />\n    <script type="application/ld+json">${JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: page.title,
            description: page.description,
            url,
            isPartOf: {
              '@type': 'WebSite',
              name: 'ヨミピク',
              url: 'https://yomipic.vercel.app/',
            },
          }).replaceAll('<', '\\u003c')}</script>\n  </head>`
        )

        const fallbackTitle = page.title.replace(/｜ヨミピク$/, '')
        const fallback = `
          <main style="max-width:900px;margin:0 auto;padding:64px 24px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#211b2a">
            <p style="margin:0 0 10px;color:#7c3aed;font-weight:800;font-size:13px">ヨミピク</p>
            <h1 style="margin:0 0 18px;font-size:clamp(32px,6vw,54px);line-height:1.2">${escapeHtml(fallbackTitle)}</h1>
            <p style="margin:0;max-width:760px;color:#6f6878;line-height:1.9;font-size:15px">${escapeHtml(page.description)}</p>
            <nav style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap">
              <a href="/" style="color:#7c3aed;font-weight:700">ヨミピクトップ</a>
              <a href="/ranking/manga" style="color:#7c3aed;font-weight:700">漫画ランキング</a>
              <a href="/ranking/novel" style="color:#7c3aed;font-weight:700">小説ランキング</a>
            </nav>
          </main>`
        html = html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`)

        const outputDir = path.join(dist, page.path)
        fs.mkdirSync(outputDir, { recursive: true })
        fs.writeFileSync(path.join(outputDir, 'index.html'), html)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), staticSeoPages()],
})
