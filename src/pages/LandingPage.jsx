import { useState, useEffect, useRef } from 'react'
import { ArrowRight, GitBranch, Zap, Shield, BarChart3, ChevronRight } from 'lucide-react'

// ─── Scheme A: dotted grid background ──────────────────────────────
function GridBg({ color }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle, ${color}55 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
        zIndex: 0,
      }}
    />
  )
}

// ─── Scheme C: animated waveform background ─────────────────────────
function WaveformBg({ color }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <svg
        width="200%"
        height="100%"
        className="absolute"
        style={{ top: 0, left: 0, animation: 'waveform 16s linear infinite' }}
        preserveAspectRatio="none"
      >
        {/* wave 1 */}
        <polyline
          points="0,120 80,100 160,135 240,95 320,125 400,90 480,120 560,100 640,130 720,95 800,120 880,100 960,135 1040,90 1120,120 1200,105 1280,130 1360,95 1440,120 1520,100 1600,135 1680,90 1760,125 1840,100 1920,120 2000,95 2080,130 2160,90 2240,120 2320,105 2400,130 2560,95 2640,120"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.12"
        />
        {/* wave 2 */}
        <polyline
          points="0,280 80,260 160,295 240,255 320,285 400,250 480,280 560,260 640,290 720,255 800,280 880,260 960,295 1040,250 1120,280 1200,265 1280,290 1360,255 1440,280 1520,260 1600,295 1680,250 1760,285 1840,260 1920,280 2000,255 2080,290 2160,250 2240,280 2320,265 2400,290 2560,255 2640,280"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.07"
        />
        {/* wave 3 - faster */}
        <polyline
          points="0,440 60,425 120,455 180,420 240,445 300,415 360,440 420,425 480,450 540,420 600,440 660,425 720,455 780,415 840,440 900,425 960,450 1020,415 1080,440 1140,430 1200,450 1260,415 1320,440 1380,425 1440,455 1500,420 1560,440 1620,430 1680,450 1740,415 1800,440 2000,425 2200,455 2400,420 2640,440"
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          opacity="0.05"
        />
      </svg>
      {/* grid overlay for C */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${color}18 1px, transparent 1px), linear-gradient(90deg, ${color}18 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}

// ─── Pipeline Diagram ───────────────────────────────────────────────
function PipelineDiagram({ theme, t }) {
  const pt = t.landing
  const isFlow = theme.decorStyle === 'flow'
  const isGrid = theme.decorStyle === 'grid'
  const isWave = theme.decorStyle === 'waveform'

  const nodes = [
    { label: 'Linear Issue', sub: 'Task Created', icon: '◆', idx: '01' },
    { label: 'AI Router', sub: 'Model Selected', icon: '⬡', idx: '02' },
    { label: 'Code Agent', sub: 'Running…', icon: '◈', idx: '03', active: true },
    { label: 'Pull Request', sub: 'Ready to Merge', icon: '✓', idx: '04', done: true },
  ]

  return (
    <div className="relative" style={{ padding: '32px 0 40px' }}>
      {/* Connector line */}
      <div className="absolute" style={{ top: '50%', left: '8%', right: '8%', height: '1px' }}>
        {isFlow ? (
          <div style={{ position: 'relative', height: '1px' }}>
            <div style={{ position: 'absolute', inset: 0, borderTop: `1px dashed ${pt.petroleum}`, opacity: 0.35 }} />
            {/* animated dot */}
            <div style={{
              position: 'absolute',
              top: '-3px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: pt.petroleum,
              boxShadow: `0 0 8px ${pt.petroleum}`,
              animation: 'flowDot 3s linear infinite',
            }} />
          </div>
        ) : (
          <div style={{
            borderTop: isGrid
              ? `1px solid ${pt.border}`
              : `1px solid ${pt.border}`,
            opacity: isWave ? 0.5 : 1,
          }} />
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 relative" style={{ zIndex: 1 }}>
        {nodes.map((node, i) => (
          <div
            key={i}
            style={{
              borderRadius: theme.radius.card,
              border: `1px solid ${node.active ? pt.petroleum : node.done ? `${pt.petroleum}88` : pt.border}`,
              background: isWave
                ? `${pt.card}CC`
                : pt.card,
              padding: '16px 14px',
              position: 'relative',
              backdropFilter: isWave ? 'blur(8px)' : 'none',
              boxShadow: node.active && isWave
                ? `0 0 20px ${pt.petroleum}30, 0 0 40px ${pt.petroleum}15`
                : node.active
                  ? `0 0 16px ${pt.petroleum}20`
                  : 'none',
            }}
          >
            {/* top accent line for A */}
            {isGrid && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: node.active ? pt.petroleum : 'transparent',
                borderRadius: `${theme.radius.card} ${theme.radius.card} 0 0`,
              }} />
            )}

            {/* status dot */}
            <div style={{
              position: 'absolute', top: 10, right: 10,
              width: 6, height: 6, borderRadius: '50%',
              background: node.done ? '#22c55e' : node.active ? pt.petroleum : pt.textSecondary,
              opacity: node.done || node.active ? 1 : 0.4,
              animation: node.active ? 'pulse-teal 2s ease-in-out infinite' : 'none',
              boxShadow: node.active ? `0 0 6px ${pt.petroleum}` : 'none',
            }} />

            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: pt.petroleum,
              marginBottom: '8px',
              letterSpacing: '0.05em',
            }}>
              {node.icon} {node.idx}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: pt.textPrimary, marginBottom: 4 }}>
              {node.label}
            </div>
            <div style={{ fontSize: '11px', color: pt.textSecondary }}>
              {node.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Code Block ─────────────────────────────────────────────────────
function CodeBlock({ theme, t }) {
  const pt = t.landing
  const isWave = theme.decorStyle === 'waveform'
  const lines = [
    { text: '# Ship a feature in one command', dim: true },
    { text: 'cogfoundry run \\' },
    { text: '  --issue linear:CFG-42 \\' },
    { text: '  --model claude-3-5-sonnet \\' },
    { text: '  --target github:cogfoundry/api' },
    { text: '' },
    { text: '> Fetching issue context...  ✓', accent: true },
    { text: '> Routing to claude-3-5-sonnet... ✓', accent: true },
    { text: '> Spawning Code Agent... ✓', accent: true },
    { text: '> PR #187: "feat: add rate limiting"', accent: true },
    { text: '> Ready to review in 38s', accent: true },
  ]

  return (
    <div style={{
      borderRadius: theme.radius.card,
      border: `1px solid ${pt.border}`,
      borderTop: `2px solid ${pt.petroleum}`,
      background: isWave ? `${pt.card}CC` : pt.card,
      backdropFilter: isWave ? 'blur(8px)' : 'none',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 16px',
        borderBottom: `1px solid ${pt.border}`,
        background: pt.bg,
      }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: pt.textSecondary }}>
          ~/cogfoundry
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: pt.petroleum, opacity: 0.7 }} />
      </div>
      <pre style={{
        padding: '20px 24px',
        margin: 0,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 13,
        lineHeight: 1.9,
        overflowX: 'auto',
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            color: line.accent ? pt.petroleum : line.dim ? `${pt.textSecondary}70` : pt.textPrimary,
          }}>
            {line.text || '\u00A0'}
          </div>
        ))}
      </pre>
    </div>
  )
}

