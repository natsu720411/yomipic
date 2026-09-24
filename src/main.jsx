import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import LegalPage from './LegalPage'
import './styles.css'
import './enhancements.css'

const root = document.getElementById('root')
const legalPaths = new Set(['/privacy', '/terms', '/contact'])

function currentPath() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

function syncRouteMode() {
  const path = currentPath()
  document.body.dataset.yomipicRoute = path.startsWith('/ranking/')
    ? 'ranking'
    : legalPaths.has(path)
      ? 'legal'
      : 'home'
}

function enhanceFooterAndReviews() {
  const footer = document.querySelector('.footer-links')
  if (footer && !footer.querySelector('[data-yomipic-legal-link]')) {
    const links = [
      ['/privacy', 'プライバシー'],
      ['/terms', '利用規約'],
      ['/contact', 'お問い合わせ・通報'],
    ]

    for (const [href, label] of links) {
      const a = document.createElement('a')
      a.href = href
      a.textContent = label
      a.dataset.yomipicLegalLink = 'true'
      footer.appendChild(a)
    }
  }

  const ranking = document.querySelector('#ranking')
  const grid = ranking?.querySelector('.ranking-grid')
  const oldMore = ranking?.querySelector('.ranking-more-link')

  if (document.body.dataset.yomipicRoute === 'ranking') {
    oldMore?.remove()
  } else if (grid && !oldMore) {
    const active = ranking.querySelector('.type-switch .active')?.textContent?.trim()
    const isNovel = active === '小説'
    const link = document.createElement('a')
    link.className = 'ranking-more-link'
    link.href = isNovel ? '/ranking/novel' : '/ranking/manga'
    link.textContent = `${isNovel ? '小説' : '漫画'}ランキングを30位まで見る →`
    grid.insertAdjacentElement('afterend', link)
  }

  document.querySelectorAll('.review-card, .detail-review-item').forEach((card) => {
    if (card.querySelector('.report-review-link')) return

    const detailTitle = document.querySelector('.detail-main h1')?.textContent?.trim()
    const feedTitle = card.querySelector('.review-work strong')?.textContent?.trim()
    const workTitle = feedTitle || detailTitle || '作品'
    const excerpt = card.querySelector('p')?.textContent?.trim().slice(0, 80) || ''
    const target = `${workTitle}${excerpt ? `：${excerpt}` : ''}`

    const link = document.createElement('a')
    link.className = 'report-review-link'
    link.href = `/contact?report=${encodeURIComponent(target)}`
    link.textContent = 'この感想を通報'
    card.appendChild(link)
  })
}

syncRouteMode()

if (!window.__yomipicHistoryEnhanced) {
  window.__yomipicHistoryEnhanced = true
  for (const method of ['pushState', 'replaceState']) {
    const original = history[method].bind(history)
    history[method] = (...args) => {
      const result = original(...args)
      syncRouteMode()
      requestAnimationFrame(enhanceFooterAndReviews)
      return result
    }
  }
  window.addEventListener('popstate', () => {
    syncRouteMode()
    requestAnimationFrame(enhanceFooterAndReviews)
  })
}

root.replaceChildren()
const isLegal = legalPaths.has(currentPath())

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    {isLegal ? <LegalPage /> : <App />}
  </React.StrictMode>,
)

const observer = new MutationObserver(() => enhanceFooterAndReviews())
observer.observe(root, { childList: true, subtree: true })
requestAnimationFrame(enhanceFooterAndReviews)
