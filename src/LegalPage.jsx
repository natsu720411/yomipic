import { useEffect } from 'react'
import { BookOpen, ChevronRight, ExternalLink, ShieldCheck } from 'lucide-react'

const pages = {
  '/privacy': {
    title: 'プライバシーポリシー',
    description: 'ヨミピクにおけるアクセス解析、投稿データ、外部サービスの取り扱いについて説明します。',
  },
  '/terms': {
    title: '利用規約',
    description: 'ヨミピクを利用する際のルールと、投稿コンテンツの取り扱いについて説明します。',
  },
  '/contact': {
    title: 'お問い合わせ・通報',
    description: 'ヨミピクへのお問い合わせ、掲載内容や投稿の通報方法について案内します。',
  },
}

function Meta({ path, page }) {
  useEffect(() => {
    const origin = 'https://yomipic.vercel.app'
    const title = `${page.title}｜ヨミピク`
    document.title = title

    const setMeta = (selector, value) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', value)
    }

    setMeta('meta[name="description"]', page.description)
    setMeta('meta[name="robots"]', 'noindex,follow')
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', page.description)
    setMeta('meta[property="og:url"]', `${origin}${path}`)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', page.description)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${origin}${path}`

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: `${window.location.pathname}${window.location.search}`,
      })
    }
  }, [path, page])

  return null
}

function Privacy() {
  return (
    <>
      <p className="legal-lead">ヨミピクは、漫画・小説を探し、感想や「読みたい」を共有できる読書コミュニティです。サービス改善に必要な範囲でデータを取り扱います。</p>

      <section>
        <h2>1. 取得する情報</h2>
        <p>アクセス日時、閲覧ページ、端末・ブラウザに関する情報、検索やボタン操作などの利用状況を取得することがあります。また、利用者が投稿した感想・評価・「読みたい」情報と、同じブラウザを識別するためのランダムな端末IDを保存します。</p>
      </section>

      <section>
        <h2>2. Google Analytics</h2>
        <p>利用状況の把握とサイト改善のため、Google Analytics 4を利用しています。Google AnalyticsではCookie等を利用してアクセス情報が収集される場合があります。ヨミピクでは、氏名・住所・電話番号などをAnalyticsへ意図的に送信しません。</p>
        <a className="legal-inline-link" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Googleのプライバシーポリシー <ExternalLink size={14} /></a>
      </section>

      <section>
        <h2>3. 投稿データ</h2>
        <p>感想や評価は公開情報としてサイト上に表示されます。氏名、住所、電話番号、メールアドレス、学校名など、本人や第三者を特定できる情報は投稿しないでください。自分の感想は、同じブラウザ・端末から削除できる場合があります。</p>
      </section>

      <section>
        <h2>4. 利用している外部サービス</h2>
        <p>ヨミピクは、Google Books（書籍情報）、Google Analytics（アクセス解析）、Supabase（投稿・保存データ）、Vercel（サイト配信）等を利用しています。各サービスでの情報の取り扱いは、それぞれの提供元の規約・プライバシーポリシーにも従います。</p>
      </section>

      <section>
        <h2>5. 利用目的</h2>
        <p>サービス提供、ランキングや感想機能の運営、不正利用の防止、利用状況の分析、表示・検索機能の改善、問い合わせや通報への対応のために利用します。</p>
      </section>

      <section>
        <h2>6. 改定</h2>
        <p>機能や利用サービスの変更に応じて、本ポリシーを変更することがあります。重要な変更がある場合は、サイト上で分かる形で案内します。</p>
      </section>
    </>
  )
}

