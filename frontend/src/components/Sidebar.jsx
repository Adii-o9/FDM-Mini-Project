import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  HelpCircle,
  BookOpen,
  Info,
  ShieldCheck,
  X
} from 'lucide-react';

export default function Sidebar({
  activePage,
  onNavigate,
  isOpen,
  onClose,
  backendStatus
}) {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'assessment',
      label: 'New Risk Assessment',
      icon: ClipboardCheck,
      badge: 'Tool'
    },
    {
      id: 'how-it-works',
      label: 'How It Works',
      icon: HelpCircle,
      badge: null
    },
    {
      id: 'risk-guide',
      label: 'Risk Guide',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'about',
      label: 'About ReserveIQ',
      icon: Info,
      badge: null
    }
  ];

  const handleItemClick = (id) => {
    onNavigate(id);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Sidebar Brand Header */}
        <div className="sidebar-header">
          <div
            className="sidebar-brand"
            onClick={() => handleItemClick('overview')}
            role="button"
            tabIndex={0}
          >
            <div className="sidebar-brand-icon">
              <ShieldCheck size={20} />
            </div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-title">ReserveIQ</span>
              <span className="sidebar-brand-subtitle">Decision Support</span>
            </div>
          </div>
          {onClose && (
            <button
              className="sidebar-close-btn"
              onClick={onClose}
              aria-label="Close navigation menu"
              type="button"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav" aria-label="Main Navigation">
          <div className="nav-section-label">Operations</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                    onClick={() => handleItemClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={17} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-tag">{item.badge}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer: Minimal System Status Indicator */}
        <div className="sidebar-footer">
          <div
            className={`system-status-indicator ${
              backendStatus?.online ? 'status-ready' : 'status-reconnecting'
            }`}
            title={
              backendStatus?.online
                ? 'Prediction engine and services operational'
                : 'Connecting to operational service...'
            }
          >
            <span className="status-indicator-dot"></span>
            <span className="status-indicator-label">
              {backendStatus?.online ? 'System Ready' : 'Connecting...'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
