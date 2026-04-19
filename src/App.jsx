import { useState } from 'react'
import { themes } from './themes/index.js'
import LandingPage from './pages/LandingPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

function ThemeSwitcher({ current, onChange, page, onPageChange }) {
  const theme = themes[current]
  const pt = theme.landing

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-4 py-3"
      style={{
        transform: 'translateX(-50%)',
        borderRadius: '4px',
        border: `1px solid ${pt.border}`,
        background: `${pt.card}F0`,
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div
        className="flex items-center text-xs font-mono"
        style={{ color: pt.textSecondary, fontFamily: 'JetBrains Mono, monospace' }}
      >
        PAGE:
      </div>
      {['landing', 'dashboard'].map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className="px-3 py-1 text-xs font-mono btn-press"
          style={{
            borderRadius: '2px',
            border: `1px solid ${page === p ? pt.petroleum : pt.border}`,
            background: page === p ? pt.petroleum : 'transparent',
            color: page === p ? '#000' : pt.textSecondary,
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace',
            transition: `all 200ms ${theme.ease}`,
          }}
        >
          {p}
        </button>
      ))}

      <div className="w-px h-6 mx-1" style={{ background: pt.border }} />

      <div
        className="flex items-center text-xs font-mono"
        style={{ color: pt.textSecondary, fontFamily: 'JetBrains Mono, monospace' }}
      >
        SCHEME:
      </div>
      {Object.values(themes).map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs btn-press"
          style={{
            borderRadius: '2px',
            border: `1px solid ${current === t.id ? pt.petroleum : pt.border}`,
            background: current === t.id ? pt.petroleum : 'transparent',
            color: current === t.id ? '#000' : pt.textSecondary,
            cursor: 'pointer',
            transition: `all 200ms ${theme.ease}`,
          }}
        >
          <span className="font-mono font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {t.id}
          </span>
          <span className="hidden lg:inline text-xs">{t.name}</span>
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const [themeId, setThemeId] = useState('B')
  const [page, setPage] = useState('landing')

  const theme = themes[themeId]

  return (
    <div style={{ paddingBottom: '80px' }}>
      {page === 'landing' ? (
        <LandingPage theme={theme} t={theme} onNavigate={setPage} />
      ) : (
        <DashboardPage theme={theme} t={theme} onNavigate={setPage} />
      )}
      <ThemeSwitcher
        current={themeId}
        onChange={setThemeId}
        page={page}
        onPageChange={setPage}
      />
    </div>
  )
}
