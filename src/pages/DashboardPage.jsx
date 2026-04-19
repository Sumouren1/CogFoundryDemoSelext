import { useState } from 'react'
import {
  LayoutDashboard, GitPullRequest, Zap, Settings, ChevronDown,
  TrendingUp, CheckCircle, DollarSign, Activity, ChevronRight,
  Circle, ArrowUpRight, MoreHorizontal
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts'

const chartData = [
  { date: 'Apr 8', runs: 42, prs: 18, spend: 12 },
  { date: 'Apr 9', runs: 67, prs: 31, spend: 19 },
  { date: 'Apr 10', runs: 53, prs: 24, spend: 15 },
  { date: 'Apr 11', runs: 89, prs: 41, spend: 26 },
  { date: 'Apr 12', runs: 74, prs: 35, spend: 22 },
  { date: 'Apr 13', runs: 112, prs: 52, spend: 34 },
  { date: 'Apr 14', runs: 98, prs: 44, spend: 29 },
  { date: 'Apr 15', runs: 134, prs: 63, spend: 41 },
  { date: 'Apr 16', runs: 147, prs: 71, spend: 46 },
  { date: 'Apr 17', runs: 162, prs: 78, spend: 51 },
]

const recentRuns = [
  { id: 'CFG-089', issue: 'Fix auth token expiry bug', model: 'claude-3-5-sonnet', status: 'success', duration: '41s', pr: '#234' },
  { id: 'CFG-088', issue: 'Add pagination to /users endpoint', model: 'gpt-4o', status: 'success', duration: '67s', pr: '#233' },
  { id: 'CFG-087', issue: 'Migrate DB schema v3.2', model: 'claude-3-5-sonnet', status: 'running', duration: '2m 14s', pr: null },
  { id: 'CFG-086', issue: 'Update OpenAPI spec', model: 'claude-3-haiku', status: 'success', duration: '29s', pr: '#231' },
  { id: 'CFG-085', issue: 'Rate limiting middleware', model: 'gpt-4o-mini', status: 'failed', duration: '1m 03s', pr: null },
]

function MetricCard({ icon, label, value, delta, theme, t }) {
  const ct = t.console
  return (
    <div
      style={{
        borderRadius: theme.radius.card,
        border: `1px solid ${ct.border}`,
        background: ct.card,
        padding: '20px 24px',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs" style={{ color: ct.textSecondary }}>{label}</span>
        <div
          className="w-7 h-7 flex items-center justify-center"
          style={{
            borderRadius: '2px',
            border: `1px solid ${ct.border}`,
            color: ct.petroleum,
          }}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold" style={{ color: ct.textPrimary }}>
          {value}
        </span>
        {delta && (
          <span className="text-xs flex items-center gap-0.5" style={{ color: '#22c55e' }}>
            <TrendingUp size={10} />
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}

function StatusDot({ status, petroleum }) {
  const colors = {
    success: '#22c55e',
    running: petroleum,
    failed: '#ef4444',
  }
  return (
    <div
      className="w-1.5 h-1.5 rounded-full"
      style={{
        background: colors[status] || colors.success,
        animation: status === 'running' ? 'pulse-teal 1.5s ease-in-out infinite' : 'none',
        boxShadow: status === 'running' ? `0 0 6px ${petroleum}` : 'none',
      }}
    />
  )
}

export default function DashboardPage({ theme, t, onNavigate }) {
  const ct = t.console
  const [activeNav, setActiveNav] = useState('dashboard')

  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
    { id: 'workloads', icon: <Zap size={15} />, label: 'Workloads' },
    { id: 'prs', icon: <GitPullRequest size={15} />, label: 'Pull Requests' },
    { id: 'settings', icon: <Settings size={15} />, label: 'Settings' },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: ct.card,
            border: `1px solid ${ct.border}`,
            borderRadius: theme.radius.card,
            padding: '8px 12px',
          }}
        >
          <p className="text-xs mb-1" style={{ color: ct.textSecondary }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-xs font-mono" style={{ color: p.color, fontFamily: 'JetBrains Mono, monospace' }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: ct.bg, color: ct.textPrimary }}
    >
      {/* SIDEBAR */}
      <aside
        className="flex flex-col"
        style={{
          width: '240px',
          flexShrink: 0,
          background: ct.sidebar,
          borderRight: `1px solid ${ct.border}`,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 px-5 h-14"
          style={{ borderBottom: `1px solid ${ct.border}` }}
        >
          <div
            className="w-6 h-6 flex items-center justify-center text-xs font-bold"
            style={{ background: ct.petroleum, color: '#000', borderRadius: '2px' }}
          >
            C
          </div>
          <span className="text-sm font-semibold" style={{ color: ct.textPrimary }}>
            CogFoundry
          </span>
        </div>

        {/* Workspace selector */}
        <div
          className="flex items-center justify-between px-4 py-3 mx-3 mt-3 cursor-pointer"
          style={{
            borderRadius: theme.radius.card,
            border: `1px solid ${ct.border}`,
            background: ct.bg,
          }}
        >
          <div>
            <div className="text-xs font-medium" style={{ color: ct.textPrimary }}>
              Personal Workspace
            </div>
            <div className="text-xs" style={{ color: ct.textSecondary }}>Pro Plan</div>
          </div>
          <ChevronDown size={12} style={{ color: ct.textSecondary }} />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 mt-4 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left"
              style={{
                borderRadius: theme.radius.btn,
                background: activeNav === item.id ? `${ct.petroleum}18` : 'transparent',
                color: activeNav === item.id ? ct.petroleum : ct.textSecondary,
                border: 'none',
                cursor: 'pointer',
                transition: `all 200ms ${theme.ease}`,
              }}
              onMouseEnter={e => {
                if (activeNav !== item.id) {
                  e.currentTarget.style.background = `${ct.border}80`
                  e.currentTarget.style.color = ct.textPrimary
                }
              }}
              onMouseLeave={e => {
                if (activeNav !== item.id) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = ct.textSecondary
                }
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom user */}
        <div
          className="flex items-center gap-3 px-4 py-4 mx-3 mb-3"
          style={{
            borderRadius: theme.radius.card,
            border: `1px solid ${ct.border}`,
          }}
        >
          <div
            className="w-7 h-7 flex items-center justify-center text-xs font-semibold"
            style={{
              borderRadius: '2px',
              background: ct.petroleum,
              color: '#000',
              flexShrink: 0,
            }}
          >
            D
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate" style={{ color: ct.textPrimary }}>
              dev@example.com
            </div>
            <div className="text-xs" style={{ color: ct.textSecondary }}>Pro</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-8 h-14"
          style={{
            background: `${ct.bg}F0`,
            backdropFilter: 'blur(8px)',
            borderBottom: `1px solid ${ct.border}`,
          }}
        >
          <div>
            <h1 className="text-base font-semibold" style={{ color: ct.textPrimary }}>
              Dashboard
            </h1>
            <p className="text-xs" style={{ color: ct.textSecondary }}>
              Apr 17, 2026 · Last 7 days
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium btn-press"
            style={{
              borderRadius: theme.radius.btn,
              background: ct.petroleum,
              color: '#000',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Zap size={13} />
            New Workload
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* METRIC CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={<Activity size={14} />}
              label="TOTAL RUNS"
              value="1,247"
              delta="+12%"
              theme={theme}
              t={t}
            />
            <MetricCard
              icon={<GitPullRequest size={14} />}
              label="PRS OPENED"
              value="583"
              delta="+8%"
              theme={theme}
              t={t}
            />
            <MetricCard
              icon={<CheckCircle size={14} />}
              label="SUCCESS RATE"
              value="96.2%"
              delta="+1.4%"
              theme={theme}
              t={t}
            />
            <MetricCard
              icon={<DollarSign size={14} />}
              label="API SPEND"
              value="$284"
              delta="-3%"
              theme={theme}
              t={t}
            />
          </div>

          {/* CHART */}
          <div
            style={{
              borderRadius: theme.radius.card,
              border: `1px solid ${ct.border}`,
              background: ct.card,
              padding: '20px 24px',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm font-medium" style={{ color: ct.textPrimary }}>
                  Workload Activity
                </div>
                <div className="text-xs mt-0.5" style={{ color: ct.textSecondary }}>
                  Runs and PRs over the last 10 days
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: ct.petroleum }} />
                  <span className="text-xs" style={{ color: ct.textSecondary }}>Runs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#64748B' }} />
                  <span className="text-xs" style={{ color: ct.textSecondary }}>PRs</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gradRuns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ct.petroleum} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={ct.petroleum} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPRs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#64748B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={ct.border} vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: ct.textSecondary, fontFamily: 'JetBrains Mono, monospace' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: ct.textSecondary, fontFamily: 'JetBrains Mono, monospace' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="runs"
                  name="Runs"
                  stroke={ct.petroleum}
                  strokeWidth={1.5}
                  fill="url(#gradRuns)"
                  dot={false}
                  activeDot={{ r: 3, fill: ct.petroleum }}
                />
                <Area
                  type="monotone"
                  dataKey="prs"
                  name="PRs"
                  stroke="#64748B"
                  strokeWidth={1.5}
                  fill="url(#gradPRs)"
                  dot={false}
                  activeDot={{ r: 3, fill: '#64748B' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* RECENT RUNS */}
          <div
            style={{
              borderRadius: theme.radius.card,
              border: `1px solid ${ct.border}`,
              background: ct.card,
              overflow: 'hidden',
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: `1px solid ${ct.border}` }}
            >
              <div className="text-sm font-medium" style={{ color: ct.textPrimary }}>
                Recent Workloads
              </div>
              <button
                className="text-xs flex items-center gap-1"
                style={{ color: ct.petroleum, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                View all <ChevronRight size={12} />
              </button>
            </div>

            {/* Table header */}
            <div
              className="grid grid-cols-12 gap-4 px-6 py-2"
              style={{ borderBottom: `1px solid ${ct.border}` }}
            >
              {['ISSUE', 'MODEL', 'STATUS', 'DURATION', 'PR'].map((h, i) => (
                <div
                  key={h}
                  className={`text-xs font-mono ${i === 0 ? 'col-span-4' : i === 1 ? 'col-span-3' : 'col-span-2'} ${i === 3 ? 'text-right' : ''} ${i === 4 ? 'col-span-1 text-right' : ''}`}
                  style={{ color: ct.textSecondary, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}
                >
                  {h}
                </div>
              ))}
            </div>

            {recentRuns.map((run, i) => (
              <div
                key={run.id}
                className="grid grid-cols-12 gap-4 px-6 py-3 items-center"
                style={{
                  borderBottom: i < recentRuns.length - 1 ? `1px solid ${ct.border}` : 'none',
                  transition: `background 200ms ${theme.ease}`,
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${ct.bg}80`}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Issue */}
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <span
                    className="text-xs font-mono flex-shrink-0"
                    style={{ color: ct.petroleum, fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {run.id}
                  </span>
                  <span
                    className="text-xs truncate"
                    style={{ color: ct.textSecondary }}
                  >
                    {run.issue}
                  </span>
                </div>
                {/* Model */}
                <div className="col-span-3">
                  <span
                    className="text-xs font-mono"
                    style={{ color: ct.textSecondary, fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {run.model}
                  </span>
                </div>
                {/* Status */}
                <div className="col-span-2 flex items-center gap-1.5">
                  <StatusDot status={run.status} petroleum={ct.petroleum} />
                  <span
                    className="text-xs capitalize"
                    style={{
                      color: run.status === 'success' ? '#22c55e'
                        : run.status === 'running' ? ct.petroleum
                        : '#ef4444',
                    }}
                  >
                    {run.status}
                  </span>
                </div>
                {/* Duration */}
                <div className="col-span-2 text-right">
                  <span className="text-xs font-mono" style={{ color: ct.textSecondary, fontFamily: 'JetBrains Mono, monospace' }}>
                    {run.duration}
                  </span>
                </div>
                {/* PR */}
                <div className="col-span-1 text-right">
                  {run.pr ? (
                    <span
                      className="text-xs font-mono flex items-center justify-end gap-0.5"
                      style={{ color: ct.petroleum, fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {run.pr} <ArrowUpRight size={10} />
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: ct.border }}>—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
