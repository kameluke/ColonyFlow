"use client";
import React, { useState } from 'react';
import { Plus, X, Check, Box, ChevronDown, Trash2 } from 'lucide-react';

function getCageDisplayTag(settings, room, tag) {
    if (!tag || tag === 'nan') return '-';
    const mode = settings?.cageDisplayMode || 'full';
    if (tag.includes('_') && tag.includes('-')) {
        const ui = tag.indexOf('_');
        const di = tag.indexOf('-', ui);
        const shortTag = tag.substring(di + 1);
        if (mode === 'tag') return shortTag;
        const rackPart = tag.substring(ui + 1, di);
        if (mode === 'rack-tag') return `${rackPart}-${shortTag}`;
    }
    if (mode === 'tag') return tag;
    const roomParts = room?.split('/') || [];
    const rackStr = roomParts[1] || roomParts[0] || '';
    if (mode === 'rack-tag') return rackStr ? `${rackStr}-${tag}` : tag;
    if (mode === 'full' && room) return `${room.replace('/', '_')}-${tag}`;
    return tag;
}

// Inline RackSelector matching ManagementView's version
const RackGrid = ({ data, roomName, selectedCageTag, onSelect }) => {
    if (!roomName) return <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Please select a Room/Rack first.</div>;
    const room = data.rooms?.find(r => r.name === roomName);
    if (!room) return null;

    const rows = parseInt(room.rows, 10) || 1;
    const cols = parseInt(room.cols, 10) || 1;
    const rackGrid = Array.from({ length: rows }, () => Array(cols).fill(null));

    data.cages?.forEach(cage => {
        if (cage.room === roomName && cage.row && cage.col && cage.row <= rows && cage.col <= cols) {
            rackGrid[cage.row - 1][cage.col - 1] = cage.tag;
        }
    });

    const getColLabel = (c) => room.colFormat === 'A' ? String.fromCharCode(65 + c) : c + 1;
    const getRowLabel = (r) => room.rowFormat === 'A' ? String.fromCharCode(65 + r) : r + 1;

    return (
        <div style={{ marginTop: '0.3rem', background: 'var(--glass)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--glass-border)', overflowX: 'auto', overflowY: 'auto', maxHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '0.3rem', fontSize: '0.7rem', fontWeight: 800, alignSelf: 'flex-start', flexShrink: 0 }}>Click to select cage:</div>
            <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${cols}, 28px)`, gap: '3px', width: 'fit-content' }}>
                <div />
                {Array.from({ length: cols }).map((_, c) => (
                    <div key={`h${c}`} style={{ textAlign: 'center', fontSize: '0.6rem', color: 'var(--text-muted)' }}>{getColLabel(c)}</div>
                ))}
                {rackGrid.map((rowArr, r) => (
                    <React.Fragment key={`r${r}`}>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.6rem', color: 'var(--text-muted)', paddingRight: '0.3rem' }}>{getRowLabel(r)}</div>
                        {rowArr.map((occupiedTag, c) => {
                            const isSelected = occupiedTag && occupiedTag === selectedCageTag;
                            return (
                                <div
                                    key={`${r}-${c}`}
                                    onClick={() => {
                                        if (occupiedTag) {
                                            onSelect(occupiedTag);
                                        } else {
                                            const tag = `${getRowLabel(r)}-${getColLabel(c)}`;
                                            const fullTag = roomName ? `${roomName.replace('/', '_')}-${tag}` : tag;
                                            onSelect(fullTag, r + 1, c + 1);
                                        }
                                    }}
                                    style={{
                                        width: '28px', height: '28px',
                                        background: isSelected ? 'var(--accent-primary)' : occupiedTag ? 'rgba(128,128,128,0.5)' : 'var(--card-bg)',
                                        border: isSelected ? '2px solid white' : '1px solid var(--glass-border)',
                                        borderRadius: '4px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.55rem', cursor: 'pointer'
                                    }}
                                    title={occupiedTag ? getCageDisplayTag(data.settings, roomName, occupiedTag) : 'Empty'}
                                >
                                    {occupiedTag ? <Box size={12} style={{ color: isSelected ? 'white' : 'var(--text-main)' }} /> : ''}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default function WeanAssignModal({ pups, data, onConfirm, onCancel }) {
    const [cageGroups, setCageGroups] = useState([
        { id: 'group-1', cageTag: '', roomName: '', roomSearch: '', row: '', col: '', pupIds: [] }
    ]);
    const [expandedGroup, setExpandedGroup] = useState('group-1');

    const allAssignedPupIds = cageGroups.flatMap(g => g.pupIds);
    const unassignedPups = pups.filter(p => !allAssignedPupIds.includes(p.id));

    const addCageGroup = () => {
        const newId = `group-${Date.now()}`;
        setCageGroups(prev => [...prev, { id: newId, cageTag: '', roomName: '', roomSearch: '', row: '', col: '', pupIds: [] }]);
        setExpandedGroup(newId);
    };

    const removeCageGroup = (groupId) => setCageGroups(prev => prev.filter(g => g.id !== groupId));

    const updateGroup = (groupId, updates) => setCageGroups(prev => prev.map(g => g.id === groupId ? { ...g, ...updates } : g));

    const togglePupInGroup = (groupId, pupId) => {
        setCageGroups(prev => {
            const cleaned = prev.map(g => ({ ...g, pupIds: g.id === groupId ? g.pupIds : g.pupIds.filter(id => id !== pupId) }));
            return cleaned.map(g => {
                if (g.id !== groupId) return g;
                return g.pupIds.includes(pupId) ? { ...g, pupIds: g.pupIds.filter(id => id !== pupId) } : { ...g, pupIds: [...g.pupIds, pupId] };
            });
        });
    };

    const assignAllUnassigned = (groupId) => {
        setCageGroups(prev => prev.map(g => g.id !== groupId ? g : { ...g, pupIds: [...g.pupIds, ...unassignedPups.map(p => p.id)] }));
    };

    const handleConfirm = () => {
        if (unassignedPups.length > 0) { alert(`未割り当てのPupが ${unassignedPups.length} 匹います。`); return; }
        const groupsWithPups = cageGroups.filter(g => g.pupIds.length > 0);
        if (groupsWithPups.find(g => !g.cageTag)) { alert('すべてのケージグループにCage Tagを設定してください。'); return; }
        const assignments = [];
        for (const group of groupsWithPups) {
            for (const pupId of group.pupIds) {
                assignments.push({ pupId, cageTag: group.cageTag, roomSearch: group.roomSearch, row: group.row, col: group.col });
            }
        }
        onConfirm(assignments);
    };

    const getPupDisplay = (pup) => {
        const sex = pup.sex === '♂' || pup.sex === 'Male' ? '♂' : (pup.sex === '♀' || pup.sex === 'Female' ? '♀' : '?');
        return { sex, tag: pup.tag && pup.tag !== 'nan' ? pup.tag : '', id: pup.id };
    };
    const getSexColor = (sex) => sex === '♂' ? '#3b82f6' : sex === '♀' ? '#ec4899' : 'var(--text-muted)';

    const uniqueRooms = [...new Set(data.rooms?.map(r => r.roomName || (r.name.includes('/') ? r.name.split('/')[0] : r.name)) || [])].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const getRacksForRoom = (roomDisplayName) => (data.rooms || []).filter(r => {
        const rName = r.roomName || (r.name.includes('/') ? r.name.split('/')[0] : r.name);
        return rName === roomDisplayName;
    }).sort((a, b) => {
        const rA = a.name.includes('/') ? a.name.split('/')[1] : a.name;
        const rB = b.name.includes('/') ? b.name.split('/')[1] : b.name;
        return rA.localeCompare(rB, undefined, { numeric: true });
    });

    const handleRackCageSelect = (groupId, group, tagOrFullTag, newRow, newCol) => {
        // If existing cage clicked (tagOrFullTag is the cage.tag)
        const existingCage = data.cages?.find(c => c.tag === tagOrFullTag);
        if (existingCage) {
            updateGroup(groupId, { cageTag: existingCage.tag, row: existingCage.row || '', col: existingCage.col || '' });
        } else {
            // New empty slot: tagOrFullTag is auto-generated full tag
            updateGroup(groupId, { cageTag: tagOrFullTag, row: newRow || '', col: newCol || '' });
        }
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11000 }} onClick={onCancel}>
            <div style={{
                width: '95%', maxWidth: '700px', maxHeight: '90vh', padding: '2rem',
                borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--card-border)', marginBottom: '1.2rem' }}>
                    <button className="mac-traffic-close" onClick={onCancel} title="Close">
                        <X size={8} strokeWidth={3} />
                    </button>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Wean Assignment</h3>
                </div>

                {/* Scrollable content area */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem', minHeight: 0 }}>
                    {/* Summary */}
                    <div style={{ display: 'flex', gap: '1rem', padding: '0.8rem 1rem', background: 'var(--glass)', borderRadius: '12px', fontSize: '0.8rem', alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
                        <span>Total: <strong>{pups.length}</strong> pups</span>
                        <span style={{ color: '#3b82f6' }}>♂ {pups.filter(p => p.sex === '♂' || p.sex === 'Male').length}</span>
                        <span style={{ color: '#ec4899' }}>♀ {pups.filter(p => p.sex === '♀' || p.sex === 'Female').length}</span>
                        <span style={{ color: 'var(--text-muted)' }}>? {pups.filter(p => !['♂','Male','♀','Female'].includes(p.sex)).length}</span>
                        <span style={{ marginLeft: 'auto', color: unassignedPups.length > 0 ? '#ef4444' : 'var(--success)', fontWeight: 700 }}>
                            {unassignedPups.length > 0 ? `${unassignedPups.length} unassigned` : '✓ All assigned'}
                        </span>
                    </div>

                    {/* Unassigned Pups */}
                    {unassignedPups.length > 0 && (
                        <div style={{ padding: '0.8rem 1rem', background: 'rgba(239,68,68,0.06)', border: '1.5px dashed rgba(239,68,68,0.3)', borderRadius: '12px', flexShrink: 0 }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Unassigned Pups</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {unassignedPups.map(pup => { const d = getPupDisplay(pup); return (
                                    <div key={pup.id} style={{ padding: '0.3rem 0.6rem', background: 'var(--card-bg)', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <span style={{ color: getSexColor(d.sex), fontWeight: 800 }}>{d.sex}</span>
                                        <span style={{ fontWeight: 600 }}>{d.tag || d.id}</span>
                                    </div>
                                ); })}
                            </div>
                        </div>
                    )}

                    {/* Cage Groups */}
                    {cageGroups.map((group, idx) => {
                        const isExpanded = expandedGroup === group.id;
                        const groupPups = pups.filter(p => group.pupIds.includes(p.id));
                        return (
                            <div key={group.id} style={{ border: '1.5px solid var(--card-border)', borderRadius: '14px', overflow: 'hidden', background: 'var(--card-bg)', flexShrink: 0 }}>
                                {/* Header */}
                                <div style={{ padding: '0.8rem 1rem', background: 'var(--glass)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', borderBottom: isExpanded ? '1px solid var(--glass-border)' : 'none' }}
                                    onClick={() => setExpandedGroup(isExpanded ? null : group.id)}>
                                    <Box size={16} color="var(--accent-primary)" />
                                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Cage {idx + 1}</span>
                                    {group.cageTag && <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>({getCageDisplayTag(data.settings, group.roomSearch, group.cageTag)})</span>}
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{groupPups.length} pups</span>
                                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {cageGroups.length > 1 && <button className="btn btn-ghost" style={{ padding: '0.15rem', color: '#ef4444' }} onClick={(e) => { e.stopPropagation(); removeCageGroup(group.id); }}><Trash2 size={14} /></button>}
                                        <ChevronDown size={16} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                    </div>
                                </div>

                                {/* Body */}
                                {isExpanded && (
                                    <div style={{ padding: '1rem' }}>
                                        {/* Location Selection */}
                                        <div style={{ background: 'rgba(5,150,105,0.06)', padding: '0.8rem', borderRadius: '10px', marginBottom: '0.8rem', border: '1px dashed rgba(5,150,105,0.25)' }}>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.5rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                                                LOCATION {group.cageTag && <span style={{ marginLeft: 'auto', opacity: 0.7, textTransform: 'none', fontWeight: 400, fontSize: '0.65rem' }}>Current: {getCageDisplayTag(data.settings, group.roomSearch, group.cageTag)}</span>}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <div>
                                                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Room</label>
                                                    <select className="form-control" style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', height: 'auto' }}
                                                        value={group.roomName} onChange={(e) => updateGroup(group.id, { roomName: e.target.value, roomSearch: '', cageTag: '', row: '', col: '' })}>
                                                        <option value="">Select Room...</option>
                                                        {uniqueRooms.map(r => <option key={r} value={r}>{r}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Rack</label>
                                                    <select className="form-control" style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', height: 'auto' }}
                                                        value={group.roomSearch} onChange={(e) => updateGroup(group.id, { roomSearch: e.target.value, cageTag: '', row: '', col: '' })}>
                                                        <option value="">Select Rack...</option>
                                                        {getRacksForRoom(group.roomName).map(r => (
                                                            <option key={r.id} value={r.name}>{r.name.includes('/') ? r.name.split('/')[1] : r.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Rack Grid - visual cage selector */}
                                            {group.roomSearch && (
                                                <RackGrid
                                                    data={data}
                                                    roomName={group.roomSearch}
                                                    selectedCageTag={group.cageTag}
                                                    onSelect={(tag, newRow, newCol) => handleRackCageSelect(group.id, group, tag, newRow, newCol)}
                                                />
                                            )}

                                            <div style={{ marginTop: '0.5rem' }}>
                                                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                                    Cage Tag
                                                    {group.row && group.col && <span style={{ color: 'var(--success)', fontSize: '0.65em', float: 'right', fontWeight: 'normal' }}>*Will create new cage if not exists</span>}
                                                </label>
                                                <input className="form-control" style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', height: 'auto' }}
                                                    value={group.cageTag}
                                                    onChange={(e) => {
                                                        const tag = e.target.value;
                                                        const existingCage = data.cages?.find(c => c.tag === tag);
                                                        if (existingCage) {
                                                            const roomObj = data.rooms?.find(r => r.name === existingCage.room);
                                                            const displayRoom = roomObj?.roomName || (existingCage.room?.includes('/') ? existingCage.room.split('/')[0] : existingCage.room) || '';
                                                            updateGroup(group.id, { cageTag: tag, roomSearch: existingCage.room || '', roomName: displayRoom, row: existingCage.row || '', col: existingCage.col || '' });
                                                        } else {
                                                            updateGroup(group.id, { cageTag: tag });
                                                        }
                                                    }}
                                                    placeholder="Select from rack or type here"
                                                    list={`cage-list-${group.id}`}
                                                />
                                                <datalist id={`cage-list-${group.id}`}>
                                                    {data.cages?.map((c, i) => <option key={`${c.id || c.tag}-${i}`} value={c.tag} />)}
                                                </datalist>
                                            </div>
                                        </div>

                                        {/* Pup Assignment */}
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>ASSIGN PUPS TO THIS CAGE</span>
                                            {unassignedPups.length > 0 && (
                                                <button className="btn btn-ghost" style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem', color: 'var(--accent-primary)' }}
                                                    onClick={() => assignAllUnassigned(group.id)}>+ Add all unassigned</button>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                            {pups.map(pup => {
                                                const d = getPupDisplay(pup);
                                                const isIn = group.pupIds.includes(pup.id);
                                                const isOther = !isIn && allAssignedPupIds.includes(pup.id);
                                                return (
                                                    <button key={pup.id} className="btn btn-ghost" style={{
                                                        padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem',
                                                        border: isIn ? `2px solid ${getSexColor(d.sex)}` : '1px solid var(--glass-border)',
                                                        background: isIn ? `${getSexColor(d.sex)}15` : 'transparent',
                                                        opacity: isOther ? 0.3 : 1,
                                                        display: 'flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.15s ease'
                                                    }} onClick={() => togglePupInGroup(group.id, pup.id)}
                                                        title={isOther ? 'Click to move here' : isIn ? 'Click to remove' : 'Click to assign'}>
                                                        {isIn && <Check size={12} color={getSexColor(d.sex)} strokeWidth={3} />}
                                                        <span style={{ color: getSexColor(d.sex), fontWeight: 800 }}>{d.sex}</span>
                                                        <span style={{ fontWeight: 600 }}>{d.tag || d.id}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <button className="btn btn-ghost" style={{ padding: '0.8rem', borderRadius: '14px', border: '2px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700, flexShrink: 0 }}
                        onClick={addCageGroup}>
                        <Plus size={16} /> Add Cage Group
                    </button>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', paddingTop: '0.8rem', borderTop: '1px solid var(--card-border)' }}>
                    <button className="btn btn-ghost" style={{ height: '32px', padding: '0 1rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 500 }} onClick={onCancel}>Cancel</button>
                    <button className="btn btn-primary" style={{
                        height: '32px', padding: '0 1.2rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.82rem',
                        background: unassignedPups.length > 0 ? 'var(--text-muted)' : 'var(--accent-primary)',
                        color: 'white'
                    }} onClick={handleConfirm}>
                        Confirm Assignment
                    </button>
                </div>
            </div>
        </div>
    );
}
