"use client";
import { Layout } from 'lucide-react';

export default function Tabs({ activeTab, setActiveTab }) {
    const tabs = [
        { id: 'home', label: 'Dashboard' },
        { id: 'manage', label: 'Manage' },
        { id: 'cages', label: 'Location' },
        { id: 'tracking', label: 'Pedigree' }
    ];

    const activeLabel = tabs.find(t => t.id === activeTab)?.label || 'Dashboard';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--glass)',
            borderRadius: '12px',
            border: '1px solid var(--glass-border)',
            padding: '4px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            minWidth: '220px'
        }}>
            {/* Top Row: Current View Indicator */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.3rem 0.6rem',
                borderBottom: '1px solid var(--glass-border)',
                marginBottom: '2px',
                color: 'var(--text-muted)'
            }}>
                <Layout size={14} style={{ color: 'var(--accent-secondary)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>View:</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{activeLabel}</span>
                </div>
            </div>

            {/* Bottom Row: Tab Switcher */}
            <div style={{ display: 'flex', gap: '2px', padding: '0 2px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '6px',
                            border: 'none',
                            background: activeTab === tab.id ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
                            color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            flex: 1,
                            transition: 'all 0.2s',
                            textAlign: 'center'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
