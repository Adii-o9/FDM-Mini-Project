import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';

export default function TopBar({
  onToggleSidebar,
  activePageTitle,
  backendStatus
}) {
  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Open sidebar menu"
        >
          <Menu size={22} />
        </button>
        <div className="topbar-brand-mobile">
          <div className="brand-logo-small">
            <ShieldCheck size={18} />
          </div>
          <span className="brand-text-mobile">ReserveIQ</span>
        </div>
        <div className="topbar-page-info">
          <span className="topbar-page-title">{activePageTitle}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div
          className={`topbar-status-badge ${
            backendStatus?.online ? 'status-ready' : 'status-reconnecting'
          }`}
          title={backendStatus?.online ? 'System operational' : 'System reconnecting'}
        >
          <span className="status-indicator-dot"></span>
          <span className="status-badge-text">
            {backendStatus?.online ? 'System Ready' : 'Reconnecting...'}
          </span>
        </div>
      </div>
    </header>
  );
}
