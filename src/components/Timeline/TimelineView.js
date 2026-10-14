"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Calendar as CalendarIcon, ChevronDown, ChevronRight } from 'lucide-react';

export default function TimelineView({ data, onSelect }) {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [lineFilter, setLineFilter] = useState('All');
    const [expandedLines, setExpandedLines] = useState({});
    const timelineContainerRef = useRef(null);

    const matingLines = useMemo(() => {
        const lines = new Set(data.matings?.map(m => m.line).filter(Boolean));
        const sortedLines = Array.from(lines).sort();

        return { list: ['All', ...sortedLines], unique: sortedLines };
    }, [data.matings]);

    const toggleLine = (line) => {
        setExpandedLines(prev => ({
            ...prev,
            [line]: !prev[line]
        }));
    };

    // Prepare data grouped by line
    const groupedData = useMemo(() => {
        if (!data.matings) return [];
        
        const groups = {};
        data.matings.forEach(m => {
            if (lineFilter !== 'All' && m.line !== lineFilter) return;
            
            const line = m.line || 'Unknown';
            if (!groups[line]) groups[line] = [];
            
            const litters = data.litters?.filter(l => l.matingId === m.id) || [];
            groups[line].push({
                ...m,
                litters: litters.sort((a, b) => new Date(a.dob) - new Date(b.dob))
            });
        });

        // Sort within groups and return as array of groups
        return Object.entries(groups).map(([name, matings]) => ({
            name,
            matings: matings.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, [data.matings, data.litters, lineFilter]);

    // Calculate time range: Data range + 6 months padding on both sides
    const timeRange = useMemo(() => {
        const now = new Date();
        let start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        let end = new Date(now.getFullYear(), now.getMonth() + 6, 0);

        if (data.matings && data.matings.length > 0) {
            data.matings.forEach(m => {
                const mStart = new Date(m.startDate);
                const mEnd = m.endDate && m.endDate !== 'nan' ? new Date(m.endDate) : now;
                if (mStart < start) start = mStart;
                if (mEnd > end) end = mEnd;
            });
        }

        // Add 6 months padding relative to the total span
        start = new Date(start.getFullYear(), start.getMonth() - 6, 1);
        end = new Date(end.getFullYear(), end.getMonth() + 7, 0);

        return { start, end };
    }, [data.matings]);

    const totalDays = Math.ceil((timeRange.end - timeRange.start) / (24 * 60 * 60 * 1000));
    const dayWidth = 5 * zoomLevel;
    const rowHeight = 36; // Even more compact

    const getXPosition = (dateStr) => {
        if (!dateStr || dateStr === 'nan') return null;
        let d = new Date(dateStr);
        if (isNaN(d.getTime())) return null;
        const diff = (d - timeRange.start) / (24 * 60 * 60 * 1000);
        return diff * dayWidth;
    };

    // Auto-scroll to today (1/3 from left)
    useEffect(() => {
        if (timelineContainerRef.current) {
            const todayX = (new Date(new Date().toISOString().split('T')[0]) - timeRange.start) / (24 * 60 * 60 * 1000) * dayWidth;
            const containerWidth = timelineContainerRef.current.clientWidth;
            const scrollPos = todayX - (containerWidth / 3);
            timelineContainerRef.current.scrollLeft = scrollPos;
        }
    }, [timeRange, dayWidth, groupedData]);

    const renderTimelineHeader = () => {
        const markers = [];
        const current = new Date(timeRange.start);
        current.setDate(1);

        while (current <= timeRange.end) {
            const x = getXPosition(current.toISOString().split('T')[0]);
            markers.push(
                <div key={current.getTime()} style={{
                    position: 'absolute',
                    left: `${x}px`,
                    borderLeft: '2px solid var(--glass-border)',
                    height: '100%',
                    paddingLeft: '6px',
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                }}>
                    {current.toLocaleDateString('default', { month: 'short', year: 'numeric' })}
                </div>
            );
            current.setMonth(current.getMonth() + 1);
        }
        return markers;
    };

    const renderVerticalGrid = () => {
        const lines = [];
        
        // Month lines (Dotted)
        const monthCurrent = new Date(timeRange.start);
        monthCurrent.setDate(1);
        while (monthCurrent <= timeRange.end) {
            const x = getXPosition(monthCurrent.toISOString().split('T')[0]);
            lines.push(
                <div key={`month-${monthCurrent.getTime()}`} style={{
                    position: 'absolute',
                    left: `${x}px`,
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    borderLeft: '1.5px dotted var(--glass-border)',
                    opacity: 0.6,
                    pointerEvents: 'none',
                    zIndex: 1
                }} />
            );
            monthCurrent.setMonth(monthCurrent.getMonth() + 1);
        }

        // Weekly lines (Very faint solid)
        const weekCurrent = new Date(timeRange.start);
        // Align to the nearest Sunday or Monday to make it consistent
        weekCurrent.setDate(weekCurrent.getDate() + (7 - weekCurrent.getDay()) % 7);
        while (weekCurrent <= timeRange.end) {
            const x = getXPosition(weekCurrent.toISOString().split('T')[0]);
            lines.push(
                <div key={`week-${weekCurrent.getTime()}`} style={{
                    position: 'absolute',
                    left: `${x}px`,
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    borderLeft: '1px solid var(--glass-border)',
                    opacity: 0.2, // Extremely subtle
                    pointerEvents: 'none',
                    zIndex: 0
                }} />
            );
            weekCurrent.setDate(weekCurrent.getDate() + 7);
        }

        // Today line
        const todayX = getXPosition(new Date().toISOString().split('T')[0]);
        if (todayX !== null) {
            lines.push(
                <div key="today-line" style={{
                    position: 'absolute',
                    left: `${todayX}px`,
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    borderLeft: '2px dotted var(--text-muted)',
                    opacity: 0.6,
                    zIndex: 2,
                    pointerEvents: 'none'
                }} />
            );
        }

        return lines;
    };

    return (
        <div data-print-fix="true" style={{ display: 'flex', flexDirection: 'column', height: '80vh', background: 'var(--card-bg)', borderRadius: '24px', border: '2px solid var(--glass-border)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            {/* Toolbar */}
            <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass)', backdropFilter: 'blur(20px)', zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ background: 'var(--accent-primary)', padding: '6px', borderRadius: '10px', display: 'flex' }}>
                            <CalendarIcon size={18} color="white" />
                        </div>
                        <h2 style={{ fontSize: '1rem', fontWeight: 900 }}>Breeding Timeline</h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--background)', padding: '3px 10px', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>Filter Line:</span>
                        <select 
                            value={lineFilter} 
                            onChange={(e) => setLineFilter(e.target.value)}
                            style={{ background: 'transparent', border: 'none', fontSize: '0.7rem', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                        >
                            {matingLines.list.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', marginRight: '0.5rem', paddingRight: '1rem', borderRight: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '10px', height: '3px', borderRadius: '1.5px', background: '#6366f1' }}></div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Active</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '10px', height: '3px', borderRadius: '1.5px', background: '#94a3b8' }}></div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Inactive</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '9px', height: '9px', background: '#f43f5e', transform: 'rotate(45deg)', border: '1px solid white' }}></div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Birth</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', background: 'var(--background)', borderRadius: '8px', padding: '2px' }}>
                        <button onClick={() => setZoomLevel(prev => Math.max(0.4, prev - 0.2))} className="btn btn-ghost" style={{ padding: '0.3rem', border: 'none' }}><ZoomOut size={14} /></button>
                        <button onClick={() => setZoomLevel(prev => Math.min(4, prev + 0.2))} className="btn btn-ghost" style={{ padding: '0.3rem', border: 'none' }}><ZoomIn size={14} /></button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div ref={timelineContainerRef} className="print-keep-scroll" style={{ flex: 1, display: 'flex', alignItems: 'flex-start', overflow: 'auto', background: 'var(--background)', position: 'relative' }}>
                {/* Labels Column (sticky left; scrolls vertically together with the timeline) */}
                <div style={{ width: '250px', flexShrink: 0, position: 'sticky', left: 0, zIndex: 20, borderRight: '1px solid var(--glass-border)', background: 'var(--card-bg)' }}>
                    <div style={{ height: '40px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', position: 'sticky', top: 0, zIndex: 30, background: 'var(--card-bg)' }}>
                        MOUSELINE / UNIT
                    </div>
                    <div>
                        {groupedData.map(group => (
                            <React.Fragment key={group.name}>
                                {/* Group Header */}
                                <div 
                                    onClick={() => toggleLine(group.name)}
                                    style={{ 
                                        padding: '0.4rem 1rem', 
                                        background: 'var(--card-bg)', 
                                        backgroundImage: 'linear-gradient(rgba(var(--accent-rgb), 0.03), rgba(var(--accent-rgb), 0.03))',
                                        borderBottom: '1px solid var(--glass-border)',
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '6px', 
                                        cursor: 'pointer',
                                        position: 'sticky',
                                        top: '40px',
                                        zIndex: 5
                                    }}
                                >
                                    {expandedLines[group.name] === false ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-primary)' }}>{group.name}</span>
                                    <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>({group.matings.length})</span>
                                </div>
                                {expandedLines[group.name] !== false && group.matings.map(m => (
                                    <div 
                                        key={m.id} 
                                        onClick={() => onSelect('matings', m.id)} 
                                        style={{ height: `${rowHeight}px`, padding: '0 1rem 0 2rem', display: 'flex', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.03)', transition: 'all 0.1s' }}
                                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(var(--accent-rgb), 0.05)'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <span style={{ background: 'var(--background)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.55rem', fontWeight: 800, marginRight: '8px' }}>#{m.id}</span>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.8 }}>{m.maleId} × {m.femaleId}</span>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Timeline Area */}
                <div style={{ flex: 'none', background: 'var(--background)', position: 'relative' }}>
                    <div style={{ width: `${totalDays * dayWidth}px`, minHeight: '100%', position: 'relative' }}>
                        {/* Header */}
                        <div style={{ height: '40px', borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 10, backdropFilter: 'blur(10px)' }}>
                            {renderTimelineHeader()}
                        </div>

                        {/* Content */}
                        <div style={{ position: 'relative' }}>
                            {renderVerticalGrid()}
                            
                            {groupedData.map(group => (
                                <React.Fragment key={group.name + '-timeline'}>
                                    {/* Group Header Row Overlay */}
                                    <div style={{ height: '28px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.01)' }}></div>
                                    {expandedLines[group.name] !== false && group.matings.map(m => {
                                        const startX = getXPosition(m.startDate);
                                        const endX = getXPosition(m.endDate && m.endDate !== 'nan' ? m.endDate : new Date().toISOString().split('T')[0]);
                                        const width = Math.max(endX - startX, 4);

                                        return (
                                            <div key={m.id} style={{ height: `${rowHeight}px`, borderBottom: '1px solid rgba(0,0,0,0.03)', position: 'relative' }}>
                                                {/* Grid Line (Horizontal) */}
                                                <div style={{ position: 'absolute', top: '18px', left: 0, right: 0, height: '1px', background: 'var(--glass-border)', opacity: 0.1 }}></div>
                                                
                                                {/* Mating Bar */}
                                                <div 
                                                    style={{
                                                        position: 'absolute',
                                                        left: `${startX}px`,
                                                        top: '15px',
                                                        width: `${width}px`,
                                                        height: '6px',
                                                        background: m.endDate && m.endDate !== 'nan' ? 'linear-gradient(90deg, #94a3b8, #64748b)' : 'linear-gradient(90deg, #6366f1, #4f46e5)',
                                                        borderRadius: '3px',
                                                        zIndex: 4,
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />

                                                {/* Litters directly on the line (Diamond Shape) */}
                                                {m.litters.map(l => (
                                                    <div 
                                                        key={l.id}
                                                        onClick={() => onSelect('litters', l.id)}
                                                        style={{
                                                            position: 'absolute',
                                                            left: `${getXPosition(l.dob)}px`,
                                                            top: '12px',
                                                            cursor: 'pointer',
                                                            transform: 'translateX(-50%)',
                                                            zIndex: 10,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <div style={{ 
                                                            width: '10px', 
                                                            height: '10px', 
                                                            background: '#f43f5e', // Vibrant rose
                                                            transform: 'rotate(45deg)',
                                                            borderRadius: '1px',
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center',
                                                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                            border: '1px solid white'
                                                        }}>
                                                            <span style={{ 
                                                                transform: 'rotate(-45deg)', 
                                                                fontSize: '0.45rem', 
                                                                fontWeight: 900, 
                                                                color: 'white' 
                                                            }}>
                                                                {l.pupCount}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
