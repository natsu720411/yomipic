import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

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
