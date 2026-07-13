import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Layers, GitCompare, BarChart3, BookOpen, Film, Zap } from 'lucide-react'
import './Navbar.css'

export type StudioTab = 'editor' | 'compare' | 'analytics' | 'glossary'

interface Props {
  studioTab?: StudioTab
  onTabChange?: (tab: StudioTab) => void
  hasScript?: boolean
}

interface DockTabItem {
  key: StudioTab
  label: string
  icon: React.ReactNode
  color: string
}

const DOCK_TABS: DockTabItem[] = [
  { key: 'editor',    label: 'Editor',    icon: <Layers size={16} />,     color: '#c2410c' },
  { key: 'compare',   label: 'Compare',   icon: <GitCompare size={16} />, color: '#d97706' },
  { key: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} />,  color: '#16a34a' },
  { key: 'glossary',  label: 'Glossary',  icon: <BookOpen size={16} />,   color: '#0ea5e9' },
]

function DockTab({
  item,
  isActive,
  isDisabled,
  onClick,
}: {
  item: DockTabItem
  isActive: boolean
  isDisabled: boolean
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isDisabled && onClick()}
      className={`dock-tab ${isActive ? 'dock-tab--active' : ''} ${isDisabled ? 'dock-tab--disabled' : ''}`}
      disabled={isDisabled}
      animate={{
        y: isHovered && !isDisabled && !isActive ? -2 : 0,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
    >
      <div
        className="dock-tab__icon"
        style={{
          background: isActive ? item.color : undefined,
          boxShadow: isActive ? `0 0 12px ${item.color}44` : undefined,
        }}
      >
        {item.icon}
      </div>

      <span className="dock-tab__label">{item.label}</span>

      {/* Active indicator line */}
      {isActive && (
        <motion.div
          className="dock-tab__indicator"
          layoutId="dock-indicator"
          style={{ background: item.color }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

export default function Navbar({ studioTab, onTabChange, hasScript }: Props) {
  const { pathname } = useLocation()
  const isStudio = pathname === '/studio'

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Brand */}
        <Link to="/" className="navbar__brand">
          <div className="navbar__logo-icon">
            <Film size={18} />
          </div>
          <span className="navbar__brand-name">Trans</span>
          <span className="navbar__brand-dot">Create</span>
        </Link>

        {/* Dock tabs — only inside /studio */}
        {isStudio && onTabChange && (
          <motion.nav
            className="dock-bar"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.05 }}
            aria-label="Studio navigation"
          >
            {DOCK_TABS.map(tab => (
              <DockTab
                key={tab.key}
                item={tab}
                isActive={studioTab === tab.key}
                isDisabled={tab.key !== 'editor' && !hasScript}
                onClick={() => onTabChange(tab.key)}
              />
            ))}
          </motion.nav>
        )}

        {/* Right side */}
        <nav className="navbar__nav" aria-label="Main navigation">
          {!isStudio && (
            <>
              <Link to="/#how-it-works" className="navbar__link">How it works</Link>
              <Link to="/about" className="navbar__link">About</Link>
            </>
          )}
          {isStudio && (
            <div className="navbar__engine-badge">
              <Zap size={10} />
              <span>IBM Granite</span>
            </div>
          )}
          <Link
            to="/studio"
            className={`btn btn-primary btn-sm ${pathname === '/studio' ? 'active' : ''}`}
            id="open-studio-btn"
          >
            {isStudio ? 'Studio' : 'Open Studio'}
          </Link>
        </nav>
      </div>
    </header>
  )
}