// ─── Pricing Card ───────────────────────────────────────────────────
function PricingCard({ plan, theme, t, highlight }) {
  const pt = t.landing
  const [hover, setHover] = useState(false)
  const isWave = theme.decorStyle === 'waveform'

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: theme.radius.card,
        border: `1px solid ${highlight ? pt.petroleum : hover ? `${pt.petroleum}66` : pt.border}`,
        background: isWave
          ? highlight ? `${pt.card}DD` : `${pt.bg}AA`
          : highlight ? pt.card : pt.bg,
        backdropFilter: isWave ? 'blur(8px)' : 'none',
        padding: '28px 24px',
        transition: `all ${theme.durationHover} ${theme.ease}`,
        position: 'relative',
        boxShadow: highlight && isWave ? `0 0 32px ${pt.petroleum}20` : 'none',
      }}
    >
      {highlight && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: pt.petroleum,
          borderRadius: `${theme.radius.card} ${theme.radius.card} 0 0`,
        }} />
      )}
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, letterSpacing: '0.12em',
        color: pt.petroleum, marginBottom: 12,
      }}>
        {plan.tier}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
        <span style={{ fontSize: 30, fontWeight: 600, color: pt.textPrimary }}>{plan.price}</span>
        {plan.unit && <span style={{ fontSize: 13, color: pt.textSecondary }}>{plan.unit}</span>}
      </div>
      <p style={{ fontSize: 13, color: pt.textSecondary, marginBottom: 20 }}>{plan.desc}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {plan.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: pt.textSecondary }}>
            <span style={{ color: pt.petroleum, flexShrink: 0, marginTop: 1 }}>—</span>
            {f}
          </li>
        ))}
      </ul>
      <button
        className="btn-press"
        style={{
          width: '100%', padding: '10px 0',
          borderRadius: theme.radius.btn,
          border: highlight ? 'none' : `1px solid ${pt.border}`,
          background: highlight ? pt.petroleum : 'transparent',
          color: highlight ? '#000' : pt.textSecondary,
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          transition: `all ${theme.durationHover} ${theme.ease}`,
        }}
      >
        {plan.cta}
      </button>
    </div>
  )
}

