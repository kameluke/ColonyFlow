"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, MousePointer2, Box, Heart, Baby, ChevronUp, ChevronDown, ChevronRight, ChevronLeft, MapPin, X, Search, Check, Settings, Eye, EyeOff, Archive, BarChart3, Filter, Calendar, Printer, GitMerge, GripVertical } from 'lucide-react';
import WeanAssignModal from './WeanAssignModal';

const MouseAnimalIcon = ({ size = 22, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 38 20"
        width={size}
        height={size}
        {...props}
    >
        <g>
            <path fill="#d0d0d0" d="M 23.5 17 C 18 18.6, 7 18.6, 3.5 15.5 C 1.6 13.8, 0.4 11.2, 0.4 9.6 C 0.4 8, 1.5 7, 4.2 6.5 C 4.8 5, 6.8 3.2, 9.5 3.2 C 11.5 3.2, 12.8 4.2, 13.5 5.4 C 14.8 6.4, 16.5 5.2, 18.5 5.2 C 22.5 5.2, 25.8 7.8, 26.8 11.8 C 27.8 14.2, 26 16.8, 23.5 17 Z" />
            <path fill="#3d3e40" d="M 4.5 8.8 C 5 8.6, 5.5 8.9, 5.6 9.4 C 5.7 9.9, 5.4 10.4, 4.9 10.5 C 4.4 10.6, 3.9 10.3, 3.8 9.8 C 3.7 9.3, 4 8.9, 4.5 8.8 Z" />
            <g fill="none" stroke="#52525b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                <path d="M 26.2 12 C 28.5 11.5, 32 12.5, 36 10.2" />
                <path d="M 12 6.8 C 13.2 7.4, 15 5.2, 18.2 5.2 C 22.8 5.2, 25.8 7.8, 26.8 11.8 C 27.8 14.2, 26 16.8, 23.2 17" />
                <path d="M 7.2 6.8 C 6.8 4.8, 8.2 3.6, 9.8 3.8 C 11.2 4, 11.8 5.5, 11.2 7" />
                <path d="M 4.5 6.6 C 2 7.2, 0.4 8.5, 0.4 9.6 C 0.4 11.2, 1.6 13, 4.2 14.2" />
                <path d="M 8.5 13.5 L 6.8 16.8 L 3.8 16.8" />
                <path d="M 20 15.2 C 19.5 16.8, 18 16.8, 16 16.8 L 19 16.8" />
            </g>
        </g>
    </svg>
);

const PupAnimalIcon = ({ size = 15, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 25.44 12.19"
        width={size}
        height={size}
        {...props}
    >
        <g>
            <g>
                <path fill="#d0d0d0" d="M14.89,11.68c-.23-.01-.46-.07-.72-.07l-5.9.02-4.68.24c-.29.01-.56.1-.8.16-.08-.09-.09-.23-.08-.34.03-.39-.35-.86.18-1.37.5-.48,1.1.07,1.63-.48.07-.47-.37-.81-.8-.92-.89-.22-3.22-.91-3.35-1.85-.04-.29.18-.39.38-.57l2.57-2.23c.46-.4.89-.75,1.49-.96.08-.12.11-.38.11-.53.01-1.42,1.23-2.46,2.59-2.26s2.24,1.6,1.79,2.95c-.04.13-.03.27-.08.36-.1.12-.06.24,0,.38.31-.2.67-.11,1.05-.07,2.64.23,4.33,1.6,4.96,4.2.11.47.21.89.1,1.39-.12.53-.17,1.06-.31,1.55-.04.13-.1.26-.1.4Z" />
                <path fill="#3d3e40" d="M4.14,5.28c.28-.15.6-.06.75.21.13.23.04.55-.18.69-.26.17-.56.08-.7-.09-.23-.27-.16-.66.12-.81Z" />
                <g fill="none" stroke="#52525b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                    <path d="M24.94,6.73l-3.8.03c-1.94.02-2.27,2.94-5.45,2.47" />
                    <path d="M7.74,11.29c-.09-.46-.21-.97.1-1.42s.94-.71,1.48-.62l1.09.18" />
                    <path d="M7.74,4.96c.51-.2,1-.44,1.47-.74.31-.2.67-.11,1.05-.07,2.64.23,4.33,1.6,4.96,4.2.11.47.21.89.1,1.39-.12.53-.17,1.06-.31,1.55v.06" />
                    <path d="M9.21,3.84c.04-.09.03-.23.08-.36.46-1.35-.41-2.74-1.79-2.95s-2.57.84-2.59,2.26c0,.14-.03.4-.11.53-.32.11-1.74.66-2.63,1.44-1.14.98-1.67,2-1.67,2.34,0,.94,2.33,1.61,3.21,1.83.43.11.88.45.8.92-.53.55-1.13,0-1.63.48-.53.51-.15.98-.18,1.37" />
                </g>
            </g>
        </g>
    </svg>
);

// Cage display helper for consistent formatting
function getCageDisplayTag(settings, room, tag) {
    if (!tag || tag === 'nan') return '-';
    // Use 'full' as default if mode is not set or for new Room_Rack-Tag format
    const mode = settings?.cageDisplayMode || 'full';
    
    // Check if tag is in new composite format: Room_Rack-Tag
    if (tag.includes('_') && tag.includes('-')) {
        const underscoreIndex = tag.indexOf('_');
        const dashIndex = tag.indexOf('-', underscoreIndex);
        
        const roomPart = tag.substring(0, underscoreIndex);
        const rackPart = tag.substring(underscoreIndex + 1, dashIndex);
        const shortTag = tag.substring(dashIndex + 1);

        if (mode === 'tag') return shortTag;
        if (mode === 'rack-tag') return `${rackPart}-${shortTag}`;
        if (mode === 'full') return tag;
        return tag;
    }

    // Fallback for legacy or partial data
    if (mode === 'tag') return tag;
    const roomParts = room?.split('/') || [];
    const rackStr = roomParts[1] || roomParts[0] || '';
    if (mode === 'rack-tag') return rackStr ? `${rackStr}-${tag}` : tag;
    if (mode === 'full') {
        if (!room) return tag;
        const prefix = room.replace('/', '_');
        return `${prefix}-${tag}`;
    }
    return tag;
}

// Help component for visual rack selection
const RackSelector = ({ data, roomName, selectedRow, selectedCol, selectedCageTag, onSelect, mode = 'cage' }) => {
    if (!roomName) return <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Please select a Room/Rack first.</div>;

    const room = data.rooms?.find(r => r.name === roomName);
    if (!room) return null;

    const rows = parseInt(room.rows, 10) || 1;
    const cols = parseInt(room.cols, 10) || 1;
    const rackGrid = Array.from({ length: rows }, () => Array(cols).fill(null));

    // Fill occupied spots
    data.cages?.forEach(cage => {
        if (cage.room === roomName && cage.row && cage.col) {
            if (cage.row <= rows && cage.col <= cols) {
                rackGrid[cage.row - 1][cage.col - 1] = cage.tag;
            }
        }
    });

    const getColLabel = (cIdx) => {
        if (room.colFormat === 'A') return String.fromCharCode(65 + cIdx);
        return cIdx + 1;
    };

    const getRowLabel = (rIdx) => {
        if (room.rowFormat === 'A') return String.fromCharCode(65 + rIdx);
        return rIdx + 1;
    };

    return (
        <div style={{ marginTop: '0.5rem', background: 'var(--glass)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', overflowX: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 800, alignSelf: 'flex-start' }}>
                Click to select cage location:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${cols}, 32px)`, gap: '4px', width: 'fit-content' }}>
                {/* Header row */}
                <div />
                {Array.from({ length: cols }).map((_, c) => (
                    <div key={`hc_${c}`} style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{getColLabel(c)}</div>
                ))}

                {/* Grid rows */}
                {rackGrid.map((rowArr, r) => (
                    <React.Fragment key={`row_${r}`}>
                        <div key={`hr_${r}`} style={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', paddingRight: '0.5rem' }}>{getRowLabel(r)}</div>
                        {rowArr.map((occupiedTag, c) => {
                            const isCageMode = mode === 'cage';
                            const matchRow = parseInt(selectedRow) === r + 1;
                            const matchCol = parseInt(selectedCol) === c + 1;
                            const isSelected = isCageMode
                                ? matchRow && matchCol
                                : (occupiedTag && occupiedTag === selectedCageTag) ||
                                (!occupiedTag && matchRow && matchCol); // allow selecting empty slot by row/col even in mouse mode if tag is generated
                            const canClick = isCageMode ? !occupiedTag : true;

                            return (
                                <div
                                    key={`${r}-${c}`}
                                    onClick={() => {
                                        if (!canClick) return;
                                        if (isCageMode) {
                                            onSelect({ r: r + 1, c: c + 1, tag: `${getRowLabel(r)}-${getColLabel(c)}` });
                                        } else {
                                            if (occupiedTag) onSelect(occupiedTag);
                                            else onSelect({ tag: `${getRowLabel(r)}-${getColLabel(c)}`, r: r + 1, c: c + 1 });
                                        }
                                    }}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        background: isSelected ? 'var(--accent-primary)' : occupiedTag ? 'rgba(128,128,128,0.5)' : 'var(--card-bg)',
                                        border: isSelected ? '2px solid white' : '1px solid var(--glass-border)',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.6rem',
                                        cursor: canClick ? 'pointer' : 'not-allowed',
                                        opacity: canClick || isSelected ? 1 : 0.4
                                    }}
                                    title={occupiedTag ? `Occupied by ${getCageDisplayTag(data.settings, roomName, occupiedTag)}` : 'Empty'}
                                >
                                    {occupiedTag ? <Box size={14} style={{ color: isSelected ? 'white' : 'var(--text-main)' }} /> : ''}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div >
    );
};


// Custom Dropdown for Mouse Selection (Sire/Dam) to style ID and Tag
const MouseSelectDropdown = ({ name, options, defaultValue, customStyle = {}, settings }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState(defaultValue || '');

    useEffect(() => {
        setSelectedId(defaultValue || '');
    }, [defaultValue]);

    const selectedOption = options.find(o => o.id === selectedId);
    const selectedCage = selectedOption ? getCageDisplayTag(settings, selectedOption._roomSearch, selectedOption.cageTag) : '';
    const hasSelectedCage = selectedCage && selectedCage !== '-';

    return (
        <div style={{ position: 'relative' }} onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
        }} tabIndex={-1}>
            <input type="hidden" name={name} value={selectedId} />
            <div
                className="form-control"
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    cursor: 'pointer', 
                    background: 'var(--background)',
                    ...customStyle 
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', width: '100%', overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.7em', opacity: 0.3, color: 'var(--text-muted)', flexShrink: 0 }}>{selectedOption.id}</span>
                        <span style={{ fontWeight: 800, flexShrink: 0 }}>{selectedOption.tag && selectedOption.tag !== 'nan' ? selectedOption.tag : ''}</span>
                        {hasSelectedCage && (
                            <span style={{ fontSize: '0.72em', color: 'var(--text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '2px', opacity: 0.85 }}>
                                <Box size={10} style={{ opacity: 0.7 }} />
                                <span>{selectedCage}</span>
                            </span>
                        )}
                        <span style={{ marginLeft: 'auto', fontSize: '0.7em', color: 'var(--accent-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.9 }}>
                            {selectedOption.line && selectedOption.line !== 'nan' ? selectedOption.line : ''}
                            {selectedOption.genotype && 
                             selectedOption.genotype !== 'nan' && 
                             selectedOption.genotype !== '-' && 
                             selectedOption.genotype !== '—' && 
                             selectedOption.genotype !== 'Unknown' 
                             ? ` (${selectedOption.genotype})` : ''}
                        </span>
                    </div>
                ) : (
                    <span style={{ opacity: 0.5 }}>Select Mouse...</span>
                )}
                <ChevronDown size={14} style={{ opacity: 0.5 }} />
            </div>

            {isOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: 'var(--background)', border: '1px solid var(--glass-border)', borderRadius: '8px', marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: '220px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '8px', borderBottom: '1px solid var(--glass-border)' }}>
                        <input
                            autoFocus
                            type="text"
                            className="form-control"
                            style={{ padding: '4px 8px', fontSize: '0.8rem', height: 'auto' }}
                            placeholder="Type ID, Tag or Cage..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setSelectedId(e.target.value); // Allow typing custom ID if not found
                            }}
                        />
                    </div>
                    <div style={{ overflowY: 'auto' }}>
                        <div
                            style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)', textAlign: 'center', fontSize: '0.8rem', opacity: 0.6 }}
                            onClick={() => { setSelectedId(''); setIsOpen(false); setSearch(''); }}
                        >
                            None / Clear
                        </div>
                        {options.filter(o => {
                            const term = search.toLowerCase();
                            const cageTag = getCageDisplayTag(settings, o._roomSearch, o.cageTag);
                            return (o.tag && o.tag.toLowerCase().includes(term)) ||
                                   (o.id && o.id.toLowerCase().includes(term)) ||
                                   (cageTag && cageTag.toLowerCase().includes(term)) ||
                                   (o.cageTag && o.cageTag.toLowerCase().includes(term));
                        }).map(o => {
                            const cageDisplay = getCageDisplayTag(settings, o._roomSearch, o.cageTag);
                            const hasCage = cageDisplay && cageDisplay !== '-';
                            const isSelected = selectedId === o.id;
                            return (
                                <div
                                    key={o.id}
                                    style={{
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        borderBottom: '1px solid var(--glass-border)',
                                        background: isSelected ? 'var(--accent-primary)' : 'transparent',
                                        color: isSelected ? 'white' : 'var(--text)'
                                    }}
                                    onClick={() => {
                                        setSelectedId(o.id);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                >
                                    <span style={{ fontSize: '0.7em', opacity: 0.35, color: isSelected ? 'white' : 'var(--text-muted)', flexShrink: 0, minWidth: '42px' }}>{o.id}</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                        <span style={{ fontWeight: 800 }}>{o.tag && o.tag !== 'nan' ? o.tag : ''}</span>
                                        {hasCage && (
                                            <span style={{
                                                fontSize: '0.68rem',
                                                color: isSelected ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '3px'
                                            }}>
                                                <Box size={10} style={{ opacity: 0.7 }} />
                                                <span>{cageDisplay}</span>
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                                        {o.line && o.line !== 'nan' && <span style={{ fontSize: '0.7em', color: isSelected ? 'rgba(255,255,255,0.85)' : 'var(--accent-primary)' }}>{o.line}</span>}
                                        {o.genotype && o.genotype !== 'nan' && o.genotype !== '-' && o.genotype !== '—' && o.genotype !== 'Unknown' && (
                                            <span style={{ fontSize: '0.65rem', opacity: 0.8, fontWeight: 500, color: isSelected ? 'white' : 'var(--text)' }}>{o.genotype}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// Custom Dropdown for Multi-select Checkboxes (used in Summary View)
const MultiSelectCheckboxDropdown = ({ options, groupedOptions, selectedValues, onChange, placeholder = "Select...", data }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Helper for display
    const getFormattedTag = (fullKey) => {
        if (!fullKey || !fullKey.includes('|')) return fullKey;
        const [room, tag] = fullKey.split('|');
        return getCageDisplayTag(data?.settings, room, tag);
    };
    
    const renderOption = (o) => (
        <label
            key={o.value}
            className="checkbox-label"
            style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', margin: 0,
                cursor: 'pointer', borderRadius: '4px', fontSize: '0.8rem', width: '100%',
                background: selectedValues.includes(o.value) ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(var(--accent-rgb), 0.05)'}
            onMouseOut={(e) => e.currentTarget.style.background = selectedValues.includes(o.value) ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent'}
        >
            <input
                type="checkbox"
                checked={selectedValues.includes(o.value)}
                onChange={(e) => {
                    if (e.target.checked) onChange([...selectedValues, o.value]);
                    else onChange(selectedValues.filter(v => v !== o.value));
                }}
                style={{ margin: 0 }}
            />
            <span style={{ color: 'var(--text-main)' }}>{o.label}</span>
        </label>
    );

    return (
        <div style={{ position: 'relative' }} onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
        }} tabIndex={-1}>
            <div
                className="form-control"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'var(--background)' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '1rem', fontSize: '0.85rem' }}>
                    {selectedValues.length > 0 ? selectedValues.map(v => getFormattedTag(v)).join(', ') : <span style={{ opacity: 0.5 }}>{placeholder}</span>}
                </div>
                <ChevronDown size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
            </div>

            {isOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: 'var(--background)', border: '1px solid var(--glass-border)', borderRadius: '8px', marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                    {selectedValues.length > 0 && (
                        <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center' }}>
                            <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onChange([]); setIsOpen(false); }}
                                style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: '2px 8px', width: '100%' }}
                                onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                    <div style={{ overflowY: 'auto', padding: '0.4rem' }}>
                        {groupedOptions ? groupedOptions.map(group => (
                            <div key={group.label} style={{ marginBottom: '0.4rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', padding: '4px 8px', letterSpacing: '0.02em', opacity: 0.7 }}>
                                    {group.label}
                                </div>
                                {group.options.map(renderOption)}
                            </div>
                        )) : options?.map(renderOption)}
                    </div>
                </div>
            )}
        </div>
    );
};

const ReminderManager = ({ reminders = [], onChange }) => {
    const [newDate, setNewDate] = useState('');
    const [selectedPurpose, setSelectedPurpose] = useState('');
    const [newCustom, setNewCustom] = useState('');

    const addReminder = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        let purpose = selectedPurpose;
        if (purpose === 'Other') purpose = newCustom;
        
        if (newDate && purpose) {
            const newEntry = { date: newDate, purpose: purpose };
            onChange(prev => {
                const current = Array.isArray(prev) ? prev : [];
                return [...current, newEntry];
            });
            
            setNewDate('');
            setNewCustom('');
            setSelectedPurpose('');
        }
    };

    const list = Array.isArray(reminders) ? reminders : [];

    return (
        <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px dashed rgba(99, 102, 241, 0.3)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} /> REMINDERS
            </div>
            
            {list.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                    {list.map((r, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--background)', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                                <span style={{ fontWeight: 800 }}>{r.date}</span>
                                <span style={{ opacity: 0.8 }}>{r.purpose}</span>
                            </div>
                            <button type="button" onClick={() => onChange(prev => prev.filter((_, i) => i !== idx))} className="btn btn-ghost" style={{ padding: '0.25rem', color: 'var(--danger)', height: 'auto' }}>
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.6rem', alignItems: 'flex-end' }}>
                    <div>
                        <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>Date</label>
                        <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="form-control" style={{ fontSize: '0.8rem', height: '2rem' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>Purpose</label>
                        <select 
                            value={selectedPurpose} 
                            onChange={e => setSelectedPurpose(e.target.value)} 
                            className="form-control" 
                            style={{ fontSize: '0.8rem', height: '2rem' }}
                        >
                            <option value="">-- Select --</option>
                            <option value="Genotyping">Genotyping</option>
                            <option value="Weaning">Weaning</option>
                            <option value="Euthanasia">Euthanasia</option>
                            <option value="Tissue Collection">Tissue Collection</option>
                            <option value="Experiment">Experiment</option>
                            <option value="Health Check">Health Check</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button type="button" onClick={addReminder} className="btn btn-primary" style={{ height: '2rem', padding: '0 0.8rem', fontSize: '0.75rem' }} disabled={!newDate || !selectedPurpose}>Add</button>
                </div>
                {selectedPurpose === 'Other' && (
                    <input 
                        value={newCustom} 
                        onChange={e => setNewCustom(e.target.value)} 
                        className="form-control" 
                        style={{ marginTop: '0.5rem', fontSize: '0.8rem', height: '2rem' }} 
                        placeholder="Type custom purpose..." 
                    />
                )}
            </div>
        </div>
    );
};

export default function ManagementView({ data, onUpdate, initialSelection, onClearSelection, initialSubTab, onSubTabChange, onOpenSettings, onCloseModal, onOpenPedigree }) {
    const [activeSubTab, setActiveSubTab] = useState(initialSubTab || 'mice');
    const [summarySubTab, setSummarySubTab] = useState('active');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'tag', direction: 'asc' });
    const [selectedMice, setSelectedMice] = useState([]);
    const [selectedCages, setSelectedCages] = useState([]);
    const [selectedMatings, setSelectedMatings] = useState([]);
    const [selectedPups, setSelectedPups] = useState([]);
    const [expandedLitters, setExpandedLitters] = useState([]);

    const [showLiveOnly, setShowLiveOnly] = useState(true);
    const [showActiveMatingsOnly, setShowActiveMatingsOnly] = useState(true);
    const [showActiveLittersOnly, setShowActiveLittersOnly] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [forcedModalTab, setForcedModalTab] = useState(null);
    const [ageFormat, setAgeFormat] = useState('weeks'); // 'days', 'weeks', 'months'
    const [pendingMiceForNewCage, setPendingMiceForNewCage] = useState([]);
    const [cagesToCleanup, setCagesToCleanup] = useState([]);

    // Custom form states
    const [formRoom, setFormRoom] = useState('');
    const [formRow, setFormRow] = useState('');
    const [formCol, setFormCol] = useState('');
    const [formCageTag, setFormCageTag] = useState('');
    const [matingLineFilter, setMatingLineFilter] = useState('');
    const [miceLineFilter, setMiceLineFilter] = useState('');
    const [cageLineFilter, setCageLineFilter] = useState('');
    const [formLine, setFormLine] = useState('');
    const [miceRoomFilter, setMiceRoomFilter] = useState('');
    const [modalRoomFilter, setModalRoomFilter] = useState('');
    const [formReminders, setFormReminders] = useState([]);
    const [showColumnSettings, setShowColumnSettings] = useState(false);
    const [confirmModal, setConfirmModal] = useState(null); // { title, message, onConfirm, onCancel, confirmLabel, cancelLabel, confirmColor, cancelColor }
    const [weanAssignModal, setWeanAssignModal] = useState(null); // { pups: [], litter: {} }
    const [pedigreePopupMouseId, setPedigreePopupMouseId] = useState(null); // mouseId string, null = closed

    // Summary/Statistics Filter States
    const [summaryLine, setSummaryLine] = useState([]);
    const [summaryDOBStart, setSummaryDOBStart] = useState('');
    const [summaryDOBEnd, setSummaryDOBEnd] = useState('');
    const [summaryEndDateStart, setSummaryEndDateStart] = useState('');
    const [summaryEndDateEnd, setSummaryEndDateEnd] = useState('');
    const [summaryStatus, setSummaryStatus] = useState([]);
    const [summaryCages, setSummaryCages] = useState([]);

    // Label Print State
    const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
    const [labelsToPrint, setLabelsToPrint] = useState([]); // List of cage objects
    const [labelSettings, setLabelSettings] = useState({
        width: 10,
        height: 7,
        userName: '',
        showProject: true
    });

    const openModal = React.useCallback((item = null, forceSubTab = null) => {
        setEditingItem(item);
        // Reset states
        setFormRoom('');
        setFormRow('');
        setFormCol('');
        setFormCageTag('');
        setFormCount(1);
        setModalRoomFilter('');
        setPendingMiceForNewCage([]);
        setForcedModalTab(forceSubTab);
        setFormLine(item?.line || '');

        const currentTab = forceSubTab || activeSubTab;
        let targetCageTag = '';
        let calculatedRoomFilter = '';

        if (currentTab === 'cages' && item) {
            targetCageTag = item.tag || '';
            setFormRoom(item.room || '');
            setFormRow(item.row || '');
            setFormCol(item.col || '');
            const r = data.rooms?.find(rm => rm.name === item.room);
            calculatedRoomFilter = r?.roomName || (item.room?.includes('/') ? item.room.split('/')[0] : '');
        } else if (currentTab === 'cages') {
            targetCageTag = '';
        } else if (currentTab === 'mice') {
            targetCageTag = item?.cageTag || '';
        } else if (currentTab === 'matings') {
            // Show the female (dam) mouse's cage location, or fallback to male (sire)
            if (item?.damId) {
                const dam = data.mice?.find(m => m.id === item.damId);
                targetCageTag = dam?.cageTag || item?.cageTag || '';
            } else if (item?.sireId) {
                const sire = data.mice?.find(m => m.id === item.sireId);
                targetCageTag = sire?.cageTag || item?.cageTag || '';
            } else {
                targetCageTag = item?.cageTag || '';
            }
        } else if (currentTab === 'litters') {
            targetCageTag = item?.cageTag || '';
            if (!targetCageTag && item?.matingId) {
                const mating = data.matings?.find(m => m.id === item.matingId);
                const dam = data.mice?.find(m => m.id === mating?.damId);
                targetCageTag = dam?.cageTag || mating?.cageTag || '';
            }
        }

        setFormCageTag(targetCageTag);
        if (targetCageTag && data.cages && currentTab !== 'cages') { // Only lookup if not editing a cage itself
            const c = data.cages.find(c => String(c.tag) === String(targetCageTag));
            if (c && c.room) {
                setFormRoom(c.room);
                setFormRow(c.row || '');
                setFormCol(c.col || '');
                const r = data.rooms?.find(rm => rm.name === c.room);
                calculatedRoomFilter = r?.roomName || (c.room.includes('/') ? c.room.split('/')[0] : '');
            }
        }

        // Final safety for room filter
        if (item?.room && !calculatedRoomFilter) {
            const r = data.rooms?.find(rm => rm.name === item.room);
            calculatedRoomFilter = r?.roomName || (item.room.includes('/') ? item.room.split('/')[0] : '');
        }

        setModalRoomFilter(calculatedRoomFilter);
        setIsModalOpen(true);
    }, [activeSubTab, data.cages, data.matings, data.mice, data.rooms]);

    const handlePrintAllLabels = () => {
        const printArea = document.getElementById('printable-labels-area');
        if (!printArea) return;

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            alert("Popups are blocked. Please allow popups to print.");
            return;
        }

        const styles = `
            @page { margin: 10mm; padding: 0; }
            body { margin: 0; padding: 0; background: white; font-family: "Times New Roman", Times, serif; }
            .printable-label { 
                page-break-after: always; 
                break-after: page; 
                margin: 0 auto 10mm auto !important; 
                border: 1px solid black !important;
                box-shadow: none !important;
                background: white !important;
                box-sizing: border-box !important;
                position: relative;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            table { border-collapse: collapse; width: 100%; border-spacing: 0; table-layout: fixed; }
            th, td { border: none; padding: 2px; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        `;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Labels</title>
                <style>${styles}</style>
            </head>
            <body>
                ${printArea.innerHTML}
                <script>
                    window.onload = () => {
                        window.print();
                        setTimeout(() => window.close(), 500);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const [columnSettings, setColumnSettings] = useState(() => {
        const defaultSettings = {
            mice: {
                room: true, rack: true, cageTag: true, id: true, status: true, line: true, sex: true,
                dob: true, weaningDate: true, age: true, genotype: true,
                matingId: true, sireId: true, damId: true, comment: true, endDate: false
            },
            cages: {
                room: true, rack: true, tag: true, line: true, count: true, status: true, age: true, occupants: true, comment: true
            },
            rooms: {
                roomName: true, name: true, rows: true, cols: true
            },
            matings: {
                id: true,
                room: true,
                rack: true,
                cageTag: true,
                status: true,
                startDate: true,
                sireId: true,
                sireGenotype: true,
                damId: true,
                damGenotype: true,
                line: true,
                litters: true
            },
            litters: {
                room: true, rack: true, cage: true, parents: true,
                status: true, dob: true, weanDate: true, age: true, info: true
            }
        };
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('colony_column_settings_v13');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Deep merge ensure all keys from defaultSettings exist
                const merged = {};
                Object.keys(defaultSettings).forEach(tab => {
                    merged[tab] = { ...defaultSettings[tab], ...(parsed[tab] || {}) };
                });
                return merged;
            }
        }
        return defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('colony_column_settings_v13', JSON.stringify(columnSettings));
    }, [columnSettings]);

    const DEFAULT_COLUMN_ORDERS = {
        mice: ['room', 'rack', 'cageTag', 'id', 'status', 'line', 'sex', 'dob', 'weaningDate', 'age', 'genotype', 'matingId', 'sireId', 'damId', 'endDate', 'comment'],
        cages: ['room', 'rack', 'tag', 'line', 'count', 'status', 'age', 'occupants', 'comment'],
        rooms: ['roomName', 'name', 'rows', 'cols'],
        matings: ['id', 'room', 'rack', 'cageTag', 'status', 'startDate', 'sireId', 'sireGenotype', 'damId', 'damGenotype', 'line', 'litters'],
        litters: ['room', 'rack', 'cage', 'parents', 'status', 'dob', 'weanDate', 'age', 'info']
    };

    const [columnOrders, setColumnOrders] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('colony_column_orders_v1');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const merged = {};
                    Object.keys(DEFAULT_COLUMN_ORDERS).forEach(tab => {
                        const savedTabOrder = Array.isArray(parsed[tab]) ? parsed[tab] : [];
                        const validSaved = savedTabOrder.filter(k => DEFAULT_COLUMN_ORDERS[tab].includes(k));
                        const missing = DEFAULT_COLUMN_ORDERS[tab].filter(k => !validSaved.includes(k));
                        merged[tab] = [...validSaved, ...missing];
                    });
                    return merged;
                } catch (e) {
                    console.error('Failed to parse column orders:', e);
                }
            }
        }
        return DEFAULT_COLUMN_ORDERS;
    });

    useEffect(() => {
        localStorage.setItem('colony_column_orders_v1', JSON.stringify(columnOrders));
    }, [columnOrders]);

    const [draggedColIdx, setDraggedColIdx] = useState(null);
    const [dragOverColIdx, setDragOverColIdx] = useState(null);

    const reorderColumns = (tab, fromIdx, toIdx) => {
        if (fromIdx === null || toIdx === null || fromIdx === toIdx) return;
        const currentOrder = [...(columnOrders[tab] || DEFAULT_COLUMN_ORDERS[tab])];
        const [moved] = currentOrder.splice(fromIdx, 1);
        currentOrder.splice(toIdx, 0, moved);
        setColumnOrders(prev => ({ ...prev, [tab]: currentOrder }));
    };

    const moveColumn = (tab, index, direction) => {
        const currentOrder = [...(columnOrders[tab] || DEFAULT_COLUMN_ORDERS[tab])];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= currentOrder.length) return;
        const temp = currentOrder[index];
        currentOrder[index] = currentOrder[targetIndex];
        currentOrder[targetIndex] = temp;
        setColumnOrders(prev => ({ ...prev, [tab]: currentOrder }));
    };

    const resetColumnOrder = (tab) => {
        setColumnOrders(prev => ({ ...prev, [tab]: [...DEFAULT_COLUMN_ORDERS[tab]] }));
    };

    useEffect(() => {
        if (editingItem) {
            let initialReminders = editingItem.reminders ? [...editingItem.reminders] : [];
            // Migration: if has old single reminder fields, add to array if not already present
            if (editingItem.reminderDate && editingItem.reminderPurpose) {
                const alreadyExists = initialReminders.some(r => r.date === editingItem.reminderDate && r.purpose === editingItem.reminderPurpose);
                if (!alreadyExists) {
                    initialReminders = [...initialReminders, { date: editingItem.reminderDate, purpose: editingItem.reminderPurpose }];
                }
            }
            setFormReminders(initialReminders);
        } else {
            setFormReminders([]);
        }
    }, [editingItem]);

    useEffect(() => {
        if (initialSubTab) {
            setActiveSubTab(initialSubTab);
        }
    }, [initialSubTab]);

    useEffect(() => {
        if (initialSelection) {
            const subTab = initialSelection.type;
            setActiveSubTab(subTab);
            const item = data[subTab]?.find(i => String(i.id) === String(initialSelection.id));
            if (item) {
                openModal(item, subTab);
            }
            onClearSelection();
        }
    }, [initialSelection, data, onClearSelection, openModal]);

    // Internal hook to auto-update weanlings to stock after 7 days
    useEffect(() => {
        let isMounted = true;
        const checkAutoStock = async () => {
            if (!data.mice) return;
            const weanlings = data.mice.filter(m => (m.status === 'Weanling' || m.status === 'Weaning') && m.weaningDate);
            const today = new Date();
            let hasUpdate = false;

            for (const mouse of weanlings) {
                const wDate = new Date(mouse.weaningDate);
                const diffDays = (today - wDate) / (1000 * 60 * 60 * 24);
                if (diffDays >= 7) {
                    await fetch('/api/data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'mice', item: { ...mouse, status: 'Stock' } })
                    });
                    hasUpdate = true;
                }
            }
            if (hasUpdate && isMounted) onUpdate();
        };
        const timer = setTimeout(checkAutoStock, 2000); // Wait a bit after mount
        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [data.mice, onUpdate]);

    // Auto-cleanup empty cages after mouse actions
    useEffect(() => {
        if (cagesToCleanup.length > 0) {
            const runCleanup = async () => {
                const inactiveStates = ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred', 'Terminated', 'Inactive'];
                let deletedAny = false;
                for (const tag of cagesToCleanup) {
                    if (!tag || tag === 'nan') continue;
                    const cage = data.cages?.find(c => c.tag === tag);
                    if (!cage) continue;
                    const liveMiceInCage = data.mice?.filter(m => m.cageTag === tag && !inactiveStates.includes(m.status)) || [];
                    if (liveMiceInCage.length === 0) {
                        await fetch(`/api/data?type=cages&id=${cage.id}`, { method: 'DELETE' });
                        deletedAny = true;
                    }
                }
                setCagesToCleanup([]);
                if (deletedAny) onUpdate();
            };
            runCleanup();
        }
    }, [cagesToCleanup, data.mice, data.cages, onUpdate]);

    const handleCleanupAllCages = async () => {
        const inactiveStates = ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred', 'Terminated', 'Inactive'];
        const emptyCages = data.cages?.filter(c => {
            const liveMiceInCage = data.mice?.filter(m => m.cageTag === c.tag && !inactiveStates.includes(m.status)) || [];
            return liveMiceInCage.length === 0;
        }) || [];
        
        if (emptyCages.length === 0) {
            alert("No empty cages found.");
            return;
        }
        
        if (confirm(`Find ${emptyCages.length} empty cages. Delete them?`)) {
            for (const cage of emptyCages) {
                await fetch(`/api/data?type=cages&id=${cage.id}`, { method: 'DELETE' });
            }
            onUpdate();
        }
    };

    const subTabs = [
        { id: 'mice', label: 'Mice', icon: <MouseAnimalIcon size={24} /> },
        { id: 'cages', label: 'Cages', icon: <Box size={21} /> },
        { id: 'matings', label: 'Matings', icon: <Heart size={21} /> },
        { id: 'litters', label: 'Litters', icon: <PupAnimalIcon size={17} /> },
        { id: 'rooms', label: 'Rooms & Racks', icon: <MapPin size={21} /> },
        { id: 'strains', label: 'Mouseline', icon: <ChevronRight size={21} /> }
    ];

    const [formCount, setFormCount] = useState(1);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        // Split by either '-' or '/' to support different browser formats
        const parts = dateString.split(/[-/]/);
        if (parts.length !== 3) return dateString;
        
        const format = data.settings?.displayDateFormat || 'YYYY-MM-DD';
        // Basic normalization: handle both YYYY-MM-DD and MM/DD/YYYY if parts[0] is not 4 digits
        let YYYY, MM, DD;
        if (parts[0].length === 4) {
            YYYY = parts[0];
            MM = parts[1];
            DD = parts[2];
        } else if (parts[2].length === 4) {
            YYYY = parts[2];
            MM = parts[0];
            DD = parts[1];
        } else {
            return dateString;
        }

        const YY = YYYY.slice(-2);
        return format
            .replace('YYYY', YYYY)
            .replace('YY', YY)
            .replace('MM', MM)
            .replace('DD', DD);
    };



    const getAge = (dobString, format, endDateString) => {
        if (!dobString) return '-';
        
        // Safari safe date parsing
        const parseDateSafe = (str) => {
            const p = str.split(/[-/]/);
            if (p.length === 3) {
                return p[0].length === 4 ? new Date(p[0], p[1] - 1, p[2]) : new Date(p[2], p[0] - 1, p[1]);
            }
            return new Date(str);
        };

        const dob = parseDateSafe(dobString);
        if (isNaN(dob)) return '-';

        // Use endDate if available, otherwise use today
        let refDate = new Date();
        if (endDateString) {
            const ed = parseDateSafe(endDateString);
            if (!isNaN(ed)) refDate = ed;
        }

        const diffDays = Math.floor((refDate - dob) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return '-';
        if (format === 'days') return `${diffDays}d`;
        if (format === 'weeks') return `${(diffDays / 7).toFixed(1)}w`;
        if (format === 'months') return `${(diffDays / 30.4).toFixed(1)}m`;
        return '-';
    };

    const getScheduledWeanDate = (dobString) => {
        if (!dobString) return '-';
        const dob = new Date(dobString);
        if (isNaN(dob)) return '-';
        const target = new Date(dob);
        target.setDate(target.getDate() + 21);
        const y = target.getFullYear();
        const m = String(target.getMonth() + 1).padStart(2, '0');
        const d = String(target.getDate()).padStart(2, '0');
        return formatDate(`${y}-${m}-${d}`);
    };

    const toggleLitterExpansion = (litterId) => {
        setExpandedLitters(prev =>
            prev.includes(litterId) ? prev.filter(id => id !== litterId) : [...prev, litterId]
        );
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setPendingMiceForNewCage([]);
        setForcedModalTab(null);
        if (onCloseModal) onCloseModal();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentType = forcedModalTab || activeSubTab;

        if (currentType === 'mice') {
            const baseItem = Object.fromEntries(formData.entries());
            baseItem.cageTag = formCageTag;
            baseItem.reminders = formReminders;
            // Explicitly clear legacy fields
            baseItem.reminderDate = null;
            baseItem.reminderPurpose = null;

            const count = parseInt(baseItem.count, 10) || 1;
            delete baseItem.count;

            if (editingItem?.cageTag) {
                const isMoving = formCageTag !== editingItem.cageTag;
                const isInactive = ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(baseItem.status || editingItem.status);
                if (isMoving || isInactive) {
                    setCagesToCleanup([editingItem.cageTag]);
                }
            }

            // Auto-create cage if needed
            if (formCageTag && formRow && formCol) {
                const cageExists = data.cages?.some(c => c.tag === formCageTag);
                if (!cageExists) {
                    await fetch('/api/data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'cages', item: { tag: formCageTag, room: formRoom, row: formRow, col: formCol } })
                    });
                }
            }

            for (let i = 0; i < count; i++) {
                let item = { ...baseItem };
                if (editingItem && count === 1) {
                    // Merge with existing but remove legacy 'state'
                    item = { ...editingItem, ...baseItem };
                    delete item.state;
                }
                await fetch('/api/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'mice', item })
                });
            }
        } else {
            const item = Object.fromEntries(formData.entries());
            item.reminders = formReminders;
            // Explicitly clear legacy fields
            item.reminderDate = null;
            item.reminderPurpose = null;

            if (currentType === 'rooms') {
                // Combine RoomName and RackName for unique identification if needed, 
                // but keep them as separate fields too.
                const rName = item.roomName;
                const rackName = item.name;
                item.name = `${rName}/${rackName}`;
            }
            if (currentType === 'cages') {
                if (!formRoom) {
                    alert("Please select Room and Rack for the cage.");
                    return;
                }
                item.room = formRoom;
                item.row = formRow;
                item.col = formCol;

                // Sync: If renaming a cage tag OR moving it to another room, update all references in other tables
                if (editingItem && (editingItem.tag !== item.tag || editingItem.room !== item.room)) {
                    const oldTag = editingItem.tag;
                    const newTag = item.tag;
                    const oldRoom = editingItem.room;
                    const newRoom = item.room;

                    // Update Mice
                    const miceToUpdate = data.mice?.filter(m => String(m.cageTag) === String(oldTag) && m._roomSearch === oldRoom) || [];
                    for (const m of miceToUpdate) {
                        await fetch('/api/data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: 'mice', item: { ...m, cageTag: newTag, _roomSearch: newRoom } })
                        });
                    }

                    // Update Matings
                    const matingsToUpdate = data.matings?.filter(m => String(m.cageTag) === String(oldTag) && m._roomSearch === oldRoom) || [];
                    for (const m of matingsToUpdate) {
                        await fetch('/api/data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: 'matings', item: { ...m, cageTag: newTag, _roomSearch: newRoom } })
                        });
                    }

                    // Update Litters
                    const littersToUpdate = data.litters?.filter(l => String(l.cageTag) === String(oldTag) && l._roomSearch === oldRoom) || [];
                    for (const l of littersToUpdate) {
                        await fetch('/api/data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: 'litters', item: { ...l, cageTag: newTag, _roomSearch: newRoom } })
                        });
                    }
                }
            }
            if (editingItem) item.id = editingItem.id;

            if (currentType === 'matings' || currentType === 'litters') {
                let finalCageTag = formCageTag;
                if (!finalCageTag) {
                    if (currentType === 'matings') {
                        // Inherit from Dam's cage if mating cage is not specified
                        const damFound = data.mice?.find(m => m.id === item.damId);
                        if (damFound?.cageTag) {
                            finalCageTag = damFound.cageTag;
                        }
                    } else if (currentType === 'litters') {
                        // Inherit from Mating's cage if litter cage is not specified
                        const matingFound = data.matings?.find(m => m.id === item.matingId);
                        if (matingFound?.cageTag) {
                            finalCageTag = matingFound.cageTag;
                        }
                    }
                }
                item.cageTag = finalCageTag;
                // Auto-create cage if needed
                if (finalCageTag && formRow && formCol) {
                    const cageExists = data.cages?.some(c => c.tag === finalCageTag);
                    if (!cageExists) {
                        await fetch('/api/data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: 'cages', item: { tag: finalCageTag, room: formRoom, row: formRow, col: formCol } })
                        });
                    }
                }
            }
            const res = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: currentType, item })
            });

            if (res.ok && currentType === 'litters') {
                const litterRes = await res.json();
                const updatedLitters = litterRes.db?.litters || [];
                const updatedMatings = litterRes.db?.matings || [];
                const savedItem = updatedLitters.find(l => l.id === item.id) || (editingItem?.id ? null : updatedLitters[updatedLitters.length - 1]);
                const matingId = item.matingId || savedItem?.matingId;

                // Dam: Pregnant -> Nursing when a litter (pups) is recorded
                const litterStatus = (item.status || 'Nursing').toLowerCase();
                if (matingId && litterStatus !== 'weaned' && litterStatus !== 'inactive') {
                    const litterMating = updatedMatings.find(m => m.id === matingId);
                    const litterDam = (litterRes.db?.mice || data.mice || []).find(m => m.id === litterMating?.damId);
                    if (litterDam && (litterDam.status || litterDam.state || '').toLowerCase() === 'pregnant') {
                        await fetch('/api/data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: 'mice', item: { ...litterDam, status: 'Nursing' } })
                        });
                    }
                }

                // Sync with sibling litters for the same mating
                if (matingId && item.status === 'Inactive') {
                    const siblingLitters = updatedLitters.filter(l => l.matingId === matingId);
                    const anyNursing = siblingLitters.some(l => l.status === 'Active');

                    if (!anyNursing) {
                        const targetMating = updatedMatings.find(m => m.id === matingId);
                        if (targetMating && targetMating.status !== 'Inactive') {
                            const updatedMating = {
                                ...targetMating,
                                status: 'Inactive',
                                endDate: item.endDate || new Date().toISOString().split('T')[0]
                            };
                            await fetch('/api/data', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ type: 'matings', item: updatedMating })
                            });
                        }
                    }
                }
            }

            if (res.ok && currentType === 'matings') {
                const matingRes = await res.json();
                const lastMatingId = matingRes.db?.matings?.slice(-1)[0]?.id || item.id;

                // Check if user wants to move mice to the mating cage
                let moveMiceToMatingCage = false;
                if (!editingItem && item.cageTag) {
                    const sireFound = data.mice?.find(m => m.id === item.sireId);
                    const damFound = data.mice?.find(m => m.id === item.damId);
                    if (sireFound || damFound) {
                        const targetCage = data.cages?.find(c => c.tag === item.cageTag);
                        let roomInfo = '';
                        if (targetCage) {
                            const roomObj = data.rooms?.find(r => r.name === targetCage.room);
                            const rName = roomObj?.roomName || (targetCage.room?.includes('/') ? targetCage.room.split('/')[0] : targetCage.room) || '';
                            const rackName = (targetCage.room?.includes('/') ? targetCage.room.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '';
                            roomInfo = `${rName ? `Room: ${rName}, ` : ''}${rackName ? `Rack: ${rackName}, ` : ''}`;
                        } else if (formRoom) {
                            const rName = modalRoomFilter || (formRoom.includes('/') ? formRoom.split('/')[0] : '');
                            const rackName = formRoom.includes('/') ? formRoom.split('/')[1] : (modalRoomFilter ? formRoom : '');
                            roomInfo = `${rName ? `Room: ${rName}, ` : ''}${rackName ? `Rack: ${rackName}, ` : ''}`;
                        }
                        
                        if (confirm(`Move Sire and Dam to the mating cage (${roomInfo}Cage: ${item.cageTag})?`)) {
                            moveMiceToMatingCage = true;
                        }
                    }
                }

                // If mating is set to Inactive, check if sire/dam should return to Stock
                const isInactive = item.status === 'Inactive';

                // Update Sire and Dam
                const sire = data.mice?.find(m => m.id === item.sireId);
                const dam = data.mice?.find(m => m.id === item.damId);

                if (sire) {
                    const updateData = { ...sire };
                    let changed = false;

                    // Always update matingId for context
                    if (!editingItem || !isInactive) {
                        updateData.matingId = lastMatingId;
                        changed = true;
                    }

                    // Move to mating cage if confirmed
                    if (moveMiceToMatingCage) {
                        updateData.cageTag = item.cageTag;
                        changed = true;
                    }

                    // Set to Mating if new active mating
                    if (!editingItem && !isInactive) {
                        updateData.status = 'Mating';
                        changed = true;
                    }

                    // If mating ended, return to Stock if they are currently marked as Mating/Nursing and not in other active matings
                    if (isInactive && (sire.status === 'Mating' || sire.status === 'Nursing')) {
                        const otherActive = data.matings?.filter(m => m.id !== (editingItem?.id || item.id) && m.status !== 'Inactive') || [];
                        const hasOther = otherActive.some(m => m.sireId === sire.id || m.damId === sire.id);
                        if (!hasOther) {
                            updateData.status = 'Stock';
                            changed = true;
                        }
                    }

                    if (changed) {
                        await fetch('/api/data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: 'mice', item: updateData })
                        });
                    }
                }

                if (dam) {
                    const updateData = { ...dam };
                    let changed = false;

                    if (!editingItem || !isInactive) {
                        updateData.matingId = lastMatingId;
                        changed = true;
                    }

                    // Move to mating cage if confirmed
                    if (moveMiceToMatingCage) {
                        updateData.cageTag = item.cageTag;
                        changed = true;
                    }

                    // Set to Mating if new active mating
                    if (!editingItem && !isInactive) {
                        updateData.status = 'Mating';
                        changed = true;
                    }

                    if (isInactive && (dam.status === 'Mating' || dam.status === 'Nursing')) {
                        const otherActive = data.matings?.filter(m => m.id !== (editingItem?.id || item.id) && m.status !== 'Inactive') || [];
                        const hasOther = otherActive.some(m => m.sireId === dam.id || m.damId === dam.id);
                        if (!hasOther) {
                            updateData.status = 'Stock';
                            changed = true;
                        }
                    }

                    if (changed) {
                        await fetch('/api/data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: 'mice', item: updateData })
                        });
                    }
                }
            }

            if (res.ok && currentType === 'cages' && !editingItem && pendingMiceForNewCage.length > 0) {
                const targetCageTag = item.tag;
                const targetRoom = item.room || formRoom; // 新しいケージの部屋情報
                for (const mouseId of pendingMiceForNewCage) {
                    const mouse = data.mice?.find(m => m.id === mouseId);
                    if (mouse) {
                        await fetch('/api/data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: 'mice', item: { ...mouse, cageTag: targetCageTag, _roomSearch: targetRoom } })
                        });
                    }
                }
                setPendingMiceForNewCage([]);
                setSelectedMice([]);
            }

            // NOTE: Mouse (pup) records are NOT auto-generated here.
            // Use "Generate Initial Records" button in the Litters tab to create pup records explicitly.
        }

        closeModal();
        onUpdate();
    };

    const handleDelete = async (type, id) => {
        let confirmMsg = `Are you sure you want to delete this ${type} record?`;
        let pupsToDelete = [];
        let cageTagsToCleanup = [];

        if (type === 'litters') {
            pupsToDelete = data.mice?.filter(m => m.litterId === id) || [];
            if (pupsToDelete.length > 0) {
                confirmMsg = `Are you sure you want to delete this litter and its ${pupsToDelete.length} pup records?`;
            }
        }

        if (!confirm(confirmMsg)) return;

        if (type === 'mice') {
            const mouse = data.mice?.find(m => m.id === id);
            if (mouse?.cageTag) cageTagsToCleanup.push(mouse.cageTag);
        } else if (type === 'litters') {
            pupsToDelete.forEach(p => {
                if (p.cageTag && !cageTagsToCleanup.includes(p.cageTag)) cageTagsToCleanup.push(p.cageTag);
            });
            // Delete associated pups first
            for (const pup of pupsToDelete) {
                await fetch(`/api/data?type=mice&id=${pup.id}`, { method: 'DELETE' });
            }
        }

        const res = await fetch(`/api/data?type=${type}&id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            await onUpdate();
            if (cageTagsToCleanup.length > 0) setCagesToCleanup(cageTagsToCleanup);
        }
    };

    const handleAddMatingFromSelection = () => {
        if (selectedMice.length === 0) return;
        const items = data.mice.filter(m => selectedMice.includes(m.id));
        const male = items.find(m => m.sex === '♂' || m.sex === 'Male');
        const female = items.find(m => m.sex === '♀' || m.sex === 'Female');

        setEditingItem({
            sireId: male?.id || '',
            damId: female?.id || '',
            startDate: new Date().toISOString().split('T')[0]
        });
        setActiveSubTab('matings');
        setIsModalOpen(true);
        setSelectedMice([]);
    };

    const handleBulkDeleteMice = async () => {
        if (selectedMice.length === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedMice.length} selected mouse records?`)) return;

        const cageTagsToCleanup = [];
        for (const id of selectedMice) {
            const mouse = data.mice?.find(m => m.id === id);
            if (mouse?.cageTag && !cageTagsToCleanup.includes(mouse.cageTag)) {
                cageTagsToCleanup.push(mouse.cageTag);
            }
            await fetch(`/api/data?type=mice&id=${id}`, { method: 'DELETE' });
        }

        if (cageTagsToCleanup.length > 0) {
            await onUpdate();
            setCagesToCleanup(cageTagsToCleanup);
        } else {
            onUpdate();
        }
        setSelectedMice([]);
    };

    const bulkMoveMiceToCage = async (mouseIds, targetCageTagComposite) => {
        if (!targetCageTagComposite) return;
        // composite key format: "tag|room"
        const [targetCageTag, targetRoom] = targetCageTagComposite.includes('|')
            ? targetCageTagComposite.split('|')
            : [targetCageTagComposite, data.cages?.find(c => c.tag === targetCageTagComposite)?.room || ''];
        const displayLabel = targetCageTag;
        if (!confirm(`Move ${mouseIds.length} selected mice to cage ${displayLabel}?`)) return;
        const items = data.mice.filter(m => mouseIds.includes(m.id));
        const oldCageTags = [...new Set(items.map(m => m.cageTag))];
        for (const mouse of items) {
            let updatedComment = mouse.comment;
            if (bulkComment) {
                updatedComment = updatedComment ? `${updatedComment}; ${bulkComment}` : bulkComment;
            }
            await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'mice', item: { ...mouse, cageTag: targetCageTag, _roomSearch: targetRoom, comment: updatedComment } })
            });
        }
        setSelectedMice([]);
        setBulkComment('');
        await onUpdate();
        setCagesToCleanup(oldCageTags);
    };

    const bulkUpdateMiceStatus = async (mouseIds, newStatus, bulkComment, bulkEndDate) => {
        if (!newStatus) return;
        if (!confirm(`Update ${mouseIds.length} selected mice to status "${newStatus}"?`)) return;
        const items = data.mice.filter(m => mouseIds.includes(m.id));
        const currentCageTags = [...new Set(items.map(m => m.cageTag))];
        for (const mouse of items) {
            const updatedComment = bulkComment
                ? (mouse.comment ? `${mouse.comment}; ${bulkComment}` : bulkComment)
                : mouse.comment;

            const updateData = { ...mouse, status: newStatus, comment: updatedComment };
            
            if (bulkEndDate) {
                updateData.endDate = bulkEndDate;
            }

            await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'mice', item: updateData })
            });
        }
        setSelectedMice([]);
        setBulkComment('');
        await onUpdate();
        setCagesToCleanup(currentCageTags);
    };

    const bulkUpdateMiceFields = async (mouseIds, fields) => {
        if (Object.keys(fields).length === 0 && !bulkComment) return;
        const fieldNames = Object.keys(fields).length > 0 ? Object.keys(fields).join(' and ') : 'Comment';
        if (!confirm(`Update ${fieldNames} for ${mouseIds.length} selected mice?`)) return;
        
        const items = data.mice.filter(m => mouseIds.includes(m.id));
        for (const mouse of items) {
            let updatedComment = mouse.comment;
            if (bulkComment) {
                updatedComment = updatedComment ? `${updatedComment}; ${bulkComment}` : bulkComment;
            }
            const updateData = { ...mouse, ...fields, comment: updatedComment };
            await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'mice', item: updateData })
            });
        }
        setSelectedMice([]);
        setBulkLine('');
        setBulkGenotype('');
        setBulkComment('');
        onUpdate();
    };

    const handleAddMatingFromSelectedMice = () => {
        if (selectedMice.length === 0) return;
        const selectedMiceObjects = data.mice?.filter(m => selectedMice.includes(m.id)) || [];
        const males = selectedMiceObjects.filter(m => m.sex === '♂' || m.sex === 'Male');
        const females = selectedMiceObjects.filter(m => m.sex === '♀' || m.sex === 'Female');

        const sire = males[0];
        const dam = females[0];
        const commonLine = dam?.line || sire?.line || '';
        const today = new Date().toISOString().split('T')[0];

        const initialMating = {
            sireId: sire?.id || '',
            damId: dam?.id || '',
            line: commonLine,
            startDate: today,
            status: 'Active',
            cageTag: dam?.cageTag || sire?.cageTag || '',
            room: dam?._roomSearch || sire?._roomSearch || ''
        };

        openModal(initialMating, 'matings');
    };

    const handleExportCSV = () => {
        let itemsToExport = [];
        
        if (activeSubTab === 'summary') {
            itemsToExport = (data.mice || []).filter(m => {
                const mStatus = m.status || m.state;
                if (summaryLine && m.line !== summaryLine) return false;
                if (summaryStatus && mStatus !== summaryStatus) return false;
                if (summaryDOBStart && m.dob && m.dob < summaryDOBStart) return false;
                if (summaryDOBEnd && m.dob && m.dob > summaryDOBEnd) return false;
                if (summaryEndDateStart && m.endDate && m.endDate < summaryEndDateStart) return false;
                if (summaryEndDateEnd && m.endDate && m.endDate > summaryEndDateEnd) return false;
                if ((summaryEndDateStart || summaryEndDateEnd) && !m.endDate) return false;
                return true;
            });
        } else {
            itemsToExport = sortedData(data[activeSubTab]);
            if (activeSubTab === 'mice' && showLiveOnly) {
                itemsToExport = itemsToExport.filter(m => {
                    const s = m.status;
                    return !['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(s);
                });
            }
        }
        
        if (!itemsToExport.length) return;

        let csvContent = "";

        const getMouseInfoExport = (id) => data.mice?.find(x => x.id === id) || { id, tag: '' };

        if (activeSubTab === 'matings') {
            const keys = ['Mating ID', 'Room', 'Rack', 'Cage', 'Status', 'Setup date', 'End date', 'Sire ID', 'Sire Tag', 'Dam ID', 'Dam Tag', 'Litters'];
            csvContent = [
                keys.join(','),
                ...itemsToExport.map(item => {
                    const cage = data.cages?.find(c => c.tag === item.cageTag);
                    const roomObj = cage ? data.rooms?.find(r => r.name === cage.room) : null;
                    const room = roomObj?.roomName || (cage?.room?.includes('/') ? cage.room.split('/')[0] : cage?.room) || '-';
                    const rack = (cage?.room?.includes('/') ? cage.room.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '-';

                    const sire = getMouseInfoExport(item.sireId);
                    const dam = getMouseInfoExport(item.damId);
                    const sireTag = sire.tag && sire.tag !== 'nan' ? sire.tag : '';
                    const damTag = dam.tag && dam.tag !== 'nan' ? dam.tag : '';

                    const matingLitters = data.litters?.filter(l => l.matingId === item.id) || [];
                    const littersDisplay = matingLitters.map(l => {
                        const pupsCount = data.mice?.filter(p => p.litterId === l.id).length || 0;
                        return `${l.dob} (${pupsCount}p)`;
                    }).join('; ');

                    const rowData = [
                        item.id,
                        room,
                        rack,
                        item.cageTag || '-',
                        item.status || 'Active',
                        item.startDate || '',
                        item.endDate || '',
                        sire.id || '',
                        sireTag,
                        dam.id || '',
                        damTag,
                        littersDisplay
                    ];
                    return rowData.map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(',');
                })
            ].join('\n');
        } else if (activeSubTab === 'litters') {
            const keys = ['Litter ID', 'Room', 'Rack', 'Cage', 'Sire ID', 'Sire Tag', 'Dam ID', 'Dam Tag', 'Status', 'Setup date', 'End date', 'Info'];
            csvContent = [
                keys.join(','),
                ...itemsToExport.map(item => {
                    const m = data.matings?.find(x => x.id === item.matingId);
                    const targetCageTag = item.cageTag || m?.cageTag;
                    const cage = data.cages?.find(c => c.tag === targetCageTag);
                    const roomObj = cage ? data.rooms?.find(r => r.name === cage.room) : null;
                    const room = roomObj?.roomName || (cage?.room?.includes('/') ? cage.room.split('/')[0] : cage?.room) || '-';
                    const rack = (cage?.room?.includes('/') ? cage.room.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '-';

                    let sireId = '', sireTag = '', damId = '', damTag = '';
                    if (m) {
                        const sire = getMouseInfoExport(m.sireId);
                        const dam = getMouseInfoExport(m.damId);
                        sireId = sire.id || '';
                        sireTag = sire.tag && sire.tag !== 'nan' ? sire.tag : '';
                        damId = dam.id || '';
                        damTag = dam.tag && dam.tag !== 'nan' ? dam.tag : '';
                    }

                    const pups = data.mice?.filter(mouse => mouse.litterId === item.id) || [];
                    const infoStr = `Count: ${item.count || pups.length}${item.comment ? ` | Note: ${item.comment}` : ''}`;

                    const rowData = [
                        item.id || item.matingId || '',
                        room,
                        rack,
                        targetCageTag || '-',
                        sireId,
                        sireTag,
                        damId,
                        damTag,
                        item.status || 'Active',
                        item.dob || '',
                        item.endDate || '',
                        infoStr
                    ];
                    return rowData.map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(',');
                })
            ].join('\n');
        } else if (activeSubTab === 'cages') {
            const keys = ['Cage ID', 'Room', 'Rack', 'Cage Tag', 'Mouse Count'];
            csvContent = [
                keys.join(','),
                ...itemsToExport.map(item => {
                    const roomObj = data.rooms?.find(r => r.name === item.room);
                    const room = roomObj?.roomName || (item.room?.includes('/') ? item.room.split('/')[0] : item.room) || '-';
                    const rack = (item.room?.includes('/') ? item.room.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '-';

                    const miceInCage = data.mice?.filter(m => m.cageTag === item.tag) || [];

                    const rowData = [
                        item.id,
                        room,
                        rack,
                        item.tag || '-',
                        miceInCage.length
                    ];
                    return rowData.map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(',');
                })
            ].join('\n');
        } else if (activeSubTab === 'summary') {
            const keys = ['ID/Tag', 'ID', 'Line', 'DOB', 'End Date', 'Status', 'Sex', 'Genotype', 'Comment'];
            csvContent = [
                keys.join(','),
                ...itemsToExport.map(item => {
                    const rowSex = item.sex === '♂' || item.sex === 'Male' ? 'Male' : (item.sex === '♀' || item.sex === 'Female' ? 'Female' : (item.sex || ''));
                    const rowData = [
                        item.tag || '',
                        item.id,
                        item.line || '',
                        item.dob || '',
                        item.endDate || '',
                        item.status || '',
                        rowSex,
                        item.genotype || '',
                        item.comment || ''
                    ];
                    return rowData.map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(',');
                })
            ].join('\n');
        } else if (activeSubTab === 'mice') {
            const keys = ['ID/Tag', 'ID', 'Line', 'Status', 'Sex', 'DOB', 'Weaning Date', 'Genotype', 'Room', 'Rack', 'Cage Tag', 'Sire ID', 'Dam ID', 'Mating ID', 'Comment'];
            csvContent = [
                keys.join(','),
                ...itemsToExport.map(item => {
                    const cage = data.cages?.find(c => c.tag === item.cageTag);
                    const roomName = cage?.room || item.room;
                    const roomObj = data.rooms?.find(r => r.name === roomName);
                    const displayRoom = roomObj?.roomName || (roomName?.includes('/') ? roomName.split('/')[0] : roomName) || '-';
                    const displayRack = (roomName?.includes('/') ? roomName.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '-';

                    const rowSex = item.sex === '♂' || item.sex === 'Male' ? 'Male' : (item.sex === '♀' || item.sex === 'Female' ? 'Female' : (item.sex || ''));

                    const rowData = [
                        item.tag || '',
                        item.id,
                        item.line || '',
                        item.status || '',
                        rowSex,
                        item.dob || '',
                        item.weaningDate || '',
                        item.genotype || '',
                        displayRoom,
                        displayRack,
                        item.cageTag || '',
                        item.sireId || '',
                        item.damId || '',
                        item.matingId || '',
                        item.comment || ''
                    ];
                    return rowData.map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(',');
                })
            ].join('\n');
        } else {
            const allKeysSet = new Set();
            itemsToExport.forEach(item => {
                Object.keys(item).forEach(k => {
                    if (k !== 'id' && k !== 'taskId') allKeysSet.add(k);
                });
            });
            const keys = ['id', ...Array.from(allKeysSet)];

            csvContent = [
                keys.join(','),
                ...itemsToExport.map(item => keys.map(k => {
                    let val = item[k] || '';
                    if (k === 'sex') {
                        if (val === '♂' || val === 'Male') val = 'Male';
                        else if (val === '♀' || val === 'Female') val = 'Female';
                    }
                    return `"${val.toString().replace(/"/g, '""')}"`;
                }).join(','))
            ].join('\n');
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        
        const now = new Date();
        const dateStr = now.getFullYear().toString() + 
                        (now.getMonth() + 1).toString().padStart(2, '0') + 
                        now.getDate().toString().padStart(2, '0');
        const timeStr = now.getHours().toString().padStart(2, '0') + 
                        now.getMinutes().toString().padStart(2, '0');
        
        link.download = `colony_export_${activeSubTab}_${dateStr}-${timeStr}.csv`;
        link.click();
    };

    const handleCreateLitter = (matingId) => {
        const newItem = { matingId, count: 1, dob: '' };
        openModal(newItem, 'litters');
    };

    const generatePupsForLitter = async (litter) => {
        const count = parseInt(litter.count, 10) || 1;
        const mating = data.matings?.find(m => m.id === litter.matingId);
        const dam = data.mice?.find(m => m.id === mating?.damId);
        const pupCageTag = dam?.cageTag || litter.cageTag || mating?.cageTag || '';
        const pupRoomSearch = dam?._roomSearch || litter._roomSearch || mating?._roomSearch || '';
        const pupBase = {
            litterId: litter.id,
            matingId: litter.matingId,
            dob: litter.dob,
            status: 'Nursing',
            sex: 'Unknown',
            sireId: mating?.sireId || '',
            damId: mating?.damId || '',
            cageTag: pupCageTag,
            _roomSearch: pupRoomSearch,
            line: mating?.line || litter.line || ''
        };

        for (let i = 0; i < count; i++) {
            await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'mice', item: pupBase })
            });
        }
        onUpdate();
    };

    const addSinglePupToLitter = async (litter) => {
        const mating = data.matings?.find(m => m.id === litter.matingId);
        const dam = data.mice?.find(m => m.id === mating?.damId);
        const pupCageTag = dam?.cageTag || litter.cageTag || mating?.cageTag || '';
        const pupRoomSearch = dam?._roomSearch || litter._roomSearch || mating?._roomSearch || '';
        const pup = {
            litterId: litter.id,
            matingId: litter.matingId,
            dob: litter.dob,
            status: 'Nursing',
            sex: 'Unknown',
            sireId: mating?.sireId || '',
            damId: mating?.damId || '',
            cageTag: pupCageTag,
            _roomSearch: pupRoomSearch,
            line: mating?.line || litter.line || ''
        };
        await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'mice', item: pup })
        });
        onUpdate();
    };


    const deletePup = async (pupId) => {
        if (!confirm('Delete this pup record?')) return;
        await fetch(`/api/data?type=mice&id=${pupId}`, { method: 'DELETE' });
        onUpdate();
    };

    const bulkUpdatePups = async (pups, updates) => {
        for (const pup of pups) {
            await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'mice', item: { ...pup, ...updates } })
            });
        }
        onUpdate();
    };

    const handleWeanLitter = async (litter) => {
        setConfirmModal({
            title: "Wean Litter",
            message: `Wean this litter? All pups will be marked as 'Weaning' and the litter record will be marked 'Weaned'.`,
            confirmLabel: "OK",
            cancelLabel: "Cancel",
            onConfirm: async () => {
                const today = new Date().toISOString().split('T')[0];

                // 1. Update Litter status
                await fetch('/api/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'litters',
                        item: { ...litter, status: 'Weaned', endDate: today }
                    })
                });

                // 2. Update all pups to Weanling
                const pups = data.mice?.filter(m => m.litterId === litter.id) || [];
                for (const pup of pups) {
                    await fetch('/api/data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 'mice',
                            item: { ...pup, status: 'Weanling', weaningDate: today }
                        })
                    });
                }

                // 3. Automatically end this mating and return parents to Stock if no other active matings
                const mating = data.matings?.find(m => m.id === litter.matingId);
                if (mating) {
                    if (mating.status !== 'Inactive') {
                        await fetch('/api/data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'matings',
                                item: { ...mating, status: 'Inactive', endDate: today }
                            })
                        });
                    }

                    // Check if parents are in any other active mating
                    const otherActiveMatings = data.matings?.filter(m => m.id !== mating.id && m.status !== 'Inactive') || [];

                    const sire = data.mice?.find(m => m.id === mating.sireId);
                    if (sire && (sire.status === 'Mating' || sire.status === 'Nursing')) {
                        const hasOtherMating = otherActiveMatings.some(m => m.sireId === sire.id || m.damId === sire.id);
                        if (!hasOtherMating) {
                            await fetch('/api/data', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    type: 'mice',
                                    item: { ...sire, status: 'Stock' }
                                })
                            });
                        }
                    }

                    const dam = data.mice?.find(m => m.id === mating.damId);
                    if (dam && (dam.status === 'Mating' || dam.status === 'Nursing')) {
                        const hasOtherMating = otherActiveMatings.some(m => m.sireId === dam.id || m.damId === dam.id);
                        if (!hasOtherMating) {
                            await fetch('/api/data', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    type: 'mice',
                                    item: { ...dam, status: 'Stock' }
                                })
                            });
                        }
                    }
                }

                proceedToCageChoice(pups);
            }
        });
    };

    const proceedToCageChoice = (pups) => {
        onUpdate();
        // Open the wean assignment modal for per-pup cage assignment
        setWeanAssignModal({ pups });
    };

    const handleWeanAssignConfirm = async (assignments) => {
        // assignments: [{ pupId, cageTag, roomSearch, row, col }]
        // Group by cageTag to create cages if needed
        const cageTagMap = {};
        for (const a of assignments) {
            if (!cageTagMap[a.cageTag]) {
                cageTagMap[a.cageTag] = { roomSearch: a.roomSearch, row: a.row, col: a.col, pupIds: [] };
            }
            cageTagMap[a.cageTag].pupIds.push(a.pupId);
        }

        // Create cages if they don't exist yet
        for (const [cageTag, info] of Object.entries(cageTagMap)) {
            const existingCage = data.cages?.find(c => c.tag === cageTag);
            if (!existingCage && info.roomSearch) {
                await fetch('/api/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'cages',
                        item: { tag: cageTag, room: info.roomSearch, row: info.row, col: info.col }
                    })
                });
            }
        }

        // Update each pup's cageTag and _roomSearch
        for (const a of assignments) {
            const pup = data.mice?.find(m => m.id === a.pupId);
            if (pup) {
                await fetch('/api/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'mice',
                        item: { ...pup, cageTag: a.cageTag, _roomSearch: a.roomSearch || pup._roomSearch }
                    })
                });
            }
        }

        setWeanAssignModal(null);
        onUpdate();
        setActiveSubTab('mice');
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const sortedData = (items) => {
        if (!items) return [];
        const sortableItems = [...items];
        sortableItems.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            // Custom resolution for Location-related sorting
            if (activeSubTab === 'rooms') {
                if (sortConfig.key === 'roomName') {
                    aVal = a.roomName || (a.name?.includes('/') ? a.name.split('/')[0] : a.name);
                    bVal = b.roomName || (b.name?.includes('/') ? b.name.split('/')[0] : b.name);
                } else if (sortConfig.key === 'name') {
                    // Rack Name part
                    aVal = a.name?.includes('/') ? a.name.split('/')[1] : a.name;
                    bVal = b.name?.includes('/') ? b.name.split('/')[1] : b.name;
                }
            } else if (activeSubTab === 'cages') {
                if (sortConfig.key === 'room') {
                    const roomObjA = data.rooms?.find(r => r.name === a.room);
                    const roomObjB = data.rooms?.find(r => r.name === b.room);
                    const roomA = roomObjA?.roomName || (a.room?.includes('/') ? a.room.split('/')[0] : a.room) || '';
                    const rackA = a.room?.includes('/') ? a.room.split('/')[1] : (roomObjA?.roomName ? roomObjA.name : '');
                    const roomB = roomObjB?.roomName || (b.room?.includes('/') ? b.room.split('/')[0] : b.room) || '';
                    const rackB = b.room?.includes('/') ? b.room.split('/')[1] : (roomObjB?.roomName ? roomObjB.name : '');
                    aVal = `${roomA}|${rackA}`;
                    bVal = `${roomB}|${rackB}`;
                } else if (sortConfig.key === 'count') {
                    aVal = data.mice?.filter(m => m.cageTag === a.tag && m._roomSearch === a.room).length || 0;
                    bVal = data.mice?.filter(m => m.cageTag === b.tag && m._roomSearch === b.room).length || 0;
                } else if (sortConfig.key === 'line') {
                    const getLine = (item) => {
                        const activeMice = data.mice?.filter(m => m.cageTag === item.tag && m._roomSearch === item.room && !['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(m.status)) || [];
                        return [...new Set(activeMice.map(m => m.line).filter(Boolean))].join(', ') || '-';
                    };
                    aVal = getLine(a);
                    bVal = getLine(b);
                } else if (sortConfig.key === 'status') {
                    const getStatuses = (item) => {
                        const inactiveStates = ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'];
                        const miceInCage = data.mice?.filter(m => m.cageTag === item.tag && m._roomSearch === item.room && !inactiveStates.includes(m.status)) || [];
                        const rawStatuses = [...new Set(miceInCage.map(m => m.status || 'Stock'))];
                        const hasOtherThanStock = rawStatuses.some(s => s !== 'Stock');
                        const cageStatuses = hasOtherThanStock ? rawStatuses.filter(s => s !== 'Stock') : rawStatuses;
                        return cageStatuses.join(', ');
                    };
                    aVal = getStatuses(a);
                    bVal = getStatuses(b);
                }
            } else if ((activeSubTab === 'mice' || activeSubTab === 'matings' || activeSubTab === 'litters')) {
                const mating = activeSubTab === 'litters' ? data.matings?.find(m => m.id === a.matingId) : null;
                const matingB = activeSubTab === 'litters' ? data.matings?.find(m => m.id === b.matingId) : null;
                const tagA = a.cageTag || a.cage || (activeSubTab === 'litters' ? mating?.cageTag : null);
                const tagB = b.cageTag || b.cage || (activeSubTab === 'litters' ? matingB?.cageTag : null);

                const cage = data.cages?.find(c => c.tag === tagA);
                const cageB = data.cages?.find(c => c.tag === tagB);
                const roomObjA = cage ? data.rooms?.find(r => r.name === cage.room) : null;
                const roomObjB = cageB ? data.rooms?.find(r => r.name === cageB.room) : null;

                const roomA = roomObjA?.roomName || (cage?.room?.includes('/') ? cage.room.split('/')[0] : cage?.room) || '';
                const rackA = (cage?.room?.includes('/') ? cage.room.split('/')[1] : (roomObjA?.roomName ? roomObjA.name : '')) || '';
                const roomB = roomObjB?.roomName || (cageB?.room?.includes('/') ? cageB.room.split('/')[0] : cageB?.room) || '';
                const rackB = (cageB?.room?.includes('/') ? cageB.room.split('/')[1] : (roomObjB?.roomName ? roomObjB.name : '')) || '';

                if (sortConfig.key === 'cageTag' || sortConfig.key === 'cage') {
                    aVal = `${roomA}|${rackA}|${a.cageTag || a.cage}`;
                    bVal = `${roomB}|${rackB}|${b.cageTag || b.cage}`;
                } else if (sortConfig.key === 'room') {
                    aVal = roomA;
                    bVal = roomB;
                } else if (sortConfig.key === 'rack') {
                    aVal = rackA;
                    bVal = rackB;
                } else if (sortConfig.key === 'tag' && activeSubTab === 'mice') {
                    // tag が nan や空の場合は末尾に移動
                    const aTag = a.tag && a.tag !== 'nan' ? a.tag : null;
                    const bTag = b.tag && b.tag !== 'nan' ? b.tag : null;
                    if (!aTag && !bTag) return 0;
                    if (!aTag) return 1;  // a を末尾へ
                    if (!bTag) return -1; // b を末尾へ
                    const cmp = String(aTag).localeCompare(String(bTag), undefined, { numeric: true, sensitivity: 'base' });
                    return sortConfig.direction === 'asc' ? cmp : -cmp;
                }
            } else if (activeSubTab === 'strains') {
                if (sortConfig.key === 'count') {
                    const getCount = (item) => {
                        const mList = data.mice?.filter(m => m.line === item.name) || [];
                        const isNotLive = (state) => ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(state);
                        const live = mList.filter(m => !isNotLive(m.state)).length;
                        return live * 1000000 + mList.length; // Sort by live primarily, total secondarily
                    };
                    aVal = getCount(a);
                    bVal = getCount(b);
                }
            }

            const sA = String(aVal || '');
            const sB = String(bVal || '');

            const comparison = sA.localeCompare(sB, undefined, { numeric: true, sensitivity: 'base' });

            if (comparison !== 0) {
                return sortConfig.direction === 'asc' ? comparison : -comparison;
            }

            // Secondary sort by full name or ID for stability
            const sA2 = String(a.name || a.tag || a.id || '');
            const sB2 = String(b.name || b.tag || b.id || '');
            return sA2.localeCompare(sB2, undefined, { numeric: true });
        });
        return sortableItems;
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return null;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

        // openModal logic moved up to be available for effects

    const [bulkComment, setBulkComment] = useState('');
    const [bulkStatus, setBulkStatus] = useState('');
    const [bulkEndDate, setBulkEndDate] = useState('');
    const [bulkLine, setBulkLine] = useState('');
    const [bulkGenotype, setBulkGenotype] = useState('');

    const [cageBulkStatus, setCageBulkStatus] = useState({});
    const [cageBulkDate, setCageBulkDate] = useState({});
    const [topCageBulkStatus, setTopCageBulkStatus] = useState('Experiment');
    const [topCageBulkDate, setTopCageBulkDate] = useState(new Date().toISOString().split('T')[0]);
    const [topCageBulkComment, setTopCageBulkComment] = useState('');

    const editPupInLitters = (p) => {
        setFormCount(1);
        setFormRoom('');
        setFormRow('');
        setFormCol('');
        setFormCageTag(p.cageTag || '');
        if (p.cageTag && data.cages) {
            const c = data.cages.find(c => c.tag === p.cageTag);
            if (c && c.room) {
                setFormRoom(c.room);
                setFormRow(c.row || '');
                setFormCol(c.col || '');
            }
        }
        setEditingItem(p);
        setFormLine(p.line || '');
        setForcedModalTab('mice');
        setIsModalOpen(true);
    };

    const renderForm = () => {
        const currentType = forcedModalTab || activeSubTab;
        if (currentType === 'mice') {
            return (
                <>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>ID (Auto-generated)</label>
                            <input name="id" className="form-control" defaultValue={editingItem?.id} readOnly placeholder="M0000" disabled={!editingItem && formCount === 1} style={{ opacity: 0.7 }} />
                        </div>
                        <div>
                            <label>Count (Number of mice to add)</label>
                            <input type="number" name="count" className="form-control" value={formCount} onChange={e => setFormCount(Number(e.target.value) || 1)} min="1" disabled={!!editingItem} />
                        </div>
                    </div>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Physical Tags / Ear Punches {formCount > 1 && '(will be ignored or same for all)'}</label>
                            <input name="tag" className="form-control" defaultValue={editingItem?.tag} placeholder="e.g. L-1 42" disabled={formCount > 1} />
                        </div>
                        <div>
                            <label>Sex</label>
                            <select name="sex" className="form-control" defaultValue={editingItem?.sex || '♂'}>
                                <option value="♂">♂ (Male)</option>
                                <option value="♀">♀ (Female)</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Sire (♂)</label>
                            <MouseSelectDropdown name="sireId" options={data.mice?.filter(m => (m.sex === '♂' || m.sex === 'Male') || m.id === editingItem?.sireId) || []} defaultValue={editingItem?.sireId} settings={data.settings} />
                        </div>
                        <div>
                            <label>Dam (♀)</label>
                            <MouseSelectDropdown name="damId" options={data.mice?.filter(m => (m.sex === '♀' || m.sex === 'Female') || m.id === editingItem?.damId) || []} defaultValue={editingItem?.damId} settings={data.settings} />
                        </div>
                    </div>
                    {editingItem?.id && (
                        <div className="form-group">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', border: '1px dashed var(--accent-primary)', color: 'var(--accent-primary)', borderRadius: '8px', padding: '0.5rem' }}
                                onClick={() => setPedigreePopupMouseId(editingItem.id)}
                            >
                                <GitMerge size={15} /> View Pedigree for {editingItem.tag && editingItem.tag !== 'nan' ? editingItem.tag : editingItem.id}
                            </button>
                        </div>
                    )}
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>DOB</label>
                            <input 
                                type="date" 
                                name="dob" 
                                className={`form-control ${!editingItem?.dob ? 'date-empty' : ''}`} 
                                defaultValue={editingItem?.dob || ''} 
                                key={`dob-${editingItem?.id || 'new'}`}
                                lang="en" 
                            />
                        </div>
                        <div>
                            <label>Weaning Date</label>
                            <input 
                                type="date" 
                                name="weaningDate" 
                                className={`form-control ${!editingItem?.weaningDate ? 'date-empty' : ''}`} 
                                defaultValue={editingItem?.weaningDate || ''} 
                                key={`weaning-${editingItem?.id || 'new'}`}
                                lang="en" 
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Mouseline</label>
                            <select name="line" className="form-control" defaultValue={editingItem?.line} onChange={(e) => setFormLine(e.target.value)}>
                                <option value="">-- Select Strain --</option>
                                {data.strains?.map(s => (
                                    <option key={s.id} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Genotype</label>
                            {(() => {
                                const selectedLine = data.strains?.find(s => s.name === formLine);
                                const genotypes = selectedLine?.genotypes ? selectedLine.genotypes.split(',').map(g => g.trim()).filter(Boolean) : [];
                                if (genotypes.length > 0) {
                                    return (
                                        <select name="genotype" className="form-control" defaultValue={editingItem?.genotype}>
                                            <option value="">-- Select Genotype --</option>
                                            {genotypes.map(g => <option key={g} value={g}>{g}</option>)}
                                            {!genotypes.includes(editingItem?.genotype) && editingItem?.genotype && (
                                                <option value={editingItem.genotype}>{editingItem.genotype}</option>
                                            )}
                                        </select>
                                    );
                                }
                                return <input name="genotype" className="form-control" defaultValue={editingItem?.genotype} placeholder="e.g. WT, +/-, -/-" />;
                            })()}
                        </div>
                    </div>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Status</label>
                            <select name="status" className="form-control" defaultValue={editingItem?.status || editingItem?.state || 'Stock'}>
                                <optgroup label="Active / Live">
                                    <option value="Stock">Stock</option>
                                    <option value="Mating">Mating</option>
                                    <option value="Pregnant">Pregnant</option>
                                    <option value="Nursing">Nursing</option>
                                    <option value="Weaning">Weaning</option>
                                    <option value="Experiment">Experiment</option>
                                </optgroup>
                                <optgroup label="Archive / Inactive">
                                    <option value="Euthanasia">Euthanasia</option>
                                    <option value="Tissue Collection">Tissue Collection</option>
                                    <option value="Dead">Dead</option>
                                    <option value="Missing">Missing</option>
                                    <option value="Transferred">Transferred</option>
                                </optgroup>
                            </select>
                        </div>
                        <div>
                            <label>End Date</label>
                            <input 
                                type="date" 
                                name="endDate" 
                                className="form-control" 
                                defaultValue={editingItem?.endDate} 
                                lang="en" 
                            />
                        </div>
                    </div>

                    <ReminderManager 
                        reminders={formReminders} 
                        onChange={setFormReminders} 
                    />

                    <div className="form-group" onKeyDown={(e) => e.stopPropagation()} onPaste={(e) => e.stopPropagation()}>
                        <label>Comment</label>
                        <textarea name="comment" className="form-control" defaultValue={editingItem?.comment} style={{ fontSize: '0.85rem' }} rows="2"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Mating ID</label>
                        <input name="matingId" className="form-control" defaultValue={editingItem?.matingId} placeholder="For parents" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', height: '2rem' }} />
                    </div>

                    <div style={{ background: 'rgba(5, 150, 105, 0.08)', padding: '1.2rem', borderRadius: '14px', marginBottom: '1rem', border: '1px dashed rgba(5, 150, 105, 0.3)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.8rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                            LOCATION {formCageTag && <span style={{ marginLeft: 'auto', opacity: 0.7, textTransform: 'none' }}>Current: {formCageTag}</span>}
                        </div>
                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Room</label>
                                <select className="form-control" value={modalRoomFilter} onChange={(e) => { setModalRoomFilter(e.target.value); setFormRoom(''); }}>
                                    <option value="">Select Room...</option>
                                    {[...new Set(data.rooms?.map(r => r.roomName || (r.name.includes('/') ? r.name.split('/')[0] : r.name)))]
                                        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                                        .map(roomName => (
                                            <option key={roomName} value={roomName}>{roomName}</option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label>Rack</label>
                                <select className="form-control" name="_roomSearch" value={formRoom} onChange={(e) => setFormRoom(e.target.value)}>
                                    <option value="">Select Rack...</option>
                                    {data.rooms?.filter(r => !modalRoomFilter || (r.roomName === modalRoomFilter) || (r.name.startsWith(modalRoomFilter + '/')))
                                        .sort((a, b) => {
                                            const rA = a.name.includes('/') ? a.name.split('/')[1] : a.name;
                                            const rB = b.name.includes('/') ? b.name.split('/')[1] : b.name;
                                            return rA.localeCompare(rB, undefined, { numeric: true });
                                        })
                                        .map(r => (
                                            <option key={r.id} value={r.name}>{r.name.includes('/') ? r.name.split('/')[1] : r.name}</option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        {formRoom && (
                            <div style={{ marginBottom: '1rem' }}>
                                <RackSelector
                                    data={data} roomName={formRoom}
                                    selectedCageTag={formCageTag}
                                    selectedRow={formRow}
                                    selectedCol={formCol}
                                    mode="mouse" onSelect={(res) => {
                                        const getFullTag = (t) => formRoom ? `${formRoom.replace('/', '_')}-${t}` : t;
                                        if (typeof res === 'string') {
                                            // Existing cage clicked: res is already the full cage.tag (e.g. 305A_2-B-1)
                                            setFormCageTag(res);
                                            const foundCage = data.cages?.find(c => c.tag === res);
                                            if (foundCage) {
                                                setFormRoom(foundCage.room || '');
                                                setFormRow(foundCage.row || '');
                                                setFormCol(foundCage.col || '');
                                            } else {
                                                setFormRow(''); setFormCol('');
                                            }
                                        } else {
                                            // Empty slot clicked: res.tag is a local label (e.g. B-1), needs prefix
                                            setFormCageTag(getFullTag(res.tag));
                                            setFormRow(res.r);
                                            setFormCol(res.c);
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Cage Tag {formRow && formCol && <span style={{ color: 'var(--success)', fontSize: '0.7em', float: 'right', fontWeight: 'normal' }}>*Will create new cage if tag doesn't exist</span>}</label>
                            <input name="cageTag" className="form-control" value={formCageTag} onChange={(e) => {
                                setFormCageTag(e.target.value);
                                const foundCage = data.cages?.find(c => c.tag === e.target.value);
                                if (foundCage) {
                                    setFormRoom(foundCage.room || '');
                                    setFormRow(foundCage.row || '');
                                    setFormCol(foundCage.col || '');
                                    const r = data.rooms?.find(rm => rm.name === foundCage.room);
                                    setModalRoomFilter(r?.roomName || (foundCage.room?.includes('/') ? foundCage.room.split('/')[0] : ''));
                                }
                            }} list="cage-list" placeholder="Select from rack or type here" />
                            <datalist id="cage-list">
                                {data.cages?.map((c, idx) => <option key={`${c.id || c.tag}-${idx}`} value={c.tag} />)}
                            </datalist>
                        </div>
                    </div>
                </>
            );
        }

        if (currentType === 'cages') {
            return (
                <>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Room</label>
                            <select className="form-control" value={modalRoomFilter} onChange={(e) => { setModalRoomFilter(e.target.value); setFormRoom(''); setFormRow(''); setFormCol(''); }}>
                                <option value="">Select Room...</option>
                                {[...new Set(data.rooms?.map(r => r.roomName || (r.name.includes('/') ? r.name.split('/')[0] : r.name)))]
                                    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                                    .map(roomName => (
                                        <option key={roomName} value={roomName}>{roomName}</option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label>Rack</label>
                            <select className="form-control" value={formRoom} onChange={(e) => { setFormRoom(e.target.value); setFormRow(''); setFormCol(''); }}>
                                <option value="">Select Rack...</option>
                                {data.rooms?.filter(r => !modalRoomFilter || (r.roomName === modalRoomFilter) || (r.name.startsWith(modalRoomFilter + '/')))
                                    .sort((a, b) => {
                                        const rA = a.name.includes('/') ? a.name.split('/')[1] : a.name;
                                        const rB = b.name.includes('/') ? b.name.split('/')[1] : b.name;
                                        return rA.localeCompare(rB, undefined, { numeric: true });
                                    })
                                    .map(r => (
                                        <option key={r.id} value={r.name}>{r.name.includes('/') ? r.name.split('/')[1] : r.name}</option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <RackSelector
                            data={data} roomName={formRoom}
                            selectedRow={formRow} selectedCol={formCol}
                            selectedCageTag={formCageTag}
                            onSelect={(pos) => {
                                const getFullTag = (t) => formRoom ? `${formRoom.replace('/', '_')}-${t}` : t;
                                if (typeof pos === 'string') {
                                    setFormCageTag(getFullTag(pos));
                                } else {
                                    setFormRow(pos.r);
                                    setFormCol(pos.c);
                                    if (pos.tag) setFormCageTag(getFullTag(pos.tag));
                                }
                            }}
                            mode="cage"
                        />
                    </div>

                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label>Cage Tag</label>
                        <input name="tag" className="form-control" value={formCageTag} onChange={(e) => setFormCageTag(e.target.value)} required placeholder="e.g. C-1" />
                    </div>

                    <ReminderManager 
                        reminders={formReminders} 
                        onChange={setFormReminders} 
                    />

                    <div className="form-group" onKeyDown={(e) => e.stopPropagation()} onPaste={(e) => e.stopPropagation()}>
                        <label>Comment</label>
                        <textarea name="comment" className="form-control" defaultValue={editingItem?.comment} rows="2"></textarea>
                    </div>

                    <div style={{ display: 'none' }}>
                        <input name="room" value={formRoom} readOnly />
                        <input name="row" value={formRow} readOnly />
                        <input name="col" value={formCol} readOnly />
                    </div>
                </>
            );
        }

        if (currentType === 'rooms') {
            return (
                <>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Room Name</label>
                            <input name="roomName" className="form-control" defaultValue={editingItem?.roomName || (editingItem?.name?.includes('/') ? editingItem.name.split('/')[0] : '')} required placeholder="e.g. 305A" />
                        </div>
                        <div>
                            <label>Rack ID / Name</label>
                            <input name="name" className="form-control" defaultValue={editingItem?.name?.includes('/') ? editingItem.name.split('/')[1] : editingItem?.name} required placeholder="e.g. 1" />
                        </div>
                    </div>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Rack Rows (Height)</label>
                            <input type="number" name="rows" className="form-control" defaultValue={editingItem?.rows || 5} required />
                        </div>
                        <div>
                            <label>Rack Columns (Width)</label>
                            <input type="number" name="cols" className="form-control" defaultValue={editingItem?.cols || 8} required />
                        </div>
                    </div>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Row Label Format</label>
                            <select name="rowFormat" className="form-control" defaultValue={editingItem?.rowFormat || '1'}>
                                <option value="1">1, 2, 3...</option>
                                <option value="A">A, B, C...</option>
                            </select>
                        </div>
                        <div>
                            <label>Column Label Format</label>
                            <select name="colFormat" className="form-control" defaultValue={editingItem?.colFormat || '1'}>
                                <option value="1">1, 2, 3...</option>
                                <option value="A">A, B, C...</option>
                            </select>
                        </div>
                    </div>
                </>
            );
        }

        if (currentType === 'matings') {
            return (
                <>
                    <div className="form-group">
                        <label>Mating ID</label>
                        <input name="id" className="form-control" defaultValue={editingItem?.id} readOnly placeholder="Auto-generated" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', height: '2rem', opacity: editingItem?.id ? 0.7 : 0.5 }} />
                    </div>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                            <label style={{ color: '#3b82f6', fontWeight: 800 }}>Male (♂) (Father)</label>
                            <MouseSelectDropdown 
                                name="sireId" 
                                options={data.mice?.filter(m => 
                                    (m.id === editingItem?.sireId) || (
                                        (m.sex === '♂' || m.sex === 'Male') && 
                                        ['stock', 'mating'].includes((m.status || m.state || 'stock').toLowerCase())
                                    )
                                ) || []} 
                                defaultValue={editingItem?.sireId} 
                                customStyle={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }}
                                settings={data.settings}
                            />
                        </div>
                        <div style={{ background: 'rgba(236, 72, 153, 0.05)', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
                            <label style={{ color: '#ec4899', fontWeight: 800 }}>Female (♀) (Mother)</label>
                            <MouseSelectDropdown 
                                name="damId" 
                                options={data.mice?.filter(m => 
                                    (m.id === editingItem?.damId) || (
                                        (m.sex === '♀' || m.sex === 'Female') && 
                                        ['stock', 'mating'].includes((m.status || m.state || 'stock').toLowerCase())
                                    )
                                ) || []} 
                                defaultValue={editingItem?.damId} 
                                customStyle={{ background: 'rgba(236, 72, 153, 0.1)', borderColor: 'rgba(236, 72, 153, 0.3)' }}
                                settings={data.settings}
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Mating Started Date</label>
                            <input 
                                type="date" 
                                name="startDate" 
                                className={`form-control ${!editingItem?.startDate ? 'date-empty' : ''}`} 
                                defaultValue={editingItem?.startDate || ''} 
                                key={`mstart-${editingItem?.id || 'new'}`}
                                lang="en" 
                            />
                        </div>
                        <div>
                            <label>Mating Ended Date</label>
                            <input 
                                type="date" 
                                name="endDate" 
                                className="form-control" 
                                defaultValue={editingItem?.endDate} 
                                lang="en" 
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Mouseline</label>
                        <select name="line" className="form-control" defaultValue={editingItem?.line}>
                            <option value="">-- Select Strain --</option>
                            {data.strains?.map(s => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" className="form-control" defaultValue={editingItem?.status || 'Active'}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="form-group" onKeyDown={(e) => e.stopPropagation()} onPaste={(e) => e.stopPropagation()}>
                        <label>Comment</label>
                        <textarea name="comment" className="form-control" defaultValue={editingItem?.comment} rows="2"></textarea>
                    </div>

                    <div style={{ background: 'rgba(5, 150, 105, 0.08)', padding: '1.2rem', borderRadius: '14px', marginBottom: '1rem', border: '1px dashed rgba(5, 150, 105, 0.3)' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.8rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                                LOCATION {formCageTag && <span style={{ marginLeft: 'auto', opacity: 0.7, textTransform: 'none' }}>Current: {getCageDisplayTag(data.settings, formRoom, formCageTag)}</span>}
                            </div>
                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Room Filter</label>
                                <select className="form-control" value={modalRoomFilter} onChange={(e) => { setModalRoomFilter(e.target.value); setFormRoom(''); }}>
                                    <option value="">Select Room...</option>
                                    {[...new Set(data.rooms?.map(r => r.roomName || (r.name.includes('/') ? r.name.split('/')[0] : r.name)))]
                                        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                                        .map(roomName => (
                                            <option key={roomName} value={roomName}>{roomName}</option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label>Rack</label>
                                <select className="form-control" name="_roomSearch" value={formRoom} onChange={(e) => setFormRoom(e.target.value)}>
                                    <option value="">Select Rack...</option>
                                    {data.rooms?.filter(r => !modalRoomFilter || (r.roomName === modalRoomFilter) || (r.name.startsWith(modalRoomFilter + '/'))).map(r => (
                                        <option key={r.id} value={r.name}>{r.name.includes('/') ? r.name.split('/')[1] : r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {formRoom && (
                            <div style={{ marginBottom: '1rem' }}>
                                <RackSelector
                                    data={data} roomName={formRoom}
                                    selectedCageTag={formCageTag}
                                    selectedRow={formRow}
                                    selectedCol={formCol}
                                    mode="mouse" onSelect={(res) => {
                                        const getFullTag = (t) => formRoom ? `${formRoom.replace('/', '_')}-${t}` : t;
                                        if (typeof res === 'string') {
                                            // Existing cage clicked: res is already the full cage.tag
                                            setFormCageTag(res);
                                            const foundCage = data.cages?.find(c => c.tag === res);
                                            if (foundCage) {
                                                setFormRow(foundCage.row || '');
                                                setFormCol(foundCage.col || '');
                                            } else {
                                                setFormRow(''); setFormCol('');
                                            }
                                        } else {
                                            // Empty slot clicked: res.tag is a local label, needs prefix
                                            setFormCageTag(getFullTag(res.tag));
                                            setFormRow(res.r);
                                            setFormCol(res.c);
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Cage Tag {formRow && formCol && <span style={{ color: 'var(--success)', fontSize: '0.7em', float: 'right' }}>*Will auto-create cage</span>}</label>
                            <input name="cageTag" className="form-control" value={formCageTag} onChange={(e) => {
                                setFormCageTag(e.target.value);
                                const foundCage = data.cages?.find(c => c.tag === e.target.value);
                                if (foundCage) {
                                    setFormRoom(foundCage.room || '');
                                    setFormRow(foundCage.row || '');
                                    setFormCol(foundCage.col || '');
                                    const r = data.rooms?.find(rm => rm.name === foundCage.room);
                                    setModalRoomFilter(r?.roomName || (foundCage.room?.includes('/') ? foundCage.room.split('/')[0] : ''));
                                }
                            }} list="cage-list" placeholder="Select from rack or type here" />
                            <datalist id="cage-list">
                                {data.cages?.map((c, idx) => <option key={`${c.id || c.tag}-${idx}`} value={c.tag} />)}
                            </datalist>
                        </div>
                    </div>
                </>
            );
        }

        if (currentType === 'litters') {
            return (
                <>
                    <div className="form-group">
                        <label>Mating ID</label>
                        <input name="matingId" className="form-control" defaultValue={editingItem?.matingId} />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input 
                            type="date" 
                            name="dob" 
                            className="form-control" 
                            defaultValue={editingItem?.dob} 
                            lang="en" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Number of Pups</label>
                        <input type="number" name="count" className="form-control" defaultValue={editingItem?.count} required />
                        {editingItem?.id && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>* Changing count here won't add/remove mouse records. Use pups editor above.</div>}
                    </div>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Status</label>
                            <select name="status" className="form-control" defaultValue={editingItem?.status || 'Nursing'}>
                                <option value="Nursing">Nursing</option>
                                <option value="Weaned">Weaned</option>
                            </select>
                        </div>
                        <div>
                            <label>End Date (Weaning)</label>
                            <input 
                                type="date" 
                                name="endDate" 
                                className="form-control" 
                                defaultValue={editingItem?.endDate || ''} 
                                lang="en" 
                            />
                        </div>
                    </div>

                    <ReminderManager 
                        reminders={formReminders} 
                        onChange={setFormReminders} 
                    />

                    <div className="form-group" onKeyDown={(e) => e.stopPropagation()} onPaste={(e) => e.stopPropagation()}>
                        <label>Comment</label>
                        <textarea name="comment" className="form-control" defaultValue={editingItem?.comment} rows="2"></textarea>
                    </div>

                    <div style={{ background: 'rgba(5, 150, 105, 0.08)', padding: '1.2rem', borderRadius: '14px', marginBottom: '1rem', border: '1px dashed rgba(5, 150, 105, 0.3)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.8rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                            LOCATION {formCageTag && <span style={{ marginLeft: 'auto', opacity: 0.7, textTransform: 'none' }}>Current: {formCageTag}</span>}
                        </div>
                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Room Filter</label>
                                <select className="form-control" value={modalRoomFilter} onChange={(e) => { setModalRoomFilter(e.target.value); setFormRoom(''); }}>
                                    <option value="">Select Room...</option>
                                    {[...new Set(data.rooms?.map(r => r.roomName || (r.name.includes('/') ? r.name.split('/')[0] : r.name)))]
                                        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                                        .map(roomName => (
                                            <option key={roomName} value={roomName}>{roomName}</option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label>Rack</label>
                                <select className="form-control" name="_roomSearch" value={formRoom} onChange={(e) => setFormRoom(e.target.value)}>
                                    <option value="">Select Rack...</option>
                                    {data.rooms?.filter(r => !modalRoomFilter || (r.roomName === modalRoomFilter) || (r.name.startsWith(modalRoomFilter + '/'))).map(r => (
                                        <option key={r.id} value={r.name}>{r.name.includes('/') ? r.name.split('/')[1] : r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {formRoom && (
                            <div style={{ marginBottom: '1rem' }}>
                                <RackSelector
                                    data={data} roomName={formRoom}
                                    selectedCageTag={formCageTag}
                                    selectedRow={formRow}
                                    selectedCol={formCol}
                                    mode="mouse" onSelect={(res) => {
                                        const getFullTag = (t) => formRoom ? `${formRoom.replace('/', '_')}-${t}` : t;
                                        if (typeof res === 'string') {
                                            // Existing cage clicked: res is already the full cage.tag
                                            setFormCageTag(res);
                                            const foundCage = data.cages?.find(c => c.tag === res);
                                            if (foundCage) {
                                                setFormRow(foundCage.row || '');
                                                setFormCol(foundCage.col || '');
                                            } else {
                                                setFormRow(''); setFormCol('');
                                            }
                                        } else {
                                            // Empty slot clicked: res.tag is a local label, needs prefix
                                            setFormCageTag(getFullTag(res.tag));
                                            setFormRow(res.r);
                                            setFormCol(res.c);
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Cage Tag {formRow && formCol && <span style={{ color: 'var(--success)', fontSize: '0.7em', float: 'right' }}>*Will auto-create cage</span>}</label>
                            <input name="cageTag" className="form-control" value={formCageTag} onChange={(e) => {
                                setFormCageTag(e.target.value);
                                const foundCage = data.cages?.find(c => c.tag === e.target.value);
                                if (foundCage) {
                                    setFormRoom(foundCage.room || '');
                                    setFormRow(foundCage.row || '');
                                    setFormCol(foundCage.col || '');
                                    const r = data.rooms?.find(rm => rm.name === foundCage.room);
                                    setModalRoomFilter(r?.roomName || (foundCage.room?.includes('/') ? foundCage.room.split('/')[0] : ''));
                                }
                            }} list="cage-list" placeholder="Select from rack or type here" />
                            <datalist id="cage-list">
                                {data.cages?.map((c, idx) => <option key={`${c.id || c.tag}-${idx}`} value={c.tag} />)}
                            </datalist>
                        </div>
                    </div>
                </>
            );
        }
        if (currentType === 'strains') {
            return (
                <>
                    <div className="form-group">
                        <label>Mouseline</label>
                        <input name="name" className="form-control" defaultValue={editingItem?.name} required placeholder="e.g. C57BL/6J, Cre-line X" />
                    </div>
                    <div className="form-group">
                        <label>Genetic Background</label>
                        <input name="background" className="form-control" defaultValue={editingItem?.background} placeholder="e.g. C57BL/6" />
                    </div>
                    <div className="form-group">
                        <label>Description / Details</label>
                        <input name="description" className="form-control" defaultValue={editingItem?.description} placeholder="Short description of the line" />
                    </div>
                    <div className="form-group">
                        <label>Genotypes (Comma separated, for quick selection)</label>
                        <input name="genotypes" className="form-control" defaultValue={editingItem?.genotypes} placeholder="e.g. WT, +/+, +/-, -/-" />
                    </div>
                    <div className="form-group" onKeyDown={(e) => e.stopPropagation()} onPaste={(e) => e.stopPropagation()}>
                        <label>Comment</label>
                        <textarea name="comment" className="form-control" defaultValue={editingItem?.comment} rows="3"></textarea>
                    </div>
                </>
            );
        }
    };

    const renderSummaryView = () => {
        const activeStatuses = ['Stock', 'Mating', 'Pregnant', 'Nursing', 'Weaning', 'Weaned', 'Weanling', 'Experiment', 'Active'];
        const isNotLive = (status) => ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Terminated', 'Missing', 'Transferred'].includes(status);

        // Determine which mice to use based on sub-tab
        const targetMice = summarySubTab === 'active' 
            ? (data.mice || []).filter(m => !isNotLive(m.status || m.state || 'Stock'))
            : (data.mice || []).filter(m => {
                const mStatus = m.status || m.state;
                if (summaryLine && summaryLine.length > 0 && !summaryLine.includes(m.line)) return false;
                if (summaryStatus && summaryStatus.length > 0 && !summaryStatus.includes(mStatus || 'Stock')) return false;
                if (summaryCages && summaryCages.length > 0 && !summaryCages.includes(`${m._roomSearch || 'default'}|${m.cageTag}`)) return false;
                if (summaryDOBStart && m.dob && m.dob < summaryDOBStart) return false;
                if (summaryDOBEnd && m.dob && m.dob > summaryDOBEnd) return false;
                if (summaryEndDateStart && m.endDate && m.endDate < summaryEndDateStart) return false;
                if (summaryEndDateEnd && m.endDate && m.endDate > summaryEndDateEnd) return false;
                if ((summaryEndDateStart || summaryEndDateEnd) && !m.endDate) return false;
                return true;
            });

        const statusCounts = targetMice.reduce((acc, m) => {
            const s = m.status || m.state || 'Unknown';
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {});

        const lineCounts = targetMice.reduce((acc, m) => {
            const l = m.line || 'Unknown';
            acc[l] = (acc[l] || 0) + 1;
            return acc;
        }, {});

        const ageRanges = ['<2', '2-6', '6-12', '12-18', '18-24', '24+', 'Unknown'];
        const ageDistribution = targetMice.reduce((acc, m) => {
            const line = m.line || 'Unknown';
            const sex = m.sex === '♂' || m.sex === 'Male' ? '♂' : (m.sex === '♀' || m.sex === 'Female' ? '♀' : 'Unknown');
            const dob = m.dob ? new Date(m.dob) : null;
            
            let range = 'Unknown';
            if (dob && !isNaN(dob.getTime())) {
                const ageMonths = (new Date() - dob) / (1000 * 60 * 60 * 24 * 30.417);
                if (ageMonths < 2) range = '<2';
                else if (ageMonths < 6) range = '2-6';
                else if (ageMonths < 12) range = '6-12';
                else if (ageMonths < 18) range = '12-18';
                else if (ageMonths < 24) range = '18-24';
                else range = '24+';
            }

            if (!acc[line]) acc[line] = { '♂': {}, '♀': {}, 'Unknown': {} };
            acc[line][sex][range] = (acc[line][sex][range] || 0) + 1;
            return acc;
        }, {});

        const renderAgeTable = () => (
            <div style={{ background: 'var(--glass)', padding: '1.2rem', borderRadius: '15px', border: '1px solid var(--glass-border)', overflowX: 'auto' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart3 size={16} /> Age Distribution by Line & Sex (Months)
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'center' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
                            <th style={{ padding: '0.6rem', textAlign: 'left' }}>Line / Strain</th>
                            <th style={{ padding: '0.6rem' }}>Sex</th>
                            {ageRanges.map(r => <th key={r} style={{ padding: '0.6rem' }}>{r}{r === 'Unknown' ? '' : 'm'}</th>)}
                            <th style={{ padding: '0.6rem', fontWeight: 800 }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(ageDistribution).length > 0 ? (
                            <>
                                {Object.entries(ageDistribution).sort(([a], [b]) => a.localeCompare(b)).map(([line, sexData]) => {
                                    const activeSexes = ['♂', '♀', 'Unknown'].filter(s => 
                                        ageRanges.some(r => sexData[s][r] > 0)
                                    );
                                    return (
                                        <React.Fragment key={line}>
                                            {activeSexes.map((sex, sIdx) => {
                                                const rowTotal = ageRanges.reduce((sum, r) => sum + (sexData[sex][r] || 0), 0);
                                                return (
                                                    <tr key={`${line}-${sex}`} style={{ borderBottom: sIdx === activeSexes.length - 1 ? '1px solid var(--glass-border)' : '1px solid rgba(0,0,0,0.03)' }}>
                                                        {sIdx === 0 && (
                                                            <td rowSpan={activeSexes.length} style={{ padding: '0.6rem', textAlign: 'left', fontWeight: 800, verticalAlign: 'middle', borderRight: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.01)' }}>
                                                                {line}
                                                            </td>
                                                        )}
                                                        <td style={{ padding: '0.4rem', fontWeight: 700, color: sex === '♂' ? '#3b82f6' : sex === '♀' ? '#ec4899' : 'inherit' }}>{sex}</td>
                                                        {ageRanges.map(r => (
                                                            <td key={r} style={{ padding: '0.4rem', opacity: sexData[sex][r] ? 1 : 0.3, fontWeight: sexData[sex][r] ? 700 : 400 }}>
                                                                {sexData[sex][r] || 0}
                                                            </td>
                                                        ))}
                                                        <td style={{ padding: '0.4rem', fontWeight: 800, background: 'rgba(var(--accent-rgb), 0.03)' }}>{rowTotal}</td>
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                                <tr style={{ background: 'rgba(var(--accent-rgb), 0.05)', fontWeight: 800, borderTop: '2px solid var(--accent-primary)' }}>
                                    <td colSpan={2} style={{ padding: '0.6rem 1rem', textAlign: 'right', fontWeight: 900 }}>Grand Total</td>
                                    {ageRanges.map(r => {
                                        const colTotal = Object.values(ageDistribution).reduce((sum, sd) => 
                                            sum + ['♂', '♀', 'Unknown'].reduce((sSum, sex) => sSum + (sd[sex][r] || 0), 0)
                                        , 0);
                                        return <td key={r} style={{ padding: '0.6rem' }}>{colTotal}</td>;
                                    })}
                                    <td style={{ padding: '0.6rem', background: 'var(--accent-primary)', color: 'white' }}>
                                        {Object.values(ageDistribution).reduce((sum, sd) => 
                                            sum + ['♂', '♀', 'Unknown'].reduce((sSum, sex) => 
                                                sSum + ageRanges.reduce((rSum, r) => rSum + (sd[sex][r] || 0), 0)
                                            , 0)
                                        , 0)}
                                    </td>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <td colSpan={ageRanges.length + 3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No live mice found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );

        return (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '60vh' }}>
                {/* Summary View Internal Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--glass)', padding: '0.6rem 1.5rem', borderBottom: '1px solid var(--glass-border)', zIndex: 10 }}>
                    <button 
                        onClick={() => setSummarySubTab('active')} 
                        className={`btn ${summarySubTab === 'active' ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ padding: '0.3rem 1rem', fontSize: '0.75rem', borderRadius: '8px' }}
                    >
                        Active/Live Summary
                    </button>
                    <button 
                        onClick={() => setSummarySubTab('filter')} 
                        className={`btn ${summarySubTab === 'filter' ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ padding: '0.3rem 1rem', fontSize: '0.75rem', borderRadius: '8px' }}
                    >
                        Filter & Search
                    </button>
                </div>

                {summarySubTab === 'active' ? (
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {renderAgeTable()}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
                        {/* Filters Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--background)', padding: '1.2rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Line</label>
                                <MultiSelectCheckboxDropdown
                                    options={data.strains?.map(s => ({ value: s.name, label: s.name })) || []}
                                    selectedValues={summaryLine}
                                    onChange={setSummaryLine}
                                    placeholder="All Lines"
                                    data={data}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Status</label>
                                <MultiSelectCheckboxDropdown
                                    groupedOptions={[
                                        { label: 'Active / Live', options: ['Stock', 'Mating', 'Pregnant', 'Nursing', 'Weaning', 'Weaned', 'Weanling', 'Experiment', 'Active'].map(s => ({ value: s, label: s })) },
                                        { label: 'Archive / Inactive', options: ['Euthanasia', 'Tissue Collection', 'Dead', 'Missing', 'Transferred', 'Inactive'].map(s => ({ value: s, label: s })) }
                                    ]}
                                    selectedValues={summaryStatus}
                                    onChange={setSummaryStatus}
                                    placeholder="All Statuses"
                                    data={data}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Cage Location</label>
                                <MultiSelectCheckboxDropdown
                                    options={data.cages?.map(c => ({ value: `${c.room}|${c.tag}`, label: getCageDisplayTag(data.settings, c.room, c.tag) })) || []}
                                    groupedOptions={(() => {
                                        const grouped = {};
                                        data.cages?.forEach(c => {
                                            const rName = c.room || 'Unassigned';
                                            if (!grouped[rName]) grouped[rName] = [];
                                            grouped[rName].push({ value: `${c.room}|${c.tag}`, label: getCageDisplayTag(data.settings, c.room, c.tag) });
                                        });
                                        return Object.entries(grouped).map(([label, options]) => ({ label, options }));
                                    })()}
                                    selectedValues={summaryCages}
                                    onChange={setSummaryCages}
                                    placeholder="All Cages"
                                    data={data}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>DOB Range</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input type="date" className="form-control" value={summaryDOBStart} onChange={(e) => setSummaryDOBStart(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.3rem' }} />
                                    <span>-</span>
                                    <input type="date" className="form-control" value={summaryDOBEnd} onChange={(e) => setSummaryDOBEnd(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.3rem' }} />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>End Date Range</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input type="date" className="form-control" value={summaryEndDateStart} onChange={(e) => setSummaryEndDateStart(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.3rem' }} />
                                    <span>-</span>
                                    <input type="date" className="form-control" value={summaryEndDateEnd} onChange={(e) => setSummaryEndDateEnd(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.3rem' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <button className="btn btn-ghost" style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textDecoration: 'underline' }} onClick={() => {
                                    setSummaryLine([]); setSummaryStatus([]); setSummaryCages([]); setSummaryDOBStart(''); setSummaryDOBEnd(''); setSummaryEndDateStart(''); setSummaryEndDateEnd('');
                                }}>Reset Filters</button>
                            </div>
                        </div>

                        {/* Aggregate Charts/Status Overview */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ background: 'var(--glass)', padding: '1.2rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MousePointer2 size={16} /> Status Distribution ({targetMice.length} total)
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                    {Object.entries(statusCounts).sort((a,b) => b[1] - a[1]).map(([status, count]) => (
                                        <div key={status} style={{ background: 'var(--background)', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '120px' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{status}</span>
                                            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ background: 'var(--glass)', padding: '1.2rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ChevronRight size={16} /> Line Distribution
                                </h4>
                                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr', gap: '0.4rem' }}>
                                    {Object.entries(lineCounts).sort((a,b) => b[1] - a[1]).map(([line, count]) => (
                                        <div key={line} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                                            <span style={{ fontSize: '0.8rem' }}>{line}</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Details Table */}
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                <thead>
                                    <tr style={{ background: 'var(--glass)', borderBottom: '1px solid var(--glass-border)' }}>
                                        <th style={{ padding: '0.8rem', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('tag')}>ID / Tag <SortIcon column="tag" /></th>
                                        <th style={{ padding: '0.8rem', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('line')}>Line <SortIcon column="line" /></th>
                                        <th style={{ padding: '0.8rem', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('sex')}>Sex <SortIcon column="sex" /></th>
                                        <th style={{ padding: '0.8rem', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('genotype')}>Genotype <SortIcon column="genotype" /></th>
                                        <th style={{ padding: '0.8rem', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('dob')}>DOB <SortIcon column="dob" /></th>
                                        <th style={{ padding: '0.8rem', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('dob')}>Age <SortIcon column="dob" /></th>
                                        <th style={{ padding: '0.8rem', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('endDate')}>End Date <SortIcon column="endDate" /></th>
                                        <th style={{ padding: '0.8rem', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('status')}>Status <SortIcon column="status" /></th>
                                        <th style={{ padding: '0.8rem', userSelect: 'none' }}>Comment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedData(targetMice).map(m => (
                                        <tr key={m.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '0.6rem' }}>
                                                <div style={{ fontWeight: 800 }}>{m.tag}</div>
                                                <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{m.id}</div>
                                            </td>
                                            <td style={{ padding: '0.6rem' }}>{m.line}</td>
                                            <td style={{ padding: '0.6rem', fontWeight: 700, color: (m.sex === '♂' || m.sex === 'Male') ? '#3b82f6' : (m.sex === '♀' || m.sex === 'Female') ? '#ec4899' : 'inherit' }}>
                                                {m.sex === 'Male' ? '♂' : m.sex === 'Female' ? '♀' : m.sex || '-'}
                                            </td>
                                            <td style={{ padding: '0.6rem', fontSize: '0.75rem' }}>{m.genotype || '-'}</td>
                                            <td style={{ padding: '0.6rem' }}>{formatDate(m.dob)}</td>
                                            <td style={{ padding: '0.6rem', fontWeight: 600 }}>{getAge(m.dob, ageFormat, m.endDate)}</td>
                                            <td style={{ padding: '0.6rem', color: m.endDate ? 'var(--danger)' : 'inherit' }}>{formatDate(m.endDate) || '-'}</td>
                                            <td style={{ padding: '0.6rem' }}>
                                                <span className={`badge badge-${(m.status || m.state || 'stock').toLowerCase().replace('/', '-')}`}>{m.status || m.state}</span>
                                            </td>
                                            <td style={{ padding: '0.6rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={m.comment}>
                                                {m.comment}
                                            </td>
                                        </tr>
                                    ))}
                                    {targetMice.length === 0 && (
                                        <tr>
                                            <td colSpan="9" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No mice found matching the filters.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderTable = () => {
        let items = sortedData(data[activeSubTab]);

        if (activeSubTab === 'matings' && showActiveMatingsOnly) {
            items = items.filter(m => m.status !== 'Inactive');
        }

        if (activeSubTab === 'litters' && showActiveLittersOnly) {
            items = items.filter(l => {
                const s = (l.status || 'Nursing').toLowerCase();
                return s === 'nursing' || s === 'active';
            });
        }

        if (activeSubTab === 'matings' && matingLineFilter) {
            items = items.filter(m => m.line === matingLineFilter);
        }

        if (activeSubTab === 'mice' && miceLineFilter) {
            items = items.filter(m => m.line === miceLineFilter);
        }

        if (activeSubTab === 'cages' && cageLineFilter) {
            items = items.filter(item => {
                const inactiveStates = ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'];
                const activeMiceInCage = data.mice?.filter(m => m.cageTag === item.tag && m._roomSearch === item.room && !inactiveStates.includes(m.status || m.state)) || [];
                const lines = [...new Set(activeMiceInCage.map(m => m.line).filter(Boolean))];
                return lines.includes(cageLineFilter);
            });
        }

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase().trim();
            items = items.filter(item => {
                // 1. 性別の優先マッチング (前方一致)
                // "ma" や "male" は male のみに、"fe" や "female" は female のみにヒットするようにする
                const sex = (item.sex || '').toLowerCase();
                const isItemMale = sex === '♂' || sex === 'male';
                const isItemFemale = sex === '♀' || sex === 'female';

                if (lowerSearch.length >= 1) {
                    if (('male'.startsWith(lowerSearch) || lowerSearch === '♂') && isItemMale) return true;
                    if (('female'.startsWith(lowerSearch) || lowerSearch === '♀') && isItemFemale) return true;
                }

                // 2. 基本フィールドの検索
                const searchFields = [
                    item.id, item.tag, item.cageTag, item.line, item.genotype,
                    item.room, item.status, item.state, item.comment, item.name
                ];
                
                let found = searchFields.some(field => field && String(field).toLowerCase().includes(lowerSearch));
                if (found) return true;

                // 2. 特殊な関連情報の検索 (部屋名やRack-Cage形式)
                if (['mice', 'matings', 'cages', 'litters'].includes(activeSubTab)) {
                    let cageTag = item.cageTag || item.tag;
                    if (activeSubTab === 'litters') {
                        const m = data.matings?.find(x => String(x.id) === String(item.matingId));
                        cageTag = item.cageTag || m?.cageTag;
                    }

                    const cage = data.cages?.find(c => String(c.tag) === String(cageTag));
                    const roomNameInternal = cage?.room || item.room;
                    const roomObj = data.rooms?.find(r => r.name === roomNameInternal);

                    // 部屋名での検索
                    const displayRoom = roomObj?.roomName || (roomNameInternal?.includes('/') ? roomNameInternal.split('/')[0] : roomNameInternal);
                    if (displayRoom && String(displayRoom).toLowerCase().includes(lowerSearch)) return true;

                    // Rack-Cage形式での検索 (例: "1-A01")
                    const displayRack = (roomNameInternal?.includes('/') ? roomNameInternal.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '';
                    const fullCageId = displayRack && cageTag ? `${displayRack}-${cageTag}` : (cageTag || '');
                    if (fullCageId && String(fullCageId).toLowerCase().includes(lowerSearch)) return true;
                }

                if (activeSubTab === 'litters') {
                    // Litter内のPupsを検索
                    const pups = data.mice?.filter(p => p.litterId === item.id) || [];
                    return pups.some(p =>
                        (p.id && p.id.toLowerCase().includes(lowerSearch)) ||
                        (p.tag && p.tag.toLowerCase().includes(lowerSearch)) ||
                        (p.genotype && p.genotype.toLowerCase().includes(lowerSearch))
                    );
                }

                if (activeSubTab === 'rooms') {
                    // ラック内のケージ名を検索
                    const cages = data.cages?.filter(c => c.room === item.name) || [];
                    return cages.some(c => c.tag && c.tag.toLowerCase().includes(lowerSearch));
                }

                return false;
            });
        }

        if (activeSubTab === 'mice' && showLiveOnly) {
            const isNotLive = (status) => ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(status);
            items = items.filter(m => !isNotLive(m.status || m.state));
        }

        const lowerSearch = searchTerm?.toLowerCase().trim();

        if (activeSubTab === 'mice' && miceRoomFilter) {
            items = items.filter(m => {
                const cage = data.cages?.find(c => c.tag === m.cageTag);
                const rName = cage?.room || m.room;
                const rObj = data.rooms?.find(r => r.name === rName);
                const displayRoom = rObj?.roomName || (rName?.includes('/') ? rName.split('/')[0] : rName);
                return displayRoom === miceRoomFilter;
            });
        }
        const thStyle = { padding: '0.6rem', cursor: 'pointer', userSelect: 'none', background: 'inherit', boxShadow: '0 1px 0 var(--glass-border)' };
        const getMouseInfo = (id) => data.mice?.find(x => x.id === id) || { id, tag: '' };

        const renderSubHeader = () => (
            <div style={{ 
                padding: '0.6rem 1rem', 
                background: 'var(--glass)', 
                borderBottom: '1px solid var(--glass-border)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                flexWrap: 'wrap', 
                gap: '1rem', 
                position: 'relative', 
                zIndex: 100, 
                overflow: 'visible',
                borderRadius: '12px 12px 0 0'
            }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {['mice', 'cages', 'matings', 'litters'].includes(activeSubTab) && (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button
                                    onClick={() => setShowColumnSettings(true)}
                                    className="btn btn-ghost"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', height: '32px', padding: '0 0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', fontWeight: 500 }}
                                >
                                    <Settings size={14} />
                                    Display Columns
                                </button>
                                {activeSubTab === 'cages' && (
                                    <button
                                        className="btn btn-ghost"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', height: '32px', padding: '0 0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'var(--accent-secondary)', fontWeight: 500 }}
                                        onClick={() => {
                                            const selectedCageObjects = data.cages?.filter(c => selectedCages.includes(c.id)) || [];
                                            setLabelsToPrint(selectedCageObjects);
                                            setIsLabelModalOpen(true);
                                        }}
                                    >
                                        <Printer size={14} /> 
                                        Print Labels
                                    </button>
                                )}
                                <div style={{ 
                                    display: 'flex', 
                                    background: 'rgba(0,0,0,0.04)', 
                                    borderRadius: '8px', 
                                    padding: '2px', 
                                    marginLeft: '0.4rem',
                                    border: '1px solid var(--glass-border)',
                                    height: '32px',
                                    alignItems: 'center'
                                }}>
                                    {[
                                        { id: 'days', label: 'D' },
                                        { id: 'weeks', label: 'W' },
                                        { id: 'months', label: 'M' }
                                    ].map(f => {
                                        const isActive = ageFormat === f.id;
                                        return (
                                            <button
                                                key={f.id}
                                                onClick={() => setAgeFormat(f.id)}
                                                style={{
                                                    padding: '0 8px',
                                                    fontSize: '0.75rem',
                                                    height: '26px',
                                                    minWidth: '26px',
                                                    background: isActive ? 'var(--accent-primary)' : 'transparent',
                                                    color: isActive ? 'white' : 'var(--text-muted)',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: isActive ? 700 : 500,
                                                    transition: 'all 0.15s ease-out',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.15)' : 'none'
                                                }}
                                            >
                                                {f.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {activeSubTab === 'mice' && (
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                <label className="checkbox-label" style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                                    <input type="checkbox" checked={showLiveOnly} onChange={e => setShowLiveOnly(e.target.checked)} />
                                    Show Live Mice
                                </label>
                                <select
                                    style={{ height: '32px', fontSize: '0.8rem', padding: '0 0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--background)', color: 'var(--text-main)', cursor: 'pointer' }}
                                    value={miceRoomFilter}
                                    onChange={(e) => setMiceRoomFilter(e.target.value)}
                                >
                                    <option value="">All Rooms</option>
                                    {[...new Set(data.rooms?.map(r => r.roomName || (r.name.includes('/') ? r.name.split('/')[0] : r.name)))]
                                        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                                        .map(roomName => (
                                            <option key={roomName} value={roomName}>{roomName}</option>
                                        ))}
                                </select>
                                <select
                                    style={{ height: '32px', fontSize: '0.8rem', padding: '0 0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--background)', color: 'var(--text-main)', cursor: 'pointer' }}
                                    value={miceLineFilter}
                                    onChange={(e) => setMiceLineFilter(e.target.value)}
                                >
                                    <option value="">All Lines</option>
                                    {data.strains?.map(s => (
                                        <option key={s.id} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {activeSubTab === 'litters' && (
                            <label className="checkbox-label" style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                                <input type="checkbox" checked={showActiveLittersOnly} onChange={e => setShowActiveLittersOnly(e.target.checked)} />
                                Show Active Litters Only
                            </label>
                        )}
                        {activeSubTab === 'matings' && (
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                <label className="checkbox-label" style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                                    <input type="checkbox" checked={showActiveMatingsOnly} onChange={e => setShowActiveMatingsOnly(e.target.checked)} />
                                    Show Active Matings Only
                                </label>
                                <select
                                    style={{ height: '32px', fontSize: '0.8rem', padding: '0 0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--background)', color: 'var(--text-main)', cursor: 'pointer' }}
                                    value={matingLineFilter}
                                    onChange={(e) => setMatingLineFilter(e.target.value)}
                                >
                                    <option value="">All Lines</option>
                                    {data.strains?.map(s => (
                                        <option key={s.id} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {activeSubTab === 'cages' && (
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                <select
                                    style={{ height: '32px', fontSize: '0.8rem', padding: '0 0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--background)', color: 'var(--text-main)', cursor: 'pointer' }}
                                    value={cageLineFilter}
                                    onChange={(e) => setCageLineFilter(e.target.value)}
                                >
                                    <option value="">All Lines</option>
                                    {data.strains?.map(s => (
                                        <option key={s.id} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                                <button
                                    className="btn btn-ghost"
                                    style={{ height: '32px', fontSize: '0.75rem', padding: '0 0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                    onClick={handleCleanupAllCages}
                                    title="Delete all cages with 0 count"
                                >
                                    <Trash2 size={12} /> Cleanup Empty Cages
                                </button>
                                {selectedCages.length > 0 && (
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: '0.5rem', padding: '3px 6px', background: 'var(--glass)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Archive selected:</div>
                                        <select
                                            style={{ height: '26px', fontSize: '0.7rem', padding: '0 4px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--background)' }}
                                            value={topCageBulkStatus}
                                            onChange={(e) => setTopCageBulkStatus(e.target.value)}
                                        >
                                            <option value="Experiment">Experiment</option>
                                            <option value="Euthanasia">Euthanasia</option>
                                            <option value="Tissue Collection">Tissue Collection</option>
                                            <option value="Dead">Dead</option>
                                            <option value="Missing">Missing</option>
                                            <option value="Transferred">Transferred</option>
                                        </select>
                                        <input
                                            type="date"
                                            style={{ height: '26px', fontSize: '0.7rem', padding: '0 4px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--background)' }}
                                            value={topCageBulkDate}
                                            onChange={(e) => setTopCageBulkDate(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder={data.helpLang === 'jp' ? 'コメントを入力...' : 'Enter comment...'}
                                            style={{ height: '26px', fontSize: '0.7rem', padding: '0 6px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--background)', width: '130px' }}
                                            value={topCageBulkComment}
                                            onChange={(e) => setTopCageBulkComment(e.target.value)}
                                        />
                                        <button
                                            className="btn btn-ghost"
                                            style={{ height: '26px', width: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'var(--text-main)', border: '1px solid var(--glass-border)', background: 'var(--background)', borderRadius: '6px' }}
                                            title="Archive all live mice in selected cages"
                                            onClick={() => {
                                                const selectedCageObjects = data.cages?.filter(c => selectedCages.includes(c.id)) || [];
                                                const miceInSelectedCages = data.mice?.filter(m => selectedCageObjects.some(c => c.tag === m.cageTag && c.room === m._roomSearch) && !['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(m.status)) || [];
                                                if (miceInSelectedCages.length === 0) {
                                                    alert("No live mice found in selected cages.");
                                                    return;
                                                }
                                                if (confirm(`Archive ${miceInSelectedCages.length} mice in ${selectedCages.length} cages as ${topCageBulkStatus}?`)) {
                                                    bulkUpdateMiceStatus(
                                                        miceInSelectedCages.map(m => m.id),
                                                        topCageBulkStatus,
                                                        topCageBulkComment,
                                                        topCageBulkDate
                                                    );
                                                    setTopCageBulkComment('');
                                                    setSelectedCages([]);
                                                }
                                            }}
                                        >
                                            <Archive size={13} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)', opacity: 0.5 }} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                height: '32px',
                                padding: '0 0.8rem 0 2rem',
                                fontSize: '0.8rem',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'var(--background)',
                                width: '220px',
                                outline: 'none',
                                transition: 'all 0.15s ease-out'
                            }}
                            className="search-input"
                        />
                    </div>
                </div>
            </div>
        );

            const renderRecordTable = () => (
                <div 
                    className="table-scroll-container"
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        maxHeight: 'calc(100vh - 280px)',
                        minHeight: '350px',
                        overflowY: 'auto',
                        overflowX: 'auto',
                        position: 'relative'
                    }}
                >
                    {
                    activeSubTab === 'mice' && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                            <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--card-bg)' }}>
                                <tr style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ ...thStyle, width: '40px' }}>
                                        <input
                                            type="checkbox"
                                            checked={items.length > 0 && items.every(item => selectedMice.includes(item.id))}
                                            onChange={(e) => {
                                                const currentIds = items.map(item => item.id);
                                                if (e.target.checked) {
                                                    setSelectedMice([...new Set([...selectedMice, ...currentIds])]);
                                                } else {
                                                    setSelectedMice(selectedMice.filter(id => !currentIds.includes(id)));
                                                }
                                            }}
                                        />
                                    </th>
                                    {(columnOrders.mice || DEFAULT_COLUMN_ORDERS.mice).map(colKey => {
                                        if (!columnSettings.mice?.[colKey]) return null;
                                        switch (colKey) {
                                            case 'room': return <th key="room" style={{ ...thStyle, width: '60px' }} onClick={() => requestSort('room')}>Room <SortIcon column="room" /></th>;
                                            case 'rack': return <th key="rack" style={{ ...thStyle, width: '60px' }}>Rack</th>;
                                            case 'cageTag': return (
                                                <th key="cageTag" style={{ ...thStyle, width: '130px' }} onClick={() => requestSort('cageTag')}>
                                                    Location <SortIcon column="cageTag" />
                                                </th>
                                            );
                                            case 'id': return <th key="id" style={thStyle} onClick={() => requestSort('id')}>ID / Tag <SortIcon column="id" /></th>;
                                            case 'status': return <th key="status" style={thStyle} onClick={() => requestSort('status')}>Status <SortIcon column="status" /></th>;
                                            case 'line': return <th key="line" style={thStyle} onClick={() => requestSort('line')}>Line <SortIcon column="line" /></th>;
                                            case 'sex': return <th key="sex" style={thStyle} onClick={() => requestSort('sex')}>Sex <SortIcon column="sex" /></th>;
                                            case 'dob': return <th key="dob" style={thStyle} onClick={() => requestSort('dob')}>DOB <SortIcon column="dob" /></th>;
                                            case 'weaningDate': return <th key="weaningDate" style={thStyle} onClick={() => requestSort('weaningDate')}>Weaning <SortIcon column="weaningDate" /></th>;
                                            case 'age': return <th key="age" style={thStyle} onClick={() => requestSort('dob')}>Age <SortIcon column="dob" /></th>;
                                            case 'genotype': return <th key="genotype" style={thStyle} onClick={() => requestSort('genotype')}>Genotype <SortIcon column="genotype" /></th>;
                                            case 'matingId': return <th key="matingId" style={thStyle} onClick={() => requestSort('matingId')}>Mating / Litter ID <SortIcon column="matingId" /></th>;
                                            case 'sireId': return <th key="sireId" style={thStyle} onClick={() => requestSort('sireId')}>Sire <SortIcon column="sireId" /></th>;
                                            case 'damId': return <th key="damId" style={thStyle} onClick={() => requestSort('damId')}>Dam <SortIcon column="damId" /></th>;
                                            case 'endDate': return <th key="endDate" style={thStyle} onClick={() => requestSort('endDate')}>End Date <SortIcon column="endDate" /></th>;
                                            case 'comment': return <th key="comment" style={{ padding: '0.6rem' }}>Comment</th>;
                                            default: return null;
                                        }
                                    })}
                                    <th style={{ padding: '0.6rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => {
                                    const itemStatus = item.status || item.state;
                                    const isExcluded = ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(itemStatus);
                                    const cage = data.cages?.find(c => c.tag === item.cageTag && c.room === item._roomSearch);
                                    const roomObj = cage ? data.rooms?.find(r => r.name === cage.room) : null;
                                    const displayRoom = roomObj?.roomName || (cage?.room?.includes('/') ? cage.room.split('/')[0] : cage?.room) || '-';
                                    const displayRack = (cage?.room?.includes('/') ? cage.room.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '-';

                                    return (
                                        <tr key={item.id} style={{
                                            borderBottom: '1px solid var(--glass-border)',
                                            background: selectedMice.includes(item.id) ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                                            opacity: isExcluded ? 0.35 : 1,
                                            color: isExcluded ? 'var(--text-muted)' : 'inherit'
                                        }}>
                                            <td style={{ padding: '0.6rem' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMice.includes(item.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedMice([...selectedMice, item.id]);
                                                        else setSelectedMice(selectedMice.filter(id => id !== item.id));
                                                    }}
                                                />
                                            </td>
                                            {(columnOrders.mice || DEFAULT_COLUMN_ORDERS.mice).map(colKey => {
                                                if (!columnSettings.mice?.[colKey]) return null;
                                                switch (colKey) {
                                                    case 'room': return <td key="room" style={{ padding: '0.6rem' }}>{displayRoom}</td>;
                                                    case 'rack': return <td key="rack" style={{ padding: '0.6rem' }}>{displayRack}</td>;
                                                    case 'cageTag': return (
                                                        <td key="cageTag" style={{ padding: '0.6rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                                                            {getCageDisplayTag(data.settings, item._roomSearch, item.cageTag)}
                                                        </td>
                                                    );
                                                    case 'id': return (
                                                        <td key="id" style={{ padding: '0.6rem' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.7 }}>{item.id}</span>
                                                                <span style={{ fontWeight: 800, color: (item.sex === '♂' || item.sex === 'Male') ? '#3b82f6' : (item.sex === '♀' || item.sex === 'Female') ? '#ec4899' : '#888' }}>
                                                                    {item.tag}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    );
                                                    case 'status': return (
                                                        <td key="status" style={{ padding: '0.6rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <span className={`badge badge-${(item.status || item.state)?.toLowerCase().replace('/', '-')}`}>{item.status || item.state}</span>
                                                            </div>
                                                        </td>
                                                    );
                                                    case 'line': return <td key="line" style={{ padding: '0.6rem', fontWeight: 600 }}>{item.line}</td>;
                                                    case 'sex': return <td key="sex" style={{ padding: '0.6rem', color: item.sex === '♂' || item.sex === 'Male' ? '#3b82f6' : item.sex === '♀' || item.sex === 'Female' ? '#ec4899' : '#888' }}>{item.sex}</td>;
                                                    case 'dob': return <td key="dob" style={{ padding: '0.6rem' }}>{formatDate(item.dob)}</td>;
                                                    case 'weaningDate': return <td key="weaningDate" style={{ padding: '0.6rem' }}>{formatDate(item.weaningDate)}</td>;
                                                    case 'age': return <td key="age" style={{ padding: '0.6rem', fontWeight: 600 }}>{getAge(item.dob, ageFormat, item.endDate)}</td>;
                                                    case 'genotype': return <td key="genotype" style={{ padding: '0.6rem' }}>{item.genotype || '-'}</td>;
                                                    case 'matingId': return <td key="matingId" style={{ padding: '0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.litterId || item.matingId || '-'}</td>;
                                                    case 'sireId': {
                                                        const sire = item.sireId ? getMouseInfo(item.sireId) : null;
                                                        return (
                                                            <td key="sireId" style={{ padding: '0.6rem' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.7 }}>{item.sireId || '-'}</span>
                                                                    <span style={{ fontWeight: 800, color: '#3b82f6', fontSize: '0.8rem' }}>{sire?.tag || ''}</span>
                                                                </div>
                                                            </td>
                                                        );
                                                    }
                                                    case 'damId': {
                                                        const dam = item.damId ? getMouseInfo(item.damId) : null;
                                                        return (
                                                            <td key="damId" style={{ padding: '0.6rem' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.7 }}>{item.damId || '-'}</span>
                                                                    <span style={{ fontWeight: 800, color: '#ec4899', fontSize: '0.8rem' }}>{dam?.tag || ''}</span>
                                                                </div>
                                                            </td>
                                                        );
                                                    }
                                                    case 'endDate': return <td key="endDate" style={{ padding: '0.6rem', fontSize: '0.8rem' }}>{formatDate(item.endDate)}</td>;
                                                    case 'comment': return <td key="comment" style={{ padding: '0.6rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.75rem', color: 'var(--text-muted)' }} title={item.comment}>{item.comment || '-'}</td>;
                                                    default: return null;
                                                }
                                            })}
                                            <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                                    <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem' }} onClick={(e) => { e.stopPropagation(); openModal(item); }}>
                                                        <Edit2 size={13} style={{ pointerEvents: 'none' }} />
                                                    </button>
                                                    <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); handleDelete('mice', item.id); }}>
                                                        <Trash2 size={13} style={{ pointerEvents: 'none' }} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )
                }

                {
                    activeSubTab === 'matings' && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                            <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--card-bg)' }}>
                                <tr style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ ...thStyle, width: '40px' }}>
                                        <input
                                            type="checkbox"
                                            checked={items.length > 0 && items.every(item => selectedMatings.includes(item.id))}
                                            onChange={(e) => {
                                                const currentIds = items.map(item => item.id);
                                                if (e.target.checked) {
                                                    setSelectedMatings([...new Set([...selectedMatings, ...currentIds])]);
                                                } else {
                                                    setSelectedMatings(selectedMatings.filter(id => !currentIds.includes(id)));
                                                }
                                            }}
                                        />
                                    </th>
                                    {(columnOrders.matings || DEFAULT_COLUMN_ORDERS.matings).map(colKey => {
                                        if (!columnSettings.matings?.[colKey]) return null;
                                        switch (colKey) {
                                            case 'id': return <th key="id" style={thStyle} onClick={() => requestSort('id')}>Mating ID <SortIcon column="id" /></th>;
                                            case 'room': return <th key="room" style={{ ...thStyle, width: '80px' }}>Room</th>;
                                            case 'rack': return <th key="rack" style={{ ...thStyle, width: '80px' }}>Rack</th>;
                                            case 'cageTag': return (
                                                <th key="cageTag" style={{ ...thStyle, width: '130px' }} onClick={() => requestSort('cageTag')}>
                                                    Location <SortIcon column="cageTag" />
                                                </th>
                                            );
                                            case 'status': return <th key="status" style={thStyle} onClick={() => requestSort('status')}>Status <SortIcon column="status" /></th>;
                                            case 'startDate': return <th key="startDate" style={thStyle} onClick={() => requestSort('startDate')}>Set up date <SortIcon column="startDate" /></th>;
                                            case 'sireId': return <th key="sireId" style={thStyle} onClick={() => requestSort('sireId')}>Male (♂) <SortIcon column="sireId" /></th>;
                                            case 'sireGenotype': return <th key="sireGenotype" style={thStyle} onClick={() => requestSort('sireGenotype')}>Male Genotype <SortIcon column="sireGenotype" /></th>;
                                            case 'damId': return <th key="damId" style={thStyle} onClick={() => requestSort('damId')}>Female (♀) <SortIcon column="damId" /></th>;
                                            case 'damGenotype': return <th key="damGenotype" style={thStyle} onClick={() => requestSort('damGenotype')}>Female Genotype <SortIcon column="damGenotype" /></th>;
                                            case 'line': return <th key="line" style={thStyle} onClick={() => requestSort('line')}>Line <SortIcon column="line" /></th>;
                                            case 'litters': return <th key="litters" style={{ padding: '0.6rem' }}>Litters</th>;
                                            default: return null;
                                        }
                                    })}
                                    <th style={{ padding: '0.6rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => {
                                    const sire = getMouseInfo(item.sireId);
                                    const dam = getMouseInfo(item.damId);
                                    const matingLitters = data.litters?.filter(l => l.matingId === item.id) || [];
                                    const totalPupCount = matingLitters.reduce((sum, l) => sum + (parseInt(l.count, 10) || 0), 0);
                                    const isSelected = selectedMatings.includes(item.id);

                                    // Location calculations
                                    const damMouse = data.mice?.find(m => m.id === item.damId);
                                    const sireMouse = data.mice?.find(m => m.id === item.sireId);
                                    const primaryCageTag = damMouse?.cageTag || item.cageTag;
                                    const primaryRoom = damMouse?._roomSearch || item._roomSearch;
                                    const cage = data.cages?.find(c => c.tag === primaryCageTag && c.room === primaryRoom);
                                    const roomObj = cage ? data.rooms?.find(r => r.name === cage.room) : null;
                                    const displayRoom = roomObj?.roomName || (cage?.room?.includes('/') ? cage.room.split('/')[0] : cage?.room) || '-';
                                    const displayRack = (cage?.room?.includes('/') ? cage.room.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '-';
                                    const hasNursingLitter = matingLitters.some(l => {
                                        const lStatus = (l.status || '').toLowerCase();
                                        return (lStatus === 'active' || lStatus === 'nursing' || !l.status) && (parseInt(l.count, 10) || 0) > 0;
                                    });
                                    const locationColor = hasNursingLitter ? '#84cc16' : 'var(--accent-secondary)';

                                    const inactiveStates = ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'];
                                    const sireIsInactive = sireMouse && inactiveStates.includes(sireMouse.status || sireMouse.state);
                                    const damIsInactive = damMouse && inactiveStates.includes(damMouse.status || damMouse.state);

                                    return (
                                        <tr key={item.id} style={{
                                            borderBottom: '1px solid var(--glass-border)',
                                            background: isSelected ? 'rgba(79, 70, 229, 0.1)' : 'transparent'
                                        }}>
                                            <td style={{ padding: '0.6rem' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMatings.includes(item.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedMatings([...selectedMatings, item.id]);
                                                        else setSelectedMatings(selectedMatings.filter(id => id !== item.id));
                                                    }}
                                                />
                                            </td>
                                            {(columnOrders.matings || DEFAULT_COLUMN_ORDERS.matings).map(colKey => {
                                                if (!columnSettings.matings?.[colKey]) return null;
                                                switch (colKey) {
                                                    case 'id': return <td key="id" style={{ padding: '0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.id}</td>;
                                                    case 'room': return <td key="room" style={{ padding: '0.6rem' }}>{displayRoom}</td>;
                                                    case 'rack': return <td key="rack" style={{ padding: '0.6rem' }}>{displayRack}</td>;
                                                    case 'cageTag': return (
                                                        <td key="cageTag" style={{ padding: '0.6rem' }}>
                                                            <div style={{ fontWeight: 800, color: locationColor }}>{getCageDisplayTag(data.settings, primaryRoom, primaryCageTag)}</div>
                                                            {(() => {
                                                                const extras = [];
                                                                if (sireMouse?.cageTag && sireMouse.cageTag !== primaryCageTag) {
                                                                    extras.push(<div key="s" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>♂</span>: {getCageDisplayTag(data.settings, sireMouse._roomSearch, sireMouse.cageTag)}</div>);
                                                                }
                                                                return extras;
                                                            })()}
                                                        </td>
                                                    );
                                                    case 'status': return (
                                                        <td key="status" style={{ padding: '0.6rem' }}>
                                                            <span className={`badge badge-${(item.status || 'Active').toLowerCase()}`}>{item.status || 'Active'}</span>
                                                        </td>
                                                    );
                                                    case 'startDate': return (
                                                        <td key="startDate" style={{ padding: '0.6rem', fontSize: '0.75rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                                                <span style={{ color: 'var(--text-main)' }}>{formatDate(item.startDate)}</span>
                                                                <span style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                                                                    ({getAge(item.startDate, 'days')})
                                                                </span>
                                                            </div>
                                                            {item.endDate && <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>to {formatDate(item.endDate)}</div>}
                                                        </td>
                                                    );
                                                    case 'sireId': return (
                                                        <td key="sireId" style={{ padding: '0.6rem' }}>
                                                            <div
                                                                style={{ display: 'flex', flexDirection: 'column', cursor: sireMouse ? 'pointer' : 'default', opacity: sireIsInactive ? 0.35 : 1 }}
                                                                onClick={(e) => { if (sireMouse) { e.stopPropagation(); openModal(sireMouse, 'mice'); } }}
                                                            >
                                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', opacity: 0.3 }}>{sire.id}</span>
                                                                <span style={{ fontWeight: 800, color: sireIsInactive ? 'var(--text-muted)' : '#3b82f6', textDecoration: sireMouse ? 'underline' : 'none' }}>
                                                                    {sire.tag && sire.tag !== 'nan' ? sire.tag : ''}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    );
                                                    case 'sireGenotype': return (
                                                        <td key="sireGenotype" style={{ padding: '0.6rem', fontSize: '0.75rem' }}>
                                                            {sireMouse?.genotype || '-'}
                                                        </td>
                                                    );
                                                    case 'damId': return (
                                                        <td key="damId" style={{ padding: '0.6rem' }}>
                                                            <div
                                                                style={{ display: 'flex', flexDirection: 'column', cursor: damMouse ? 'pointer' : 'default', opacity: damIsInactive ? 0.35 : 1 }}
                                                                onClick={(e) => { if (damMouse) { e.stopPropagation(); openModal(damMouse, 'mice'); } }}
                                                            >
                                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', opacity: 0.3 }}>{dam.id}</span>
                                                                <span style={{ fontWeight: 800, color: damIsInactive ? 'var(--text-muted)' : '#ec4899', textDecoration: damMouse ? 'underline' : 'none' }}>
                                                                    {dam.tag && dam.tag !== 'nan' ? dam.tag : ''}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    );
                                                    case 'damGenotype': return (
                                                        <td key="damGenotype" style={{ padding: '0.6rem', fontSize: '0.75rem' }}>
                                                            {damMouse?.genotype || '-'}
                                                        </td>
                                                    );
                                                    case 'line': return (
                                                        <td key="line" style={{ padding: '0.6rem', fontSize: '0.75rem' }}>
                                                            {item.line || '-'}
                                                        </td>
                                                    );
                                                    case 'litters': return (
                                                        <td key="litters" style={{ padding: '0.6rem' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{totalPupCount} Pups</div>
                                                                {matingLitters.map(l => {
                                                                    const pupsInLitter = data.mice?.filter(p => p.litterId === l.id) || [];
                                                                    const lStatusLower = (l.status || '').toLowerCase();
                                                                    const displayStatus = lStatusLower === 'active' || !l.status ? 'Nursing' : (lStatusLower === 'inactive' || lStatusLower === 'weaned' ? 'Weaned' : l.status);
                                                                    const representativeStatus = pupsInLitter.length > 0 ? (pupsInLitter[0].status || pupsInLitter[0].state) : displayStatus;
                                                                    return (
                                                                        <div key={l.id} style={{ fontSize: '0.7rem', color: 'var(--text-main)', borderLeft: '2px solid var(--glass-border)', paddingLeft: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '2px 0' }}>
                                                                            <div style={{ opacity: 0.8 }}>
                                                                                {formatDate(l.dob)}
                                                                                <span style={{ color: 'var(--accent-primary)', fontWeight: 600, marginLeft: '4px' }}>
                                                                                    ({getAge(l.dob, 'days')}, {getAge(l.dob, 'weeks')})
                                                                                </span> • {representativeStatus} ({l.count}p)
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </td>
                                                    );
                                                    default: return null;
                                                }
                                            })}
                                            <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', alignItems: 'center', minHeight: '32px' }}>
                                                    {(() => {
                                                        const matingLitters = data.litters?.filter(l => l.matingId === item.id) || [];
                                                        if (matingLitters.length > 0) {
                                                            return (
                                                                <div style={{ display: 'flex', gap: '2px', alignItems: 'center', marginRight: '0.4rem' }}>
                                                                    {matingLitters.map(l => (
                                                                        <button
                                                                            key={l.id}
                                                                            type="button"
                                                                            className="btn btn-ghost"
                                                                            style={{ padding: '0.4rem', color: 'var(--accent-primary)', opacity: 0.8, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                                            onClick={(e) => { e.stopPropagation(); openModal(l, 'litters'); }}
                                                                            title={`Edit pups: ${l.dob} (${l.count}p)`}
                                                                        >
                                                                            <PupAnimalIcon size={22} />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })()}
                                                    <button className="btn btn-ghost" style={{ padding: '0.4rem', color: '#7ea310', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); handleCreateLitter(item.id); }} title="Add litter">
                                                        <Baby size={16} strokeWidth={1.5} />
                                                    </button>
                                                    <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem', color: '#71717a', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); openModal(item); }}>
                                                        <Edit2 size={16} style={{ pointerEvents: 'none' }} strokeWidth={1.5} />
                                                    </button>
                                                    <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem', color: '#ae2e2e', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); handleDelete('matings', item.id); }}>
                                                        <Trash2 size={16} style={{ pointerEvents: 'none' }} strokeWidth={1.5} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )
                }

                {
                    activeSubTab === 'rooms' && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                            <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--card-bg)' }}>
                                <tr style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={thStyle} onClick={() => requestSort('roomName')}>Room <SortIcon column="roomName" /></th>
                                    <th style={thStyle} onClick={() => requestSort('name')}>Rack Name <SortIcon column="name" /></th>
                                    <th style={{ padding: '0.6rem' }}>Layout Config</th>
                                    <th style={{ padding: '0.6rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => {
                                    const displayRoom = item.roomName || (item.name?.includes('/') ? item.name.split('/')[0] : '');
                                    const displayRack = item.name?.includes('/') ? item.name.split('/')[1] : item.name;
                                    return (
                                        <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '0.6rem' }}>{displayRoom}</td>
                                            <td style={{ padding: '0.6rem', fontWeight: 800 }}>{displayRack}</td>
                                            <td style={{ padding: '0.6rem' }}>{item.rows}R x {item.cols}C (Row: {item.rowFormat === 'A' ? 'A,B..' : '1,2..'}, Col: {item.colFormat === 'A' ? 'A,B..' : '1,2..'})</td>
                                            <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem' }} onClick={(e) => { e.stopPropagation(); openModal(item); }}>
                                                        <Edit2 size={14} style={{ pointerEvents: 'none' }} />
                                                    </button>
                                                    <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); handleDelete('rooms', item.id); }}>
                                                        <Trash2 size={14} style={{ pointerEvents: 'none' }} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )
                }

                {
                    activeSubTab === 'cages' && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                            <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--card-bg)' }}>
                                <tr style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ ...thStyle, width: '40px' }}>
                                        <input
                                            type="checkbox"
                                            checked={items.length > 0 && items.every(item => selectedCages.includes(item.id))}
                                            onChange={(e) => {
                                                const currentIds = items.map(item => item.id);
                                                if (e.target.checked) {
                                                    setSelectedCages([...new Set([...selectedCages, ...currentIds])]);
                                                } else {
                                                    setSelectedCages(selectedCages.filter(id => !currentIds.includes(id)));
                                                }
                                            }}
                                        />
                                    </th>
                                    {(columnOrders.cages || DEFAULT_COLUMN_ORDERS.cages).map(colKey => {
                                        if (!columnSettings.cages?.[colKey]) return null;
                                        switch (colKey) {
                                            case 'room': return <th key="room" style={{ ...thStyle, width: '80px' }} onClick={() => requestSort('room')}>Room <SortIcon column="room" /></th>;
                                            case 'rack': return <th key="rack" style={{ ...thStyle, width: '80px' }}>Rack</th>;
                                            case 'tag': return (
                                                <th key="tag" style={{ ...thStyle, width: '160px' }} onClick={() => requestSort('tag')}>
                                                    Location <SortIcon column="tag" />
                                                </th>
                                            );
                                            case 'line': return <th key="line" style={{ ...thStyle, width: '120px' }} onClick={() => requestSort('line')}>Line <SortIcon column="line" /></th>;
                                            case 'count': return <th key="count" style={{ ...thStyle, width: '80px' }} onClick={() => requestSort('count')}>Count <SortIcon column="count" /></th>;
                                            case 'status': return <th key="status" style={{ ...thStyle, width: '120px' }} onClick={() => requestSort('status')}>Status <SortIcon column="status" /></th>;
                                            case 'age': return <th key="age" style={{ ...thStyle, width: '120px' }}>Age</th>;
                                            case 'occupants': return <th key="occupants" style={{ padding: '0.6rem' }}>Occupants (Tag/ID)</th>;
                                            case 'comment': return <th key="comment" style={{ padding: '0.6rem' }}>Comment</th>;
                                            default: return null;
                                        }
                                    })}
                                    <th style={{ padding: '0.6rem', textAlign: 'right', width: '80px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => {
                                    const roomObj = data.rooms?.find(r => r.name === item.room);
                                    const displayRoom = roomObj?.roomName || (item.room?.includes('/') ? item.room.split('/')[0] : item.room);
                                    const displayRack = (item.room?.includes('/') ? item.room.split('/')[1] : (roomObj?.roomName ? roomObj.name : ''));

                                    const activeMiceInCage = data.mice?.filter(m => m.cageTag === item.tag && m._roomSearch === item.room && !['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(m.status)) || [];
                                    const lines = [...new Set(activeMiceInCage.map(m => m.line).filter(Boolean))];

                                    const inactiveStates = ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred', 'Terminated', 'Inactive'];
                                    const allMiceInCage = data.mice?.filter(m => m.cageTag === item.tag && m._roomSearch === item.room) || [];
                                    const miceInCage = allMiceInCage.filter(m => {
                                        const s = m.status || m.state;
                                        return !inactiveStates.includes(s);
                                    });

                                    const rawStatuses = [...new Set(miceInCage.map(m => m.status || m.state || 'Stock'))];
                                    const hasOtherThanStock = rawStatuses.some(s => s !== 'Stock');
                                    const cageStatuses = hasOtherThanStock ? rawStatuses.filter(s => s !== 'Stock') : rawStatuses;

                                    const ages = miceInCage.map(m => m.dob).filter(Boolean).map(dob => {
                                        const d = new Date(dob);
                                        if (isNaN(d.getTime())) return null;
                                        return Math.floor((new Date() - d) / (1000 * 60 * 60 * 24));
                                    }).filter(a => a !== null);

                                    let displayAge = '-';
                                    if (ages.length > 0) {
                                        const minAge = Math.min(...ages);
                                        const maxAge = Math.max(...ages);
                                        if (ageFormat === 'days') {
                                            displayAge = minAge === maxAge ? `${minAge}d` : `${minAge}-${maxAge}d`;
                                        } else if (ageFormat === 'weeks') {
                                            const minW = (minAge / 7).toFixed(1);
                                            const maxW = (maxAge / 7).toFixed(1);
                                            displayAge = minW === maxW ? `${minW}w` : `${minW}-${maxW}w`;
                                        } else {
                                            const minM = (minAge / 30.417).toFixed(1);
                                            const maxM = (maxAge / 30.417).toFixed(1);
                                            displayAge = minM === maxM ? `${minM}m` : `${minM}-${maxM}m`;
                                        }
                                    }

                                    return (
                                        <tr key={item.id} style={{
                                            borderBottom: '1px solid var(--glass-border)',
                                            background: selectedCages.includes(item.id) ? 'rgba(79, 70, 229, 0.05)' : 'transparent'
                                        }}>
                                            <td style={{ padding: '0.6rem' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCages.includes(item.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedCages([...selectedCages, item.id]);
                                                        else setSelectedCages(selectedCages.filter(id => id !== item.id));
                                                    }}
                                                />
                                            </td>
                                            {(columnOrders.cages || DEFAULT_COLUMN_ORDERS.cages).map(colKey => {
                                                if (!columnSettings.cages?.[colKey]) return null;
                                                switch (colKey) {
                                                    case 'room': return <td key="room" style={{ padding: '0.6rem' }}>{displayRoom}</td>;
                                                    case 'rack': return <td key="rack" style={{ padding: '0.6rem' }}>{displayRack}</td>;
                                                    case 'tag': return (
                                                        <td key="tag" style={{ padding: '0.6rem', fontWeight: 800 }}>
                                                            {getCageDisplayTag(data.settings, item.room, item.tag)}
                                                        </td>
                                                    );
                                                    case 'line': return (
                                                        <td key="line" style={{ padding: '0.6rem' }}>
                                                            {lines.join(', ') || '-'}
                                                        </td>
                                                    );
                                                    case 'count': return <td key="count" style={{ padding: '0.6rem', fontWeight: 700 }}>{miceInCage.length}</td>;
                                                    case 'status': return (
                                                        <td key="status" style={{ padding: '0.6rem' }}>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                                {cageStatuses.map(st => (
                                                                    <span key={st} className={`badge badge-${st.toLowerCase().replace('/', '-')}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                                                                        {st}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    );
                                                    case 'age': return (
                                                        <td key="age" style={{ padding: '0.6rem', fontSize: '0.8rem' }}>
                                                            {displayAge}
                                                        </td>
                                                    );
                                                    case 'occupants': return (
                                                        <td key="occupants" style={{ padding: '0.6rem' }}>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                                {miceInCage.map(m => (
                                                                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                                                        <span
                                                                            onClick={() => editPupInLitters(m)}
                                                                            style={{
                                                                                cursor: 'pointer',
                                                                                fontWeight: 800,
                                                                                fontSize: '0.75rem',
                                                                                color: (m.sex === '♂' || m.sex === 'Male') ? '#3b82f6' : (m.sex === '♀' || m.sex === 'Female') ? '#ec4899' : 'var(--text-main)',
                                                                                textDecoration: 'underline',
                                                                                textUnderlineOffset: '2px'
                                                                            }}
                                                                            title={`Click to view ${m.tag || m.id}`}
                                                                        >
                                                                            {m.tag || m.id}
                                                                        </span>
                                                                        {m.genotype && (
                                                                            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', lineHeight: '1', whiteSpace: 'nowrap' }}>
                                                                                {m.genotype}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                                {miceInCage.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', opacity: 0.5 }}>Empty</span>}
                                                            </div>
                                                        </td>
                                                    );
                                                    case 'comment': return (
                                                        <td key="comment" style={{ padding: '0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                            {item.comment || '-'}
                                                        </td>
                                                    );
                                                    default: return null;
                                                }
                                            })}
                                            <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                                    <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); openModal(item); }}>
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--danger)', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleDelete('cages', item.id); }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )
                }

                {
                    activeSubTab === 'litters' && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                            <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--card-bg)' }}>
                                <tr style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ width: '32px', padding: '0.6rem' }}></th>
                                    {(columnOrders.litters || DEFAULT_COLUMN_ORDERS.litters).map(colKey => {
                                        if (!columnSettings.litters?.[colKey]) return null;
                                        switch (colKey) {
                                            case 'room': return <th key="room" style={{ ...thStyle, width: '80px' }} onClick={() => requestSort('room')}>Room <SortIcon column="room" /></th>;
                                            case 'rack': return <th key="rack" style={{ ...thStyle, width: '80px' }}>Rack</th>;
                                            case 'cage': return (
                                                <th key="cage" style={{ ...thStyle, width: '130px' }} onClick={() => requestSort('cage')}>
                                                    Location <SortIcon column="cage" />
                                                </th>
                                            );
                                            case 'parents': return <th key="parents" style={{ padding: '0.6rem', width: '160px' }}>Parents / Detail</th>;
                                            case 'status': return <th key="status" style={{ ...thStyle, width: '90px' }} onClick={() => requestSort('status')}>Status <SortIcon column="status" /></th>;
                                            case 'dob': return <th key="dob" style={{ ...thStyle, width: '110px' }} onClick={() => requestSort('dob')}>DOB <SortIcon column="dob" /></th>;
                                            case 'weanDate': return <th key="weanDate" style={{ ...thStyle, width: '110px' }} onClick={() => requestSort('dob')}>Wean Plan <SortIcon column="dob" /></th>;
                                            case 'age': return <th key="age" style={thStyle} onClick={() => requestSort('dob')}>Age <SortIcon column="dob" /></th>;
                                            case 'info': return <th key="info" style={{ padding: '0.6rem' }}>Info</th>;
                                            default: return null;
                                        }
                                    })}
                                    <th style={{ padding: '0.6rem', textAlign: 'right', width: '100px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => {
                                    let pups = activeSubTab === 'litters' ? (data.mice?.filter(m => m.litterId === item.id) || []) : [];
                                    // If search is active, filter pups list in expanded view too
                                    if (lowerSearch && activeSubTab === 'litters') {
                                        pups = pups.filter(p => 
                                            (p.id && String(p.id).toLowerCase().includes(lowerSearch)) ||
                                            (p.tag && String(p.tag).toLowerCase().includes(lowerSearch)) ||
                                            (p.genotype && String(p.genotype).toLowerCase().includes(lowerSearch)) ||
                                            (p.status && String(p.status).toLowerCase().includes(lowerSearch))
                                        );
                                    }
                                    const m = data.matings?.find(x => x.id === item.matingId);
                                    const targetCageTag = item.cageTag || m?.cageTag;
                                    const cage = data.cages?.find(c => c.tag === targetCageTag && c.room === item._roomSearch);
                                    const roomObj = cage ? data.rooms?.find(r => r.name === cage.room) : null;
                                    const displayRoom = roomObj?.roomName || (cage?.room?.includes('/') ? cage.room.split('/')[0] : cage?.room) || '-';
                                    const displayRack = (cage?.room?.includes('/') ? cage.room.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '-';

                                    return (
                                        <React.Fragment key={item.id}>
                                            {(() => {
                                                const isExpanded = activeSubTab === 'litters' && expandedLitters.includes(item.id);
                                                return (
                                                    <tr
                                                        onClick={() => toggleLitterExpansion(item.id)}
                                                        style={{
                                                            borderBottom: isExpanded ? 'none' : '1px solid var(--glass-border)',
                                                            cursor: 'pointer',
                                                            background: isExpanded ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent',
                                                            transition: 'background 0.2s ease'
                                                        }}
                                                    >
                                                        <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                                                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                        </td>
                                                        {(columnOrders.litters || DEFAULT_COLUMN_ORDERS.litters).map(colKey => {
                                                            if (!columnSettings.litters?.[colKey]) return null;
                                                            switch (colKey) {
                                                                case 'room': return <td key="room" style={{ padding: '0.6rem' }}>{displayRoom}</td>;
                                                                case 'rack': return <td key="rack" style={{ padding: '0.6rem' }}>{displayRack}</td>;
                                                                case 'cage': return <td key="cage" style={{ padding: '0.6rem', fontWeight: 800 }}>{getCageDisplayTag(data.settings, item._roomSearch, targetCageTag)}</td>;
                                                                case 'parents': return (
                                                                    <td key="parents" style={{ padding: '0.6rem', width: '160px' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                                            {activeSubTab === 'litters' ? (
                                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                    {item.matingId && (
                                                                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                                            {(() => {
                                                                                                const matingObj = data.matings?.find(x => x.id === item.matingId);
                                                                                                if (!matingObj) return null;
                                                                                                const sire = getMouseInfo(matingObj.sireId);
                                                                                                const dam = getMouseInfo(matingObj.damId);

                                                                                                const sireMouse = data.mice?.find(ms => ms.id === sire.id);
                                                                                                const damMouse = data.mice?.find(ms => ms.id === dam.id);
                                                                                                const inactiveStates = ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'];
                                                                                                const sireIsInactive = sireMouse && inactiveStates.includes(sireMouse.status);
                                                                                                const damIsInactive = damMouse && inactiveStates.includes(damMouse.status);

                                                                                                return (
                                                                                                    <>
                                                                                                        <div
                                                                                                            style={{ display: 'flex', flexDirection: 'column', cursor: sireMouse ? 'pointer' : 'default', opacity: sireIsInactive ? 0.35 : 1 }}
                                                                                                            onClick={(e) => { if (sireMouse) { e.stopPropagation(); openModal(sireMouse, 'mice'); } }}
                                                                                                        >
                                                                                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', opacity: sireIsInactive ? 0.35 : 0.7 }}>{sire.id}</span>
                                                                                                            <span style={{ fontWeight: 800, color: sireIsInactive ? 'var(--text-muted)' : '#3b82f6', fontSize: '0.85rem', textDecoration: sireMouse ? 'underline' : 'none' }}>{sire.tag}</span>
                                                                                                        </div>
                                                                                                        <span style={{ color: 'var(--text-muted)', opacity: 0.4 }}>×</span>
                                                                                                        <div
                                                                                                            style={{ display: 'flex', flexDirection: 'column', cursor: damMouse ? 'pointer' : 'default', opacity: damIsInactive ? 0.35 : 1 }}
                                                                                                            onClick={(e) => { if (damMouse) { e.stopPropagation(); openModal(damMouse, 'mice'); } }}
                                                                                                        >
                                                                                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', opacity: damIsInactive ? 0.35 : 0.7 }}>{dam.id}</span>
                                                                                                            <span style={{ fontWeight: 800, color: damIsInactive ? 'var(--text-muted)' : '#ec4899', fontSize: '0.85rem', textDecoration: damMouse ? 'underline' : 'none' }}>{dam.tag}</span>
                                                                                                        </div>
                                                                                                    </>
                                                                                                );
                                                                                            })()}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ) : (
                                                                                <div style={{ fontWeight: 800 }}>{item.tag || item.id}</div>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                );
                                                                case 'status': return (
                                                                    <td key="status" style={{ padding: '0.6rem', width: '90px' }}>
                                                                        {(() => {
                                                                            const sLower = (item.status || '').toLowerCase();
                                                                            const displayStatus = sLower === 'active' || !item.status ? 'Nursing' : (sLower === 'inactive' || sLower === 'weaned' ? 'Weaned' : item.status);
                                                                            return <span className={`badge badge-${displayStatus.toLowerCase()}`}>{displayStatus}</span>;
                                                                        })()}
                                                                    </td>
                                                                );
                                                                case 'dob': return <td key="dob" style={{ padding: '0.6rem', width: '110px' }}>{formatDate(item.dob)}</td>;
                                                                case 'weanDate': return <td key="weanDate" style={{ padding: '0.6rem', width: '110px', color: 'var(--accent-primary)', fontWeight: 700 }}>{getScheduledWeanDate(item.dob)}</td>;
                                                                case 'age': return <td key="age" style={{ padding: '0.6rem', fontWeight: 600 }}>{getAge(item.dob, ageFormat)}</td>;
                                                                case 'info': return (
                                                                    <td key="info" style={{ padding: '0.6rem', color: 'var(--text-muted)' }}>
                                                                        {activeSubTab !== 'litters' && JSON.stringify(item)}
                                                                        {activeSubTab === 'litters' && (
                                                                            <div>
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                                                    <span>Count: {item.count}</span>
                                                                                </div>
                                                                                {item.endDate && <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>Weaned: {item.endDate}</div>}
                                                                                {item.comment && <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Note: {item.comment}</div>}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                );
                                                                default: return null;
                                                            }
                                                        })}
                                                        <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                                                                <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem', border: '1px solid var(--card-border)', color: 'var(--text-main)' }} onClick={(e) => { e.stopPropagation(); openModal(item); }} title="Edit Litter Info">
                                                                    <Edit2 size={14} style={{ pointerEvents: 'none' }} />
                                                                </button>
                                                                <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--danger)', border: '1px solid var(--card-border)' }} onClick={(e) => { e.stopPropagation(); handleDelete(activeSubTab, item.id); }}>
                                                                    <Trash2 size={14} style={{ pointerEvents: 'none' }} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })()}
                                            {activeSubTab === 'litters' && expandedLitters.includes(item.id) && (
                                                <tr style={{ background: 'rgba(var(--accent-rgb), 0.05)' }}>
                                                    <td colSpan={9} style={{ padding: '0 1.5rem 1rem 3.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', background: 'var(--card-bg)', padding: '0.4rem 1rem', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <div style={{ fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <PupAnimalIcon size={20} /> Pup Records ({pups.length})
                                                                </div>
                                                                {pups.filter(p => selectedPups.includes(p.id)).length > 0 && (
                                                                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1rem' }}>
                                                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{pups.filter(p => selectedPups.includes(p.id)).length} Selected:</span>
                                                                        <select
                                                                            style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--accent-primary)', background: 'var(--background)' }}
                                                                            onChange={(e) => {
                                                                                const selectedItems = pups.filter(p => selectedPups.includes(p.id));
                                                                                bulkUpdatePups(selectedItems, { sex: e.target.value });
                                                                                setSelectedPups(prev => prev.filter(id => !pups.some(p => p.id === id)));
                                                                            }}
                                                                            value=""
                                                                        >
                                                                            <option value="" disabled>Set Sex...</option>
                                                                            <option value="♂">♂ Male</option>
                                                                            <option value="♀">♀ Female</option>
                                                                            <option value="Unknown">? Unknown</option>
                                                                        </select>
                                                                        <select
                                                                            style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--accent-primary)', background: 'var(--background)' }}
                                                                            onChange={(e) => {
                                                                                const selectedItems = pups.filter(p => selectedPups.includes(p.id));
                                                                                bulkUpdatePups(selectedItems, { line: e.target.value });
                                                                                setSelectedPups(prev => prev.filter(id => !pups.some(p => p.id === id)));
                                                                            }}
                                                                            value=""
                                                                        >
                                                                            <option value="" disabled>Set Mouseline...</option>
                                                                            {data.strains?.map(s => (
                                                                                <option key={s.id} value={s.name}>{s.name}</option>
                                                                            ))}
                                                                        </select>
                                                                        <select
                                                                            style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--accent-primary)', background: 'var(--background)' }}
                                                                            onChange={(e) => {
                                                                                const selectedItems = pups.filter(p => selectedPups.includes(p.id));
                                                                                bulkUpdatePups(selectedItems, { status: e.target.value });
                                                                                setSelectedPups(prev => prev.filter(id => !pups.some(p => p.id === id)));
                                                                            }}
                                                                            value=""
                                                                        >
                                                                            <option value="" disabled>Set Status...</option>
                                                                            <option value="Nursing">Nursing</option>
                                                                            <option value="Weaning">Weaning</option>
                                                                            <option value="Stock">Stock</option>
                                                                            <option value="Culled">Culled</option>
                                                                        </select>
                                                                        {(() => {
                                                                            const selectedItems = pups.filter(p => selectedPups.includes(p.id));
                                                                            const samplePup = selectedItems[0];
                                                                            const selectedLine = data.strains?.find(s => s.name === samplePup?.line);
                                                                            const genotypes = selectedLine?.genotypes ? selectedLine.genotypes.split(',').map(g => g.trim()).filter(Boolean) : [];
                                                                            
                                                                            return (
                                                                                <select
                                                                                    style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--accent-primary)', background: 'var(--background)' }}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value === "__CUSTOM__") {
                                                                                            const customValue = prompt("Enter Genotype:", samplePup?.genotype || "");
                                                                                            if (customValue !== null) {
                                                                                                bulkUpdatePups(selectedItems, { genotype: customValue });
                                                                                                setSelectedPups(prev => prev.filter(id => !pups.some(p => p.id === id)));
                                                                                            }
                                                                                        } else if (e.target.value) {
                                                                                            bulkUpdatePups(selectedItems, { genotype: e.target.value });
                                                                                            setSelectedPups(prev => prev.filter(id => !pups.some(p => p.id === id)));
                                                                                        }
                                                                                    }}
                                                                                    value=""
                                                                                >
                                                                                    <option value="" disabled>Set Genotype...</option>
                                                                                    {genotypes.map(g => (
                                                                                        <option key={g} value={g}>{g}</option>
                                                                                    ))}
                                                                                    <option value="__CUSTOM__">Custom...</option>
                                                                                </select>
                                                                            );
                                                                        })()}
                                                                        <button
                                                                            className="btn btn-ghost"
                                                                            style={{ fontSize: '0.7rem', color: 'var(--danger)', padding: '2px 8px', border: '1px solid var(--danger)', opacity: 0.8 }}
                                                                            onClick={async () => {
                                                                                const sessionSelectedIds = pups.filter(p => selectedPups.includes(p.id)).map(p => p.id);
                                                                                if (confirm(`Delete ${sessionSelectedIds.length} selected pup records?`)) {
                                                                                    for (const id of sessionSelectedIds) {
                                                                                        await fetch(`/api/data?type=mice&id=${id}`, { method: 'DELETE' });
                                                                                    }
                                                                                    onUpdate();
                                                                                    setSelectedPups(prev => prev.filter(id => !sessionSelectedIds.includes(id)));
                                                                                }
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                {item.status !== 'Inactive' && (
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.8rem', height: 'auto', background: 'var(--accent-secondary)' }}
                                                                        onClick={() => handleWeanLitter(item)}
                                                                    >
                                                                        Wean Litter (Transition)
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className="btn btn-primary"
                                                                    style={{ fontSize: '0.75rem', padding: '0.3rem 1rem', height: 'auto', background: pups.length === 0 ? 'var(--success)' : 'var(--accent-primary)', opacity: 0.9 }}
                                                                    onClick={async () => {
                                                                        if (pups.length === 0) {
                                                                            await generatePupsForLitter(item);
                                                                        } else {
                                                                            await addSinglePupToLitter(item);
                                                                            // Also update the litter count field
                                                                            const newCount = (parseInt(item.count, 10) || 0) + 1;
                                                                            await fetch('/api/data', {
                                                                                method: 'POST',
                                                                                headers: { 'Content-Type': 'application/json' },
                                                                                body: JSON.stringify({ type: 'litters', item: { ...item, count: newCount } })
                                                                            });
                                                                            onUpdate();
                                                                        }
                                                                    }}
                                                                >
                                                                    {pups.length === 0 ? 'Generate Initial Records' : '+ Add Pup'}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {pups.length > 0 && (
                                                            <div style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
                                                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                                                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--card-border)' }}>
                                                                        <tr style={{ textAlign: 'left' }}>
                                                                            <th style={{ padding: '0.6rem 1rem', width: '40px' }}>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={pups.length > 0 && pups.every(p => selectedPups.includes(p.id))}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.checked) setSelectedPups([...new Set([...selectedPups, ...pups.map(p => p.id)])]);
                                                                                        else setSelectedPups(selectedPups.filter(id => !pups.some(p => p.id === id)));
                                                                                    }}
                                                                                />
                                                                            </th>
                                                                            <th style={{ padding: '0.4rem', width: '80px' }}>ID</th>
                                                                            <th style={{ padding: '0.4rem', width: '100px' }}>Tag</th>
                                                                            <th style={{ padding: '0.4rem', width: '80px' }}>Sex</th>
                                                                            <th style={{ padding: '0.4rem', width: '130px' }}>Mouseline</th>
                                                                            <th style={{ padding: '0.4rem' }}>Genotype</th>
                                                                            <th style={{ padding: '0.4rem', width: '130px' }}>Status</th>
                                                                            <th style={{ padding: '0.4rem', textAlign: 'right', width: '80px' }}>Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {pups.map(p => (
                                                                            <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                                                <td style={{ padding: '0.6rem 1rem' }}>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={selectedPups.includes(p.id)}
                                                                                        onChange={(e) => {
                                                                                            if (e.target.checked) setSelectedPups([...selectedPups, p.id]);
                                                                                            else setSelectedPups(selectedPups.filter(id => id !== p.id));
                                                                                        }}
                                                                                    />
                                                                                </td>
                                                                                <td style={{ padding: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.6 }}>
                                                                                    {p.id}
                                                                                </td>
                                                                                <td style={{ padding: '0.4rem' }}>
                                                                                    <input
                                                                                        type="text"
                                                                                        defaultValue={p.tag || ''}
                                                                                        placeholder="P-Tag"
                                                                                        onBlur={(e) => bulkUpdatePups([p], { tag: e.target.value })}
                                                                                        style={{ width: '100%', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '2px 6px', background: 'transparent', fontSize: '0.8rem', fontWeight: p.tag ? 800 : 400 }}
                                                                                    />
                                                                                </td>
                                                                                <td style={{ padding: '0.4rem' }}>
                                                                                    <div style={{ position: 'relative', width: '100%' }}>
                                                                                        <select
                                                                                            value={p.sex}
                                                                                            onChange={(e) => bulkUpdatePups([p], { sex: e.target.value })}
                                                                                            style={{ width: '100%', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '2px 14px 2px 4px', background: 'transparent', fontSize: '0.85rem', fontWeight: 800, color: p.sex === '♂' ? '#3b82f6' : p.sex === '♀' ? '#ec4899' : 'inherit', appearance: 'none', WebkitAppearance: 'none' }}
                                                                                        >
                                                                                            <option value="Unknown" style={{ color: 'var(--text-main)', fontWeight: 800 }}>?</option>
                                                                                            <option value="♂" style={{ color: 'var(--text-main)', fontWeight: 800 }}>♂</option>
                                                                                            <option value="♀" style={{ color: 'var(--text-main)', fontWeight: 800 }}>♀</option>
                                                                                        </select>
                                                                                        <div style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>
                                                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ padding: '0.4rem' }}>
                                                                                    <select
                                                                                        value={p.line || ''}
                                                                                        onChange={(e) => bulkUpdatePups([p], { line: e.target.value })}
                                                                                        style={{ width: '100%', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '2px', background: 'transparent', fontSize: '0.8rem' }}
                                                                                    >
                                                                                        <option value="">-</option>
                                                                                        {data.strains?.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                                                                    </select>
                                                                                </td>
                                                                                <td style={{ padding: '0.4rem' }}>
                                                                                    {(() => {
                                                                                        const selectedLine = data.strains?.find(s => s.name === p.line);
                                                                                        const genotypes = selectedLine?.genotypes ? selectedLine.genotypes.split(',').map(g => g.trim()).filter(Boolean) : [];
                                                                                        if (genotypes.length > 0) {
                                                                                            return (
                                                                                                <select
                                                                                                    value={p.genotype || ''}
                                                                                                    onChange={(e) => bulkUpdatePups([p], { genotype: e.target.value })}
                                                                                                    style={{ width: '100%', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '2px', background: 'transparent', fontSize: '0.8rem' }}
                                                                                                >
                                                                                                    <option value="">-</option>
                                                                                                    {genotypes.map(g => <option key={g} value={g}>{g}</option>)}
                                                                                                    {!genotypes.includes(p.genotype) && p.genotype && (
                                                                                                        <option value={p.genotype}>{p.genotype}</option>
                                                                                                    )}
                                                                                                </select>
                                                                                            );
                                                                                        }
                                                                                        return (
                                                                                            <input
                                                                                                type="text"
                                                                                                defaultValue={p.genotype || ''}
                                                                                                placeholder="e.g. +/-"
                                                                                                onBlur={(e) => bulkUpdatePups([p], { genotype: e.target.value })}
                                                                                                style={{ width: '100%', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '2px 8px', background: 'transparent', fontSize: '0.8rem' }}
                                                                                            />
                                                                                        );
                                                                                    })()}
                                                                                </td>
                                                                                <td style={{ padding: '0.4rem' }}>
                                                                                    <select
                                                                                        value={p.status}
                                                                                        onChange={(e) => bulkUpdatePups([p], { status: e.target.value })}
                                                                                        style={{ width: '100%', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '2px', background: 'transparent', fontSize: '0.8rem' }}
                                                                                    >
                                                                                        <option value="Nursing">Nursing</option>
                                                                                        <option value="Weaning">Weaning</option>
                                                                                        <option value="Stock">Stock</option>
                                                                                        <option value="Experiment">Experiment</option>
                                                                                        <option value="Euthanasia">Euthanasia</option>
                                                                                        <option value="Tissue Collection">Tissue Collection</option>
                                                                                        <option value="Dead">Dead</option>
                                                                                        <option value="Missing">Missing</option>
                                                                                        <option value="Transferred">Transferred</option>
                                                                                    </select>
                                                                                </td>
                                                                                <td style={{ padding: '0.4rem', textAlign: 'right' }}>
                                                                                    <div style={{ display: 'flex', gap: '0.2rem', justifyContent: 'flex-end' }}>
                                                                                        <button type="button" className="btn btn-ghost" style={{ padding: '0.2rem', color: 'var(--text-muted)', opacity: 0.6 }} onClick={(e) => { e.stopPropagation(); editPupInLitters(p); }}>
                                                                                            <Edit2 size={13} style={{ pointerEvents: 'none' }} />
                                                                                        </button>
                                                                                        <button type="button" className="btn btn-ghost" style={{ padding: '0.2rem', color: 'var(--danger)', opacity: 0.6 }} onClick={(e) => { e.stopPropagation(); deletePup(p.id); }}>
                                                                                            <Trash2 size={13} style={{ pointerEvents: 'none' }} />
                                                                                        </button>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                            }
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                {activeSubTab === 'strains' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--card-bg)' }}>
                            <tr style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={thStyle} onClick={() => requestSort('name')}>Mouseline <SortIcon column="name" /></th>
                                <th style={thStyle} onClick={() => requestSort('background')}>Genetic Background <SortIcon column="background" /></th>
                                <th style={thStyle} onClick={() => requestSort('count')}>Live (Total) <SortIcon column="count" /></th>
                                <th style={{ padding: '0.6rem' }}>Description / Details</th>
                                <th style={{ padding: '0.6rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(items || []).map(item => {
                                const mList = data.mice?.filter(m => m.line === item.name) || [];
                                const total = mList.length;
                                const isNotLive = (state) => ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(state);
                                const live = mList.filter(m => !isNotLive(m.state)).length;
                                return (
                                    <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '0.6rem', fontWeight: 800 }}>{item.name}</td>
                                        <td style={{ padding: '0.6rem' }}>{item.background || '-'}</td>
                                        <td style={{ padding: '0.6rem', fontWeight: 700 }}>{live} ({total})</td>
                                        <td style={{ padding: '0.6rem' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.description}</div>
                                            {item.comment && <div style={{ fontSize: '0.7rem', opacity: 0.7, fontStyle: 'italic' }}>{item.comment}</div>}
                                        </td>
                                        <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem' }} onClick={(e) => { e.stopPropagation(); openModal(item); }}>
                                                    <Edit2 size={14} style={{ pointerEvents: 'none' }} />
                                                </button>
                                                <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); handleDelete('strains', item.id); }}>
                                                    <Trash2 size={14} style={{ pointerEvents: 'none' }} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!items || items.length === 0) && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No mouse lines found. Click "Add Mouseline" to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        );

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {renderSubHeader()}
                {renderRecordTable()}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
            {/* Main Tabs and Primary Actions Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.04)', padding: '3px', borderRadius: '9px', gap: '2px', alignItems: 'center' }}>
                    {activeSubTab !== 'summary' && subTabs.map(tab => {
                        const isActive = activeSubTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveSubTab(tab.id);
                                    onSubTabChange?.(tab.id);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '0.35rem 0.75rem',
                                    height: '32px',
                                    borderRadius: '7px',
                                    border: 'none',
                                    background: isActive ? 'var(--accent-primary)' : 'transparent',
                                    color: isActive ? 'white' : 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                    fontWeight: isActive ? 700 : 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease-out',
                                    boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                                    lineHeight: 1
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center' }}>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button 
                        className="btn btn-ghost" 
                        style={{ height: '32px', fontSize: '0.78rem', padding: '0 0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', fontWeight: 500 }} 
                        onClick={handleExportCSV}
                    >
                        Export {activeSubTab === 'summary' ? 'Summary' : activeSubTab === 'mice' ? 'Mice' : activeSubTab === 'matings' ? 'Mating' : activeSubTab === 'litters' ? 'Litter' : activeSubTab === 'cages' ? 'Cage' : activeSubTab === 'rooms' ? 'Room' : activeSubTab === 'strains' ? 'Mouseline' : ''} CSV
                    </button>
                    {activeSubTab !== 'litters' && activeSubTab !== 'summary' && (
                        <button 
                            className="btn btn-primary" 
                            onClick={() => openModal()} 
                            style={{ height: '32px', padding: '0 0.9rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            <Plus size={16} /> {
                                activeSubTab === 'mice' ? 'Add Mice' :
                                    activeSubTab === 'matings' ? 'Add New Mating' :
                                        activeSubTab === 'cages' ? 'Add New Cage' :
                                            activeSubTab === 'rooms' ? 'Add New Room & Racks' :
                                                activeSubTab === 'strains' ? 'Add Mouseline' :
                                                    `Add New ${activeSubTab.slice(0, -1)}`
                            }
                        </button>
                    )}
                </div>
            </div>

            {/* Row 2: Bulk Actions (Conditional) */}
            {activeSubTab === 'mice' && selectedMice.length > 0 && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    background: 'rgba(79, 70, 229, 0.05)',
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(79, 70, 229, 0.1)',
                    animation: 'slideDown 0.2s ease-out',
                    marginBottom: '1rem'
                }}>
                    {/* Header with Selection Info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{selectedMice.length} Selected (Bulk Actions)</span>
                            <button className="btn btn-ghost" style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem', color: 'var(--text-muted)', height: 'auto' }} onClick={() => setSelectedMice([])}>Clear Selection</button>
                        </div>
                        {(() => {
                            const selectedMiceObjs = data.mice?.filter(m => selectedMice.includes(m.id)) || [];
                            const males = selectedMiceObjs.filter(m => m.sex === '♂' || m.sex === 'Male');
                            const females = selectedMiceObjs.filter(m => m.sex === '♀' || m.sex === 'Female');
                            const hasPair = males.length > 0 && females.length > 0;
                            return (
                                <button
                                    type="button"
                                    className={hasPair ? "btn btn-primary" : "btn btn-ghost"}
                                    style={{
                                        height: '28px',
                                        padding: '0 0.85rem',
                                        fontSize: '0.75rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontWeight: 600,
                                        ...(!hasPair ? {
                                            background: 'transparent',
                                            borderColor: 'rgba(var(--accent-rgb), 0.35)',
                                            color: 'var(--accent-primary)'
                                        } : {})
                                    }}
                                    onClick={handleAddMatingFromSelectedMice}
                                    title={hasPair
                                        ? `Create mating with ♂${males[0].tag || males[0].id} and ♀${females[0].tag || females[0].id}`
                                        : 'Create mating with selected mice'}
                                >
                                    <Heart size={13} />
                                    <span>Add Mating</span>
                                    {hasPair && (
                                        <span style={{ fontSize: '0.7rem', opacity: 0.95, fontWeight: 600, background: 'rgba(255, 255, 255, 0.2)', padding: '1px 6px', borderRadius: '4px', marginLeft: '2px' }}>
                                            ♂ {males[0].tag || males[0].id} × ♀ {females[0].tag || females[0].id}
                                        </span>
                                    )}
                                    {!hasPair && (males.length > 0 || females.length > 0) && (
                                        <span style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 500, marginLeft: '2px' }}>
                                            ({males.length > 0 ? `♂${males.length}` : ''}{males.length > 0 && females.length > 0 ? ', ' : ''}{females.length > 0 ? `♀${females.length}` : ''})
                                        </span>
                                    )}
                                </button>
                            );
                        })()}
                    </div>

                    {/* Action Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid rgba(79, 70, 229, 0.1)', paddingTop: '0.8rem' }}>
                        {/* Row 1: Status Updates */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', width: '50px' }}>Status</span>
                                <select style={{ height: '30px', fontSize: '0.7rem', border: '1px solid var(--glass-border)', borderRadius: '6px', background: 'var(--background)', color: 'var(--text-main)', width: '130px' }} value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}>
                                    <option value="">Select status...</option>
                                    <optgroup label="Active / Live">
                                        <option value="Stock">Stock</option>
                                        <option value="Mating">Mating</option>
                                        <option value="Pregnant">Pregnant</option>
                                        <option value="Nursing">Nursing</option>
                                        <option value="Weaning">Weaning</option>
                                        <option value="Experiment">Experiment</option>
                                    </optgroup>
                                    <optgroup label="Archive / Inactive">
                                        <option value="Euthanasia">Euthanasia</option>
                                        <option value="Tissue Collection">Tissue Collection</option>
                                        <option value="Dead">Dead</option>
                                        <option value="Missing">Missing</option>
                                        <option value="Transferred">Transferred</option>
                                    </optgroup>
                                </select>
                                <input type="date" style={{ height: '30px', fontSize: '0.7rem', border: '1px solid var(--glass-border)', borderRadius: '6px', width: '115px', background: 'var(--background)', color: 'var(--text-main)' }} value={bulkEndDate} onChange={e => setBulkEndDate(e.target.value)} />
                                <input placeholder="Comment..." style={{ height: '30px', fontSize: '0.7rem', border: '1px solid var(--glass-border)', borderRadius: '6px', width: '130px', padding: '0 8px', background: 'var(--background)', color: 'var(--text-main)' }} value={bulkComment} onChange={e => setBulkComment(e.target.value)} />
                                <button className="btn btn-primary" style={{ padding: '0 1rem', height: '30px', fontSize: '0.7rem' }} onClick={() => {
                                    if (!bulkStatus) { alert("Please select a status"); return; }
                                    bulkUpdateMiceStatus(selectedMice, bulkStatus, bulkComment, bulkEndDate);
                                }}>Update Status</button>
                            </div>
                        </div>

                        {/* Row 2: Location & Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                             {/* Move to Cage */}
                             <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', width: '50px' }}>Cage</span>
                                <select 
                                    style={{ height: '30px', fontSize: '0.7rem', border: '1px solid var(--glass-border)', borderRadius: '6px', width: '130px', background: 'var(--background)', color: 'var(--text-main)' }}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            bulkMoveMiceToCage(selectedMice, e.target.value);
                                            e.target.value = "";
                                        }
                                    }}
                                >
                                    <option value="">Move to...</option>
                                    {(() => {
                                        const inactiveStatuses = ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'];
                                        const allCages = [...(data.cages || [])].sort((a, b) => {
                                            const roomCmp = (a.room || '').localeCompare(b.room || '', undefined, { numeric: true });
                                            if (roomCmp !== 0) return roomCmp;
                                            return (a.tag || '').localeCompare(b.tag || '', undefined, { numeric: true });
                                        });
                                        // Group by room
                                        const byRoom = {};
                                        allCages.forEach(c => {
                                            const key = c.room || 'Unassigned';
                                            if (!byRoom[key]) byRoom[key] = [];
                                            byRoom[key].push(c);
                                        });
                                        return Object.entries(byRoom).map(([room, cages]) => {
                                            const roomObj = data.rooms?.find(r => r.name === room);
                                            const roomLabel = room.includes('/')
                                                ? `Room ${room.split('/')[0]} / Rack ${room.split('/')[1]}`
                                                : room;
                                            return (
                                                <optgroup key={room} label={roomLabel}>
                                                    {cages.map((c, idx) => {
                                                        const liveCount = data.mice?.filter(m => m.cageTag === c.tag && m._roomSearch === c.room && !inactiveStatuses.includes(m.status)).length || 0;
                                                        // フル形式で表示（例：305A_2-B-1）
                                                        let tagPart = c.tag;
                                                        if (c.room && (!c.tag.includes('_') || !c.tag.includes('-'))) {
                                                            tagPart = `${c.room.replace('/', '_')}-${c.tag}`;
                                                        }
                                                        const label = liveCount > 0 ? `${tagPart} (${liveCount} mice)` : `${tagPart} (empty)`;
                                                        return (
                                                            <option key={`${c.tag}|${c.room}|${idx}`} value={`${c.tag}|${c.room}`}>{label}</option>
                                                        );
                                                    })}
                                                </optgroup>
                                            );
                                        });
                                    })()}
                                </select>
                                <button 
                                    className="btn btn-ghost" 
                                    style={{ height: '30px', padding: '0 0.8rem', fontSize: '0.7rem', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', background: 'rgba(var(--accent-rgb), 0.05)' }} 
                                    onClick={() => {
                                        setPendingMiceForNewCage(selectedMice);
                                        openModal(null, 'cages');
                                    }}
                                >
                                    + New Cage
                                </button>
                             </div>

                             <div style={{ width: '1px', height: '18px', background: 'rgba(79, 70, 229, 0.1)' }} />

                             {/* Field Updates */}
                             <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <select style={{ height: '30px', fontSize: '0.7rem', border: '1px solid var(--glass-border)', borderRadius: '6px', background: 'var(--background)', color: 'var(--text-main)', width: '115px' }} value={bulkLine} onChange={e => setBulkLine(e.target.value)}>
                                    <option value="">Line...</option>
                                    {data.strains?.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                </select>
                                <input placeholder="Genotype..." style={{ height: '30px', fontSize: '0.7rem', border: '1px solid var(--glass-border)', borderRadius: '6px', width: '90px', padding: '0 8px', background: 'var(--background)', color: 'var(--text-main)' }} value={bulkGenotype} onChange={e => setBulkGenotype(e.target.value)} />
                                <button className="btn btn-ghost" style={{ padding: '0 0.8rem', height: '30px', fontSize: '0.7rem' }} onClick={() => {
                                    const fields = {};
                                    if (bulkLine) fields.line = bulkLine;
                                    if (bulkGenotype) fields.genotype = bulkGenotype;
                                    if (Object.keys(fields).length > 0) bulkUpdateMiceFields(selectedMice, fields);
                                }}>Update</button>
                             </div>

                             <div style={{ marginLeft: 'auto' }}>
                                <button className="btn btn-ghost" style={{ padding: '0 0.8rem', height: '30px', fontSize: '0.7rem', color: 'var(--danger)', border: '1px solid rgba(220, 38, 38, 0.2)' }} onClick={() => { if(confirm(`Delete ${selectedMice.length} selected mice records forever?`)) handleBulkDeleteMice(); }}>Delete Selected</button>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Card */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {activeSubTab === 'summary' ? renderSummaryView() : renderTable()}
            </div>
            {isModalOpen && (
                <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={closeModal} onKeyDown={(e) => e.stopPropagation()}>
                    <div style={{ position: 'relative', width: '90%', maxWidth: '520px', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} onPaste={(e) => e.stopPropagation()} key={editingItem?.id || activeSubTab}>
                        <div className="modal-content" style={{ width: '100%', maxWidth: 'none', margin: 0, padding: '1.25rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid var(--card-border)', marginBottom: '1.2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mac-traffic-close"
                                        title="Close"
                                    >
                                        <X size={8} strokeWidth={3} />
                                    </button>
                                    <h2 className="card-title" style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                                        {(() => {
                                            const currentType = forcedModalTab || activeSubTab;
                                            return pendingMiceForNewCage.length > 0
                                                ? 'New Cage & Move'
                                                : `${editingItem ? 'Edit' : 'Add'} ${currentType === 'mice' ? (editingItem?.id ? 'Mouse Record' : 'Mice') : currentType === 'strains' ? 'Mouseline' : currentType === 'litters' ? 'Litter Info' : currentType.charAt(0).toUpperCase() + currentType.slice(1, -1)}`;
                                        })()}
                                        {(forcedModalTab || activeSubTab) === 'mice' && editingItem?.litterId && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontWeight: 400 }}>(from Litter {editingItem.litterId})</span>}
                                    </h2>
                                </div>
                                {editingItem?.id && (
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        style={{ color: 'var(--danger)', opacity: 0.7, padding: '0.2rem 0.5rem', height: '28px', fontSize: '0.75rem', borderRadius: '6px' }}
                                        onClick={() => {
                                            if (confirm('Delete this record?')) {
                                                handleDelete(forcedModalTab || activeSubTab, editingItem.id);
                                                closeModal();
                                            }
                                        }}
                                        title="Delete this record"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <form id="modal-form" onSubmit={handleSave}>
                                {renderForm()}
                                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px solid var(--card-border)', justifyContent: 'flex-end' }}>
                                    <button type="button" className="btn btn-ghost" onClick={closeModal} style={{ height: '32px', padding: '0 1rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 500 }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ height: '32px', padding: '0 1.2rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}>Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showColumnSettings && (
                <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setShowColumnSettings(false)}>
                    <div style={{ position: 'relative', width: '90%', maxWidth: '420px', maxHeight: '80vh' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content" style={{ padding: '1.25rem 1.5rem', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--card-border)', marginBottom: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowColumnSettings(false)}
                                    className="mac-traffic-close"
                                    title="Close"
                                >
                                    <X size={8} strokeWidth={3} />
                                </button>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                        {activeSubTab.toUpperCase()} Table Columns
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #71717a)', marginTop: '2px' }}>
                                        Drag handle to reorder columns
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.4rem', maxHeight: '55vh', overflowY: 'auto' }}>
                                {(() => {
                                    const currentOrder = columnOrders[activeSubTab] || Object.keys(columnSettings[activeSubTab] || {});
                                    const labels = {
                                        room: 'Room', rack: 'Rack', cageTag: 'Location', cage: 'Location',
                                        id: activeSubTab === 'matings' ? 'Mating ID' : 'ID / Tag',
                                        status: 'Status', sex: 'Sex', dob: 'DOB', age: 'Age',
                                        genotype: 'Genotype', weaningDate: 'Weaning Date',
                                        matingId: 'Mating / Litter ID', 
                                        sireId: activeSubTab === 'matings' ? 'Male (♂)' : 'Sire',
                                        sireGenotype: activeSubTab === 'matings' ? 'Male Genotype' : 'Sire Genotype', 
                                        damGenotype: activeSubTab === 'matings' ? 'Female Genotype' : 'Dam Genotype',
                                        damId: activeSubTab === 'matings' ? 'Female (♀)' : 'Dam', 
                                        line: 'Line', comment: 'Comment',
                                        tag: 'Location', count: activeSubTab === 'cages' ? 'Mouse Count' : 'Count',
                                        occupants: 'Occupants', startDate: 'Set up date',
                                        litters: 'Litters', parents: 'Parents / Detail', info: 'Info',
                                        weanDate: 'Wean Date (Plan)', endDate: 'End Date'
                                    };

                                    return currentOrder.map((key, idx) => {
                                        const visible = columnSettings[activeSubTab]?.[key] ?? true;
                                        const isFirst = idx === 0;
                                        const isLast = idx === currentOrder.length - 1;
                                        const labelText = labels[key] || (key.charAt(0).toUpperCase() + key.slice(1));

                                        return (
                                            <div
                                                key={key}
                                                draggable
                                                onDragStart={(e) => {
                                                    setDraggedColIdx(idx);
                                                    e.dataTransfer.effectAllowed = 'move';
                                                    e.dataTransfer.setData('text/plain', String(idx));
                                                }}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    e.dataTransfer.dropEffect = 'move';
                                                    if (dragOverColIdx !== idx) {
                                                        setDragOverColIdx(idx);
                                                    }
                                                }}
                                                onDragLeave={() => {
                                                    if (dragOverColIdx === idx) {
                                                        setDragOverColIdx(null);
                                                    }
                                                }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    reorderColumns(activeSubTab, draggedColIdx, idx);
                                                    setDraggedColIdx(null);
                                                    setDragOverColIdx(null);
                                                }}
                                                onDragEnd={() => {
                                                    setDraggedColIdx(null);
                                                    setDragOverColIdx(null);
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '0.45rem 0.65rem',
                                                    background: dragOverColIdx === idx 
                                                        ? 'rgba(59, 130, 246, 0.12)' 
                                                        : 'var(--background)',
                                                    borderRadius: '8px',
                                                    border: dragOverColIdx === idx
                                                        ? '1px dashed var(--accent-primary, #3b82f6)'
                                                        : '1px solid var(--glass-border)',
                                                    opacity: draggedColIdx === idx ? 0.35 : 1,
                                                    cursor: 'grab',
                                                    transition: 'background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease',
                                                    userSelect: 'none'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                                    <div 
                                                        style={{ 
                                                            cursor: 'grab', 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            color: 'var(--text-muted, #71717a)',
                                                            padding: '2px'
                                                        }}
                                                        title="Drag to reorder"
                                                    >
                                                        <GripVertical size={16} />
                                                    </div>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem', flex: 1, userSelect: 'none' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={visible}
                                                            style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                                                            onChange={() => setColumnSettings({
                                                                ...columnSettings,
                                                                [activeSubTab]: { ...columnSettings[activeSubTab], [key]: !visible }
                                                            })}
                                                        />
                                                        <span style={{ fontWeight: 500 }}>{labelText}</span>
                                                    </label>
                                                </div>
                                                <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                                    <button
                                                        type="button"
                                                        disabled={isFirst}
                                                        onClick={(e) => { e.stopPropagation(); moveColumn(activeSubTab, idx, -1); }}
                                                        className="btn btn-ghost"
                                                        style={{
                                                            padding: '0.2rem',
                                                            borderRadius: '6px',
                                                            cursor: isFirst ? 'not-allowed' : 'pointer',
                                                            opacity: isFirst ? 0.2 : 0.8,
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'var(--text-main)',
                                                            border: 'none',
                                                            height: 'auto'
                                                        }}
                                                        title="Move Up"
                                                    >
                                                        <ChevronUp size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isLast}
                                                        onClick={(e) => { e.stopPropagation(); moveColumn(activeSubTab, idx, 1); }}
                                                        className="btn btn-ghost"
                                                        style={{
                                                            padding: '0.2rem',
                                                            borderRadius: '6px',
                                                            cursor: isLast ? 'not-allowed' : 'pointer',
                                                            opacity: isLast ? 0.2 : 0.8,
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'var(--text-main)',
                                                            border: 'none',
                                                            height: 'auto'
                                                        }}
                                                        title="Move Down"
                                                    >
                                                        <ChevronDown size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                            <div style={{ marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => resetColumnOrder(activeSubTab)}
                                    style={{ height: '32px', padding: '0 0.8rem', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}
                                >
                                    Reset Order
                                </button>
                                <button className="btn btn-primary" onClick={() => setShowColumnSettings(false)} style={{ height: '32px', padding: '0 1.2rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}>Done</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Label Print Modal */}
            {isLabelModalOpen && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }} onClick={() => setIsLabelModalOpen(false)}>
                    <div className="modal-content" style={{ 
                        maxWidth: '950px', width: '95%', maxHeight: '100%', display: 'flex', flexDirection: 'column', 
                        background: 'var(--card-bg)', color: 'var(--text-main)', padding: '2rem', borderRadius: '24px', 
                        position: 'relative', border: '1px solid var(--card-border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        overflow: 'visible' 
                    }} onClick={e => e.stopPropagation()}>
                        
                        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.8rem', borderBottom: '1px solid var(--card-border)', marginBottom: '1.2rem', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <button
                                    className="mac-traffic-close no-print"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsLabelModalOpen(false);
                                    }}
                                    title="Close"
                                >
                                    <X size={8} strokeWidth={3} />
                                </button>
                                <div style={{ background: 'rgba(var(--accent-rgb), 0.1)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                                    <Printer size={18} color="var(--accent-primary)" />
                                </div>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Print Cage Labels</h2>
                            </div>
                        </div>

                        {/* Controls (Simplified) */}
                        <div className="no-print" style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', marginBottom: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Settings size={14} />
                                    <span>Settings applied from Global Settings.</span>
                                </div>
                                {onOpenSettings && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        style={{
                                            padding: '0.25rem 0.65rem',
                                            fontSize: '0.78rem',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            borderRadius: '6px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => onOpenSettings()}
                                    >
                                        <Settings size={13} />
                                        Settings
                                    </button>
                                )}
                            </div>
                            <button className="btn btn-primary" style={{ marginLeft: 'auto', padding: '0.6rem 2rem', gap: '8px' }} onClick={handlePrintAllLabels}>
                                <Printer size={18} /> Print All
                            </button>
                        </div>

                        {/* Preview Scroll Area */}
                        <div id="printable-labels-area" className="print-preview-scroll" style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: 'rgba(0,0,0,0.05)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                            {labelsToPrint.map(cage => {
                                const mice = data.mice?.filter(m => m.cageTag === cage.tag && !['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(m.status)) || [];
                                const lines = [...new Set(mice.map(m => m.line).filter(Boolean))];
                                const roomObj = data.rooms?.find(r => r.name === cage.room);
                                const displayRack = (cage.room?.includes('/') ? cage.room.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '-';
                                const maleCount = mice.filter(m => m.sex === '♂' || m.sex === 'Male').length;
                                const femaleCount = mice.filter(m => m.sex === '♀' || m.sex === 'Female').length;

                                return (
                                    <div key={cage.id} className="printable-label" style={{ 
                                        width: `${data.settings?.labelWidth || 10}cm`, 
                                        height: `${data.settings?.labelHeight || 7}cm`, 
                                        background: 'white', 
                                        border: '1px solid black', 
                                        boxSizing: 'border-box',
                                        color: 'black',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        fontFamily: '"Times New Roman", Times, serif',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Header Row */}
                                        <div style={{ borderBottom: '1px solid black', display: 'flex', height: '20%' }}>
                                            <div style={{ flex: 6, borderRight: '1px solid black', padding: '2px 4px', fontSize: '0.45rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: '1.2' }}>
                                                <div><strong>Room:</strong> {cage.room?.includes('/') ? cage.room.split('/')[0] : cage.room || '-'}</div>
                                                <div style={{ marginBottom: '1px' }}><strong>Rack:</strong> {displayRack}</div>
                                                <div style={{ borderTop: '0.5px solid black', opacity: 0.5, margin: '1px 0' }}></div>
                                                <div style={{ marginTop: '1px' }}><strong>Lab:</strong> {data.settings?.labelLab || '-'}</div>
                                                <div><strong>User:</strong> {data.settings?.labelUser || '-'}</div>
                                            </div>
                                            <div style={{ flex: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', overflow: 'hidden' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                    {getCageDisplayTag(data.settings, cage.room, cage.tag)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mouseline Full Row (2 Lines) */}
                                        <div style={{ borderBottom: '1px solid black', display: 'flex', height: '16%' }}>
                                            <div style={{ flex: 4, borderRight: '1px solid black', padding: '2px 4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '0.6rem', overflow: 'hidden', lineHeight: '1.2' }}>
                                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    <strong>Line:</strong> <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>{lines[0] || '-'}</span>
                                                </div>
                                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.8, fontSize: '0.55rem' }}>
                                                    <strong>Genetic Background:</strong> {(() => {
                                                        const s = data.strains?.find(st => st.name === lines[0]);
                                                        return s?.background || '-';
                                                    })()}
                                                </div>
                                            </div>
                                            <div style={{ flex: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '8px', fontSize: '0.7rem' }}>
                                                ♂{maleCount} ♀{femaleCount}
                                            </div>
                                        </div>

                                        {/* Table Area */}
                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '1px solid black', fontSize: '0.5rem', height: '1.4em' }}>
                                                        <th style={{ width: '24%', borderRight: '1px solid black', textAlign: 'left', padding: '0 2px' }}>Tag</th>
                                                        <th style={{ width: '8%', borderRight: '1px solid black', textAlign: 'left', padding: '0 2px' }}>Sex</th>
                                                        <th style={{ width: '28%', borderRight: '1px solid black', textAlign: 'left', padding: '0 2px' }}>DOB</th>
                                                        <th style={{ width: '40%', textAlign: 'left', padding: '0 2px' }}>Genotype</th>
                                                    </tr>
                                                </thead>
                                                <tbody style={{ fontSize: '0.55rem' }}>
                                                    {mice.map((m, i) => (
                                                        <tr key={m.id} style={{ borderBottom: '0.5px solid #ccc', height: '1.5em' }}>
                                                            <td style={{ borderRight: '1px solid black', padding: '0 2px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{m.tag || m.id}</td>
                                                            <td style={{ borderRight: '1px solid black', padding: '0 2px' }}>{m.sex === '♂' || m.sex === 'Male' ? 'M' : m.sex === '♀' || m.sex === 'Female' ? 'F' : '?'}</td>
                                                            <td style={{ borderRight: '1px solid black', padding: '0 2px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                                {(() => {
                                                                    if (!m.dob) return '-';
                                                                    const parts = m.dob.split('-'); // YYYY, MM, DD
                                                                    if (parts.length !== 3) return m.dob;
                                                                    const format = data.settings?.labelDateFormat || 'YYYY/MM/DD';
                                                                    const YYYY = parts[0];
                                                                    const YY = parts[0].slice(-2);
                                                                    const MM = parts[1];
                                                                    const DD = parts[2];
                                                                    return format
                                                                        .replace('YYYY', YYYY)
                                                                        .replace('YY', YY)
                                                                        .replace('MM', MM)
                                                                        .replace('DD', DD);
                                                                })()}
                                                            </td>
                                                            <td style={{ padding: '0 2px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{m.genotype || ''}</td>
                                                        </tr>
                                                    ))}
                                                    {Array.from({ length: Math.max(0, 6 - mice.length) }).map((_, i) => (
                                                        <tr key={`b-${i}`} style={{ height: '1.5em', borderBottom: '0.5px solid #ccc' }}>
                                                            <td style={{ borderRight: '1px solid black' }}></td>
                                                            <td style={{ borderRight: '1px solid black' }}></td>
                                                            <td style={{ borderRight: '1px solid black' }}></td>
                                                            <td></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Footer */}
                                        <div style={{ borderTop: '1px solid black', padding: '1px 4px', fontSize: '0.45rem', display: 'flex', justifyContent: 'space-between', height: '10%', alignItems: 'center' }}>
                                            <span>Project: {data.activeProject || '-'}</span>
                                            <span style={{ fontStyle: 'italic' }}>Printed: {new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Global Print Style Injection */}
                    <style dangerouslySetInnerHTML={{ __html: `
                        @media print {
                            body * { visibility: hidden !important; }
                            .print-preview-scroll, .print-preview-scroll * { 
                                visibility: visible !important; 
                                background: transparent !important;
                            }
                            .print-preview-scroll {
                                position: fixed !important;
                                left: 0 !important;
                                top: 0 !important;
                                width: 100vw !important;
                                height: auto !important;
                                overflow: visible !important;
                                padding: 0 !important;
                                margin: 0 !important;
                                display: block !important;
                                background: white !important;
                                z-index: 9999 !important;
                            }
                            .printable-label {
                                margin: 0 auto 20px auto !important;
                                border: 1px solid black !important;
                                page-break-after: always !important;
                                box-shadow: none !important;
                                display: flex !important;
                            }
                            .modal-overlay { background: transparent !important; backdrop-filter: none !important; }
                            .modal-content, .btn, .btn-ghost, .btn-primary, input, .header, .footer, .sidebar { display: none !important; }
                        }
                    ` }} />
                </div>
            )}

            {weanAssignModal && (
                <WeanAssignModal
                    pups={weanAssignModal.pups}
                    data={data}
                    onConfirm={handleWeanAssignConfirm}
                    onCancel={() => setWeanAssignModal(null)}
                />
            )}

            {pedigreePopupMouseId && (() => {
                const mice = data.mice || [];
                const fetchMouse = (id) => mice.find(x => x.id === id);
                const m = fetchMouse(pedigreePopupMouseId);
                const sire = m?.sireId ? fetchMouse(m.sireId) : null;
                const dam = m?.damId ? fetchMouse(m.damId) : null;
                const gsire_p = sire?.sireId ? fetchMouse(sire.sireId) : null;
                const gdam_p = sire?.damId ? fetchMouse(sire.damId) : null;
                const gsire_m = dam?.sireId ? fetchMouse(dam.sireId) : null;
                const gdam_m = dam?.damId ? fetchMouse(dam.damId) : null;
                const children = mice.filter(x => x.sireId === pedigreePopupMouseId || x.damId === pedigreePopupMouseId);
                const siblings = m ? mice.filter(x => x.id !== m.id && x.sireId === m.sireId && x.damId === m.damId && m.sireId && m.damId) : [];

                const PNode = ({ mouse, label, isTarget = false }) => {
                    if (!mouse) return (
                        <div style={{ width: '110px', height: '55px', borderRadius: '8px', border: '1px dashed var(--glass-border)', opacity: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', flexShrink: 0 }}>{label}</div>
                    );
                    const isMale = mouse.sex === '♂' || mouse.sex === 'Male';
                    const isFemale = mouse.sex === '♀' || mouse.sex === 'Female';
                    const isInactive = ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(mouse.status);
                    const sexColor = isMale ? '#3b82f6' : isFemale ? '#ec4899' : '#888';
                    return (
                        <div onClick={() => setPedigreePopupMouseId(mouse.id)} style={{
                            width: '110px', background: 'var(--card-bg)',
                            border: `2px solid ${isTarget ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                            borderRadius: '10px', padding: '0.35rem 0.5rem', cursor: 'pointer',
                            boxShadow: isTarget ? '0 0 12px rgba(99,102,241,0.2)' : '0 2px 6px rgba(0,0,0,0.04)',
                            position: 'relative', flexShrink: 0
                        }}>
                            <div style={{ position: 'absolute', top: '5px', right: '5px', width: '9px', height: '9px', borderRadius: isFemale ? '50%' : '2px', border: `2px solid ${sexColor}`, background: isInactive ? 'transparent' : sexColor, opacity: 0.8 }} />
                            <div style={{ fontSize: '0.5rem', color: 'var(--text-muted)', opacity: 0.5, fontWeight: 800 }}>{mouse.id}</div>
                            {mouse.tag && mouse.tag !== 'nan' && <div style={{ fontWeight: 800, fontSize: '0.7rem', color: sexColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mouse.tag}</div>}
                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-main)' }}>{mouse.genotype || '-'}</div>
                            <div style={{ fontSize: '0.5rem', color: isInactive ? 'var(--danger)' : 'var(--success)', fontWeight: 800, opacity: 0.9 }}>{mouse.status}</div>
                        </div>
                    );
                };

                const connLine = { background: 'var(--text-muted)', opacity: 0.35 };

                return (
                    <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 12000 }} onClick={() => setPedigreePopupMouseId(null)}>
                        <div style={{
                            width: '95%', maxWidth: '780px', maxHeight: '88vh',
                            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                            borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.35)',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden'
                        }} onClick={e => e.stopPropagation()}>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--card-border)' }}>
                                <button className="mac-traffic-close" onClick={() => setPedigreePopupMouseId(null)} title="Close">
                                    <X size={8} strokeWidth={3} />
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <GitMerge size={16} color="var(--accent-primary)" />
                                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Pedigree</span>
                                    {m && <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>— {m.tag && m.tag !== 'nan' ? m.tag : m.id}</span>}
                                </div>
                            </div>

                            {/* Body */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', gap: '1.5rem' }}>
                                {/* LEFT: Tree */}
                                <div style={{ flex: 1, overflowX: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem', padding: '0.5rem 1rem' }}>
                                    {/* Grandparents */}
                                    <div style={{ display: 'flex', gap: '3rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                <PNode mouse={gsire_p} label="G-Sire" />
                                                <PNode mouse={gdam_p} label="G-Dam" />
                                            </div>
                                            <div style={{ position: 'absolute', top: '27px', left: '55px', right: '55px', height: '2px', ...connLine }} />
                                            <div style={{ height: '18px', width: '2px', ...connLine }} />
                                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, opacity: 0.6 }}>Paternal GP</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                <PNode mouse={gsire_m} label="G-Sire" />
                                                <PNode mouse={gdam_m} label="G-Dam" />
                                            </div>
                                            <div style={{ position: 'absolute', top: '27px', left: '55px', right: '55px', height: '2px', ...connLine }} />
                                            <div style={{ height: '18px', width: '2px', ...connLine }} />
                                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, opacity: 0.6 }}>Maternal GP</div>
                                        </div>
                                    </div>

                                    {/* Parents */}
                                    <div style={{ display: 'flex', gap: '5rem', position: 'relative', alignItems: 'flex-start' }}>
                                        <div style={{ position: 'absolute', top: '27px', left: '110px', right: '110px', height: '2px', ...connLine }} />
                                        <div style={{ position: 'absolute', top: '27px', left: '50%', width: '2px', height: '70px', ...connLine }} />
                                        <PNode mouse={sire} label="Sire (♂)" />
                                        <PNode mouse={dam} label="Dam (♀)" />
                                    </div>

                                    {/* Self */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                                        <div style={{ height: '30px', width: '2px', ...connLine, marginTop: '-2rem' }} />
                                        <PNode mouse={m} label="Target" isTarget={true} />
                                    </div>

                                    {/* Children */}
                                    {children.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', width: '100%' }}>
                                            <div style={{ height: '20px', width: '2px', ...connLine, marginTop: '-1rem' }} />
                                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--accent-primary)', opacity: 0.7, textTransform: 'uppercase' }}>Offspring ({children.length})</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
                                                {children.map(child => <PNode key={child.id} mouse={child} />)}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT: Siblings */}
                                {siblings.length > 0 && (
                                    <div style={{ width: '160px', flexShrink: 0, borderLeft: '1px solid var(--glass-border)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>LITTER ({siblings.length})</div>
                                        {siblings.map(sib => {
                                            const isMale = sib.sex === '♂' || sib.sex === 'Male';
                                            const isFemale = sib.sex === '♀' || sib.sex === 'Female';
                                            return (
                                                <div key={sib.id} onClick={() => setPedigreePopupMouseId(sib.id)} style={{ padding: '0.4rem 0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', cursor: 'pointer', fontSize: '0.7rem' }}>
                                                    <div style={{ fontWeight: 800, color: isMale ? '#3b82f6' : isFemale ? '#ec4899' : 'inherit' }}>{sib.tag && sib.tag !== 'nan' ? sib.tag : sib.id}</div>
                                                    <div style={{ opacity: 0.6, fontSize: '0.6rem' }}>{sib.genotype}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div style={{ padding: '0.8rem 1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click any node to navigate • Click outside to close</span>
                                <button className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', border: '1px solid var(--glass-border)' }} onClick={() => setPedigreePopupMouseId(null)}>
                                    ← Back to Edit
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {confirmModal && (
                <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11000, backdropFilter: 'blur(10px)' }} onClick={() => setConfirmModal(null)}>
                    <div className="modal-content" style={{ width: '90%', maxWidth: '360px', padding: '1.5rem', textAlign: 'center', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)', background: 'var(--card-bg)', border: '1px solid var(--card-border)' }} onClick={e => e.stopPropagation()}>
                        {confirmModal.title && <h3 style={{ marginBottom: '0.4rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{confirmModal.title}</h3>}
                        <p style={{ marginBottom: '1.4rem', fontSize: '0.85rem', lineHeight: '1.5', whiteSpace: 'pre-line', color: 'var(--text-muted)' }}>{confirmModal.message}</p>
                        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
                            <button 
                                className="btn btn-ghost" 
                                style={{ height: '32px', padding: '0 1.2rem', color: confirmModal.cancelColor || 'var(--text-muted)', border: '1px solid var(--glass-border)', borderRadius: '8px', minWidth: '90px', fontSize: '0.82rem', fontWeight: 500 }}
                                onClick={() => {
                                    if (confirmModal.onCancel) confirmModal.onCancel();
                                    setConfirmModal(null);
                                }}
                            >
                                {confirmModal.cancelLabel || 'Cancel'}
                            </button>
                            <button 
                                className="btn btn-primary" 
                                style={{ height: '32px', padding: '0 1.2rem', background: confirmModal.confirmColor || 'var(--accent-primary)', color: 'white', borderRadius: '8px', fontWeight: 600, minWidth: '90px', fontSize: '0.82rem' }}
                                onClick={() => {
                                    if (confirmModal.onConfirm) confirmModal.onConfirm();
                                    setConfirmModal(null);
                                }}
                            >
                                {confirmModal.confirmLabel || 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