function Terms() {
  return (
    <>
      <p className="legal-lead">ヨミピクを利用することで、以下の内容に同意したものとします。安心して作品探しや感想共有を楽しめる場を目指します。</p>

      <section>
        <h2>1. サービスについて</h2>
        <p>ヨミピクは、漫画・小説の検索、ランキング、感想、評価、「読みたい」保存などを提供します。書籍情報の一部は外部サービスから取得しており、内容の完全性や最新性を保証するものではありません。</p>
      </section>

      <section>
        <h2>2. 投稿について</h2>
        <p>投稿者は、自分が投稿する文章について必要な権利を有しているものとします。投稿された感想は、ヨミピク内で表示・ランキング集計・サービス改善のために利用できます。著作権そのものをヨミピクへ譲渡するものではありません。</p>
      </section>

      <section>
        <h2>3. 禁止事項</h2>
        <ul>
          <li>他人への誹謗中傷、差別、脅迫、嫌がらせ</li>
          <li>個人情報や秘密情報の投稿</li>
          <li>著作物の長文転載は禁止転載や、権利を侵害する投稿</li>
          <li>スパム、宣伝のみを目的とする投稿、不正な自動アクセス</li>
          <li>サービスや他の利用者へ不利益を与える行為</li>
        </ul>
      </section>

      <section>
        <h2>4. 投稿の削除・表示制限</h2>
        <p>上記に違反する投稿、権利侵害のおそれがある投稿、運営上不適切と判断した投稿は、予告なく削除・非表示等の対応を行うことがあります。</p>
      </section>

      <section>
        <h2>5. 免責</h2>
        <p>ランキングや感想は、外部情報や利用者の反応をもとにした参考情報です。作品購入等の判断は利用者自身で行ってください。外部リンク先で生じた損害について、ヨミピクは責任を負いません。</p>
      </section>

      <section>
        <h2>6. サービスの変更</h2>
        <p>機能の追加・変更・停止を行うことがあります。本規約も必要に応じて改定します。</p>
      </section>
    </>
  )
}

function Contact() {
  const params = new URLSearchParams(window.location.search)
  const report = String(params.get('report') || '').slice(0, 180)
  const title = report ? '【通報】ヨミピク掲載内容について' : '【問い合わせ】ヨミピクについて'
  const body = report
    ? `通報対象：${report}\n\n通報理由：\n\n※氏名・住所・電話番号などの個人情報は書かないでください。`
    : 'お問い合わせ内容：\n\n※氏名・住所・電話番号などの個人情報は書かないでください。'
  const issueUrl = `https://github.com/natsu720411/yomipic/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`

  const trackContact = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', report ? 'yomipic_report_click' : 'yomipic_contact_click', {
        contact_method: 'github_issue',
      })
    }
  }

  return (
    <>
      <p className="legal-lead">サイトへのご意見、不具合、掲載内容や感想の通報を受け付けています。</p>

      {report && (
        <div className="report-target">
          <ShieldCheck size={20} />
          <div><strong>通報対象</strong><p>{report}</p></div>
        </div>
      )}

      <section>
        <h2>お問い合わせ方法</h2>
        <p>現在はGitHub Issuesを窓口として利用しています。リンク先は公開ページのため、氏名・住所・電話番号・メールアドレスなどの個人情報や、公開したくない情報は入力しないでください。</p>
        <a className="legal-primary-button" href={issueUrl} target="_blank" rel="noreferrer" onClick={trackContact}>
          {report ? 'この内容を通報する' : 'お問い合わせを作成する'} <ExternalLink size={16} />
        </a>
      </section>

      <section>
        <h2>通報の対象例</h2>
        <p>誹謗中傷、個人情報の掲載、著作権侵害のおそれがある投稿、スパム、不適切な内容などを確認した場合にご連絡ください。内容を確認し、必要に応じて削除・表示制限等を行います。</p>
      </section>

      <section>
        <h2>非公開情報について</h2>
        <p>現在の問い合わせ窓口は公開方式です。個人情報を含む個別対応が必要な場合は、公開Issueへ詳細を書き込まず、非公開窓口の整備後にご利用ください。</p>
      </section>
    </>
  )
}

export default function LegalPage() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/privacy'
  const page = pages[path] || pages['/privacy']

  return (
    <div className="legal-shell">
      <Meta path={path} page={page} />
      <header className="legal-header">
        <a className="legal-brand" href="/"><span><BookOpen size={19} /></span>ヨミピク</a>
        <nav>
          <a href="/privacy">プライバシー</a>
          <a href="/terms">利用規約</a>
          <a href="/contact">お問い合わせ・通報</a>
        </nav>
      </header>

      <main className="legal-main">
        <a className="legal-back" href="/">ヨミピクに戻る <ChevronRight size={15} /></a>
        <span className="legal-kicker">YOMIPIC POLICY</span>
        <h1>{page.title}</h1>
        {path === '/privacy' ? <Privacy /> : path === '/terms' ? <Terms /> : <Contact />}
        <p className="legal-updated">最終更新：2026年9月24日</p>
      </main>

      <footer className="legal-footer">
        <a href="/">ヨミピク</a>
        <div><a href="/privacy">プライバシーポリシー</a><a href="/terms">利用規約</a><a href="/contact">お問い合わせ・通報</a></div>
      </footer>
    </div>
  )
}