// ─── Main Landing Page ──────────────────────────────────────────────
export default function LandingPage({ theme, t, onNavigate }) {
  const pt = t.landing
  const isA = theme.id === 'A'
  const isB = theme.id === 'B'
  const isC = theme.id === 'C'

  const pricingPlans = [
    {
      tier: 'FREE',
      price: '$0',
      desc: 'For individuals and open source.',
      features: ['100 AI Workloads / month', 'GitHub integration', 'Community models', '7-day logs'],
      cta: 'Start Free',
    },
    {
      tier: 'PRO',
      price: '$49',
      unit: '/ mo',
      desc: 'For professional developers.',
      features: ['5,000 Workloads / month', 'GitHub + Linear', 'All frontier models', '30-day logs', 'Priority routing'],
      cta: 'Get Pro',
    },
    {
      tier: 'ENTERPRISE',
      price: 'Custom',
      desc: 'For teams at scale.',
      features: ['Unlimited Workloads', 'SSO + SAML', 'Dedicated routing', 'SLA 99.9%', 'BYOK support'],
      cta: 'Contact Sales',
    },
  ]

  const whyCards = [
    {
      icon: <Zap size={16} />,
      title: 'Unified Model Router',
      desc: 'One API. Every frontier model. Automatic failover, cost optimization, and latency routing.',
      stat: '40+ models',
    },
    {
      icon: <BarChart3 size={16} />,
      title: 'Agent Execution Engine',
      desc: 'Persistent, multi-step AI workflows. Connects to GitHub, Linear, Codeup. Ships pull requests.',
      stat: '1K → 1B scale',
    },
    {
      icon: <Shield size={16} />,
      title: 'Enterprise Ready',
      desc: 'Data isolation, BYOK, audit logs, and SLA guarantees. Your workloads stay in your control.',
      stat: 'SOC2 Type II',
    },
  ]

  return (
    <div style={{ background: pt.bg, color: pt.textPrimary, minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>

      {/* ── Background decorations ── */}
      {isA && <GridBg color={pt.petroleum} />}
      {isC && <WaveformBg color={pt.petroleum} />}
      {/* Scheme B: subtle radial glow */}
      {isB && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: '-20%', left: '-10%',
            width: '60%', height: '60%',
            background: `radial-gradient(ellipse, ${pt.petroleum}10 0%, transparent 70%)`,
          }} />
        </div>
      )}

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: `1px solid ${pt.border}`,
        background: `${pt.bg}E8`,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 0 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: pt.petroleum, color: '#000',
              borderRadius: '2px', fontSize: 12, fontWeight: 700,
            }}>C</div>
            <span style={{ fontSize: 14, fontWeight: 600, color: pt.textPrimary, letterSpacing: '0.02em' }}>
              CogFoundry
            </span>
          </div>
          <div style={{ flex: 1 }} />
          {/* Nav links */}
          <div style={{ display: 'flex', gap: 28, marginRight: 28 }}>
            {['Docs', 'Pricing', 'Status', 'Blog'].map(item => (
              <a key={item} href="#" style={{
                fontSize: 13, color: pt.textSecondary, textDecoration: 'none',
                transition: `color ${theme.durationHover} ${theme.ease}`,
              }}
              onMouseEnter={e => e.target.style.color = pt.textPrimary}
              onMouseLeave={e => e.target.style.color = pt.textSecondary}
              >{item}</a>
            ))}
          </div>
          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-press" onClick={() => onNavigate('dashboard')} style={{
              padding: '6px 14px', borderRadius: theme.radius.btn,
              border: `1px solid ${pt.border}`, background: 'transparent',
              color: pt.textSecondary, fontSize: 13, cursor: 'pointer',
              transition: `all ${theme.durationHover} ${theme.ease}`,
            }}>Sign In</button>
            <button className="btn-press" style={{
              padding: '6px 14px', borderRadius: theme.radius.btn,
              background: pt.petroleum, border: 'none',
              color: '#000', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1440, margin: '0 auto', padding: '80px 24px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 580 }}>
          {/* Status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 12px', marginBottom: 32,
            borderRadius: theme.radius.btn,
            border: `1px solid ${pt.border}`,
            background: isWave => isC ? `${pt.card}CC` : pt.card,
            backdropFilter: isC ? 'blur(8px)' : 'none',
            fontSize: 11, color: pt.textSecondary,
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0, animation: 'pulse-teal 2s ease-in-out infinite', display: 'inline-block' }} />
            v1.0 · All systems operational
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 600,
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
            color: pt.textPrimary,
            margin: '0 0 20px',
          }}>
            AI Workload<br />
            <span style={{ color: pt.petroleum }}>Production System</span>
          </h1>

          <p style={{ fontSize: 17, color: pt.textSecondary, lineHeight: 1.6, margin: '0 0 32px', maxWidth: 440 }}>
            Route any LLM. Run any Agent. Ship pull requests — not prototypes.
          </p>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="btn-press" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: theme.radius.btn,
              background: pt.petroleum, border: 'none',
              color: '#000', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              boxShadow: isC ? `0 0 24px ${pt.petroleum}40` : 'none',
            }}>
              Start Building <ArrowRight size={14} />
            </button>
            <button className="btn-press" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: theme.radius.btn,
              border: `1px solid ${pt.border}`, background: isC ? `${pt.card}88` : 'transparent',
              color: pt.textSecondary, fontSize: 14, cursor: 'pointer',
              backdropFilter: isC ? 'blur(4px)' : 'none',
            }}>
              <GitBranch size={14} /> View on GitHub
            </button>
          </div>
        </div>

        {/* Pipeline */}
        <div style={{ marginTop: 64 }}>
          <div style={{
            fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
            color: pt.textSecondary, letterSpacing: '0.12em', marginBottom: 12,
          }}>
            WORKLOAD PIPELINE
          </div>
          <PipelineDiagram theme={theme} t={t} />
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{
        borderTop: `1px solid ${pt.border}`,
        borderBottom: `1px solid ${pt.border}`,
        background: isA
          ? `repeating-linear-gradient(0deg, transparent, transparent 27px, ${pt.border}60 27px, ${pt.border}60 28px), repeating-linear-gradient(90deg, transparent, transparent 27px, ${pt.border}60 27px, ${pt.border}60 28px)`
          : isC ? `${pt.card}99` : pt.card,
        backdropFilter: isC ? 'blur(8px)' : 'none',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 10, color: pt.textSecondary, letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>
            TRUSTED BY TEAMS AT
          </span>
          {['Stripe', 'Vercel', 'PlanetScale', 'Neon', 'Resend'].map(co => (
            <span key={co} style={{ fontSize: 13, fontWeight: 500, color: pt.textSecondary, opacity: 0.55 }}>{co}</span>
          ))}
          <div style={{ display: 'flex', gap: 24 }}>
            {[['2.4M', 'Workloads'], ['99.9%', 'Uptime'], ['38s', 'Avg PR']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: pt.textPrimary, lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 11, color: pt.textSecondary, marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ── */}
      <section style={{ maxWidth: 1440, margin: '0 auto', padding: '72px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: pt.textSecondary, letterSpacing: '0.12em', marginBottom: 10 }}>
          WHY COGFOUNDRY
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 600, color: pt.textPrimary, letterSpacing: '-0.02em', marginBottom: 48, lineHeight: 1.3 }}>
          Production-grade infrastructure<br />for AI workloads.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {whyCards.map((card, i) => (
            <div key={i}
              style={{
                borderRadius: theme.radius.card,
                border: `1px solid ${pt.border}`,
                background: isC ? `${pt.card}CC` : pt.card,
                backdropFilter: isC ? 'blur(8px)' : 'none',
                padding: '24px 20px',
                transition: `all ${theme.durationHover} ${theme.ease}`,
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = pt.petroleum
                if (isC) e.currentTarget.style.boxShadow = `0 0 20px ${pt.petroleum}20`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = pt.border
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '2px', border: `1px solid ${pt.border}`,
                color: pt.petroleum, background: pt.bg, marginBottom: 16,
              }}>
                {card.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: pt.textPrimary, marginBottom: 8 }}>{card.title}</div>
              <p style={{ fontSize: 13, color: pt.textSecondary, lineHeight: 1.6, marginBottom: 16 }}>{card.desc}</p>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: pt.petroleum }}>{card.stat}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CODE DEMO ── */}
      <section style={{
        borderTop: `1px solid ${pt.border}`,
        borderBottom: `1px solid ${pt.border}`,
        position: 'relative', zIndex: 1,
        background: isC ? `${pt.card}60` : 'transparent',
        backdropFilter: isC ? 'blur(4px)' : 'none',
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '72px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: pt.textSecondary, letterSpacing: '0.12em', marginBottom: 10 }}>
              DEVELOPER EXPERIENCE
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 600, color: pt.textPrimary, letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.2 }}>
              One command.<br />Production PR.
            </h2>
            <p style={{ fontSize: 14, color: pt.textSecondary, lineHeight: 1.7, marginBottom: 24 }}>
              Point CogFoundry at an issue, pick a model, and watch the agent read context, write code, run tests, and open a PR — in under a minute.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Reads issue context from Linear or GitHub',
                'Routes to the optimal model for the task',
                'Spawns an isolated Code Agent',
                'Opens a diff-clean PR with full context',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: pt.petroleum, flexShrink: 0, marginTop: 2 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 13, color: pt.textSecondary }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
          <CodeBlock theme={theme} t={t} />
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ maxWidth: 1440, margin: '0 auto', padding: '72px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: pt.textSecondary, letterSpacing: '0.12em', marginBottom: 10 }}>
          PRICING
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 600, color: pt.textPrimary, letterSpacing: '-0.02em', marginBottom: 48, lineHeight: 1.3 }}>
          Transparent by default.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {pricingPlans.map((plan, i) => (
            <PricingCard key={plan.tier} plan={plan} theme={theme} t={t} highlight={i === 1} />
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: pt.textSecondary, marginTop: 20 }}>
          All plans include access to the Knowledge Network and Model Supply Network.
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${pt.border}`, position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 20, height: 20, background: pt.petroleum, color: '#000', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>C</div>
            <span style={{ fontSize: 13, color: pt.textSecondary }}>CogFoundry — The Global Cognitive Factory for AI Workloads</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Status', 'Docs'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: pt.textSecondary, textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
