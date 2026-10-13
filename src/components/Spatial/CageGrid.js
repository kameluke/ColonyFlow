"use client";
import React, { useState } from 'react';
import { Box, Users, MapPin, AlertTriangle, X, ExternalLink, Calendar, Tag, Dna } from 'lucide-react';

const PupAnimalIcon = ({ size = 14, ...props }) => (
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

export default function CageGrid({ data, onSelect }) {
    const [selectedCageModal, setSelectedCageModal] = useState(null);
    const rooms = data.rooms || [];
    const mice = data.mice || [];
    const cages = data.cages || [];
    const litters = data.litters || [];
    const matings = data.matings || [];

    const getAge = (dob) => {
        if (!dob) return '-';
        const birth = new Date(dob);
        if (isNaN(birth.getTime())) return '-';
        const diffDays = Math.floor(Math.abs(new Date() - birth) / (1000 * 60 * 60 * 24));
        const weeks = (diffDays / 7).toFixed(1);
        return `${weeks} wks (${diffDays}d)`;
    };

    const getCageDisplayTag = (roomName, tag) => {
        if (!tag || tag === 'nan') return '-';
        // Use 'full' as default if mode is not set or for new Room_Rack-Tag format
        const mode = data.settings?.cageDisplayMode || 'full';
        
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
        const roomParts = roomName?.split('/') || [];
        const rackStr = roomParts[1] || roomParts[0] || '';
        if (mode === 'rack-tag') return rackStr ? `${rackStr}-${tag}` : tag;
        if (mode === 'full') {
            if (!roomName) return tag;
            const prefix = roomName.replace('/', '_');
            return `${prefix}-${tag}`;
        }
        return tag;
    };

    // Group live mice by cage (composite key: room + tag)
    const miceByCage = {};
    mice.forEach(m => {
        if (!m.cageTag || m.cageTag === 'nan') return;
        const isNotLive = (item) => {
            const status = item.status || item.state;
            return ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(status);
        };
        if (isNotLive(m)) return;
        const cageKey = `${m._roomSearch || 'default'}|${m.cageTag}`;
        if (!miceByCage[cageKey]) miceByCage[cageKey] = [];
        miceByCage[cageKey].push(m);
    });

    // Group unregistered pups from active litters by cage
    const pupsByCage = {};
    litters.forEach(l => {
        const lStatus = (l.status || '').toLowerCase();
        // Skip weaned or inactive litters
        if (lStatus === 'weaned' || lStatus === 'inactive' || lStatus === 'dead') return;

        const totalCount = parseInt(l.count, 10) || 0;
        if (totalCount <= 0) return;

        // Check how many pups are already registered as individual mice
        const registeredPups = mice.filter(m => m.litterId === l.id);
        const unregisteredCount = Math.max(0, totalCount - registeredPups.length);
        if (unregisteredCount <= 0) return;

        // Resolve cage for this litter
        const mating = matings.find(m => m.id === l.matingId);
        const dam = mice.find(m => m.id === mating?.damId);
        const targetCageTag = l.cageTag || dam?.cageTag || mating?.cageTag;
        const targetRoom = l._roomSearch || dam?._roomSearch || mating?._roomSearch || l.room || mating?.room;

        if (!targetCageTag) return;

        // Match with cages in data to get canonical room
        let matchedCage = cages.find(c => c.tag === targetCageTag && (!targetRoom || c.room === targetRoom));
        if (!matchedCage) {
            matchedCage = cages.find(c => c.tag === targetCageTag);
        }

        const roomKey = matchedCage?.room || targetRoom || 'default';
        const cageKey = `${roomKey}|${targetCageTag}`;
        pupsByCage[cageKey] = (pupsByCage[cageKey] || 0) + unregisteredCount;
    });

    // Group live cages (containing live mice or unregistered pups) by room
    const cagesByRoom = {};
    cages.forEach(c => {
        const cageKey = `${c.room || 'default'}|${c.tag}`;
        const hasMice = miceByCage[cageKey] && miceByCage[cageKey].length > 0;
        const hasPups = pupsByCage[cageKey] && pupsByCage[cageKey] > 0;
        if (!hasMice && !hasPups) return;
        const roomName = c.room || 'Unassigned';
        if (!cagesByRoom[roomName]) cagesByRoom[roomName] = [];
        cagesByRoom[roomName].push(c);
    });
    // Sort room entries naturally
    const sortedRoomEntries = Object.entries(cagesByRoom).sort(([roomNameA], [roomNameB]) => {
        const rInfoA = rooms.find(r => r.name === roomNameA) || {};
        const rInfoB = rooms.find(r => r.name === roomNameB) || {};

        const displayRoomA = rInfoA.roomName || (roomNameA.includes('/') ? roomNameA.split('/')[0] : roomNameA);
        const displayRoomB = rInfoB.roomName || (roomNameB.includes('/') ? roomNameB.split('/')[0] : roomNameB);

        const roomCompare = displayRoomA.localeCompare(displayRoomB, undefined, { numeric: true, sensitivity: 'base' });
        if (roomCompare !== 0) return roomCompare;

        const displayRackA = roomNameA.includes('/') ? roomNameA.split('/')[1] : (rInfoA.roomName ? rInfoA.name : '');
        const displayRackB = roomNameB.includes('/') ? roomNameB.split('/')[1] : (rInfoB.roomName ? rInfoB.name : '');
        return displayRackA.localeCompare(displayRackB, undefined, { numeric: true });
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', padding: '0.8rem 1.2rem', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cage Status:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: '2px solid #8b5cf6', background: 'rgba(139, 92, 246, 0.08)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Experiment</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: '2px solid #ec4899', background: 'rgba(236, 72, 153, 0.08)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Mating</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: '2px solid #84cc16', background: 'transparent' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Pregnant</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: '2px solid #84cc16', background: 'rgba(132, 204, 22, 0.08)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Nursing</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: '2px solid #3b82f6', background: 'rgba(59, 130, 246, 0.08)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Others</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: '2px solid #dc2626', background: 'rgba(220, 38, 38, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertTriangle size={8} color="#dc2626" strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Overcapacity (&gt;{data.settings?.maxMicePerCage || 5})</span>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Occupancy:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#3b82f6' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>♂</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ec4899' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>♀</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--text-main)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Parent</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-main)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Pup</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', alignItems: 'start' }}>
            {rooms.length === 0 && Object.keys(cagesByRoom).length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>
                    No rooms or cages defined yet. Go to Manage &rarr; Rooms/Cages to set them up.
                </div>
            )}

            {sortedRoomEntries.map(([roomName, roomCages]) => {
                const roomInfo = rooms.find(r => r.name === roomName) || { name: roomName, rows: 5, cols: 8 };
                const displayRoom = roomInfo.roomName || (roomName.includes('/') ? roomName.split('/')[0] : roomName);
                const displayRack = roomName.includes('/') ? roomName.split('/')[1] : (roomInfo.roomName ? roomInfo.name : '');

                const rows = parseInt(roomInfo.rows, 10) || 5;
                const cols = parseInt(roomInfo.cols, 10) || 8;
                const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

                // Place cages in grid if they have row/col info
                roomCages.forEach(cage => {
                    if (cage.row && cage.col && cage.row <= rows && cage.col <= cols) {
                        grid[cage.row - 1][cage.col - 1] = cage;
                    }
                });

                // Any cages without valid grid positions will be shown below the grid
                const floatingCages = roomCages.filter(c => !c.row || !c.col || c.row > rows || c.col > cols);

                const getColLabel = (cIdx) => roomInfo.colFormat === 'A' ? String.fromCharCode(65 + cIdx) : cIdx + 1;
                const getRowLabel = (rIdx) => roomInfo.rowFormat === 'A' ? String.fromCharCode(65 + rIdx) : rIdx + 1;

                return (
                    <div key={roomName}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem', width: 'fit-content' }}>
                            <MapPin size={24} color="var(--accent-primary)" />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Room: {displayRoom} {displayRack && <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginLeft: '0.5rem' }}>/ Rack: {displayRack}</span>}</h2>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${cols}, 1fr)`,
                            gap: '0.25rem',
                            background: 'var(--glass)',
                            padding: '1rem',
                            borderRadius: '16px',
                            border: '1px solid var(--glass-border)',
                            overflowX: 'auto'
                        }}>
                            {grid.map((row, rIdx) => row.map((cage, cIdx) => {
                                // Determine cage border color based on mouse statuses
                                let cageBorderColor = '#3b82f6';
                                let cageBgTint = 'var(--card-bg)';
                                let cageBorderWidth = '1px';
                                let isOvercrowded = false;
                                let hasNursing = false;
                                const maxMice = data.settings?.maxMicePerCage || 5;
                                if (cage) {
                                    const cageKey = `${cage.room || 'default'}|${cage.tag}`;
                                    const cageMice = miceByCage[cageKey] || [];
                                    const miceCount = cageMice.length;
                                    const hasExperiment = cageMice.some(m => (m.status || m.state) === 'Experiment');
                                    const hasMating = cageMice.some(m => (m.status || m.state) === 'Mating');
                                    const hasNursingMouse = cageMice.some(m => (m.status || m.state) === 'Nursing');
                                    // Also check if any active litter is associated with this cage (even without pup mouse records)
                                    const litters = data.litters || [];
                                    const matings = data.matings || [];
                                    const hasNursingLitter = litters.some(l => {
                                        const lStatus = (l.status || '').toLowerCase();
                                        const isNursing = (lStatus === 'active' || lStatus === 'nursing' || !l.status) && (parseInt(l.count, 10) || 0) > 0;
                                        if (!isNursing) return false;
                                        // Check if this litter's mating uses this cage (via dam's cage)
                                        const mating = matings.find(m => m.id === l.matingId);
                                        if (!mating) return false;
                                        const dam = mice.find(m => m.id === mating.damId);
                                        const litterCageTag = dam?.cageTag || l.cageTag || mating.cageTag;
                                        const litterRoom = dam?._roomSearch || l._roomSearch || mating._roomSearch;
                                        return litterCageTag === cage.tag && litterRoom === cage.room;
                                    });
                                    hasNursing = hasNursingMouse || hasNursingLitter;
                                    const hasPregnantMouse = cageMice.some(m => (m.status || m.state || '').toLowerCase() === 'pregnant');
                                    const hasPregnantMating = matings.some(m => {
                                        if ((m.status || '').toLowerCase() === 'pregnant') {
                                            const dam = mice.find(mouse => mouse.id === m.damId);
                                            const matingCageTag = dam?.cageTag || m.cageTag;
                                            const matingRoom = dam?._roomSearch || m._roomSearch;
                                            return matingCageTag === cage.tag && (!cage.room || !matingRoom || matingRoom === cage.room);
                                        }
                                        return false;
                                    });
                                    const hasPregnant = hasPregnantMouse || hasPregnantMating;
                                    isOvercrowded = miceCount > maxMice;
                                    if (isOvercrowded && hasNursing) {
                                        cageBorderColor = '#84cc16';
                                        cageBgTint = 'rgba(132, 204, 22, 0.08)';
                                    } else if (isOvercrowded && hasPregnant) {
                                        cageBorderColor = '#84cc16';
                                        cageBgTint = 'var(--card-bg)';
                                    } else if (isOvercrowded) {
                                        cageBorderColor = '#dc2626';
                                        cageBgTint = 'rgba(220, 38, 38, 0.08)';
                                    } else if (hasNursing) {
                                        cageBorderColor = '#84cc16';
                                        cageBgTint = 'rgba(132, 204, 22, 0.08)';
                                    } else if (hasPregnant) {
                                        cageBorderColor = '#84cc16';
                                        cageBgTint = 'var(--card-bg)';
                                    } else if (hasExperiment) {
                                        cageBorderColor = '#8b5cf6';
                                        cageBgTint = 'rgba(139, 92, 246, 0.08)';
                                        cageBorderWidth = '2px';
                                    } else if (hasMating) {
                                        cageBorderColor = '#ec4899';
                                        cageBgTint = 'rgba(236, 72, 153, 0.06)';
                                    }
                                }
                                return (
                                <div key={`${rIdx}-${cIdx}`} 
                                    onClick={() => cage && setSelectedCageModal(cage)}
                                    style={{
                                        aspectRatio: '1',
                                        background: cage ? cageBgTint : 'rgba(255,255,255,0.02)',
                                        border: cage ? `${cageBorderWidth} solid ${cageBorderColor}` : '1px dotted var(--glass-border)',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '0.2rem',
                                        minWidth: '40px',
                                        position: 'relative',
                                        cursor: cage ? 'pointer' : 'default',
                                        transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                                        boxShadow: cage ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                                    }}
                                    title={cage ? `Click to view mice in ${getCageDisplayTag(cage.room, cage.tag)}` : undefined}
                                >
                                    {cage ? (
                                        <>
                                            <div style={{ fontWeight: 800, fontSize: '0.75rem', color: cageBorderColor, marginBottom: '0.1rem' }}>
                                                {getCageDisplayTag(cage.room, cage.tag)}
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                                                {(() => {
                                                    const cageKey = `${cage.room || 'default'}|${cage.tag}`;
                                                    return miceByCage[cageKey]?.map(m => {
                                                        const isPup = (m.status || m.state) === 'Nursing' || (m.status || m.state) === 'Weaning';
                                                        return (
                                                            <div key={m.id} style={{
                                                                width: '10px', height: '10px',
                                                                borderRadius: isPup ? '50%' : '2px',
                                                                background: m.sex === '♂' || m.sex === 'Male' ? '#3b82f6' : m.sex === '♀' || m.sex === 'Female' ? '#ec4899' : '#888'
                                                            }} title={`${m.tag || m.id} (${m.sex}) - ${m.status || m.state}`} />
                                                        );
                                                    });
                                                })()}
                                            </div>
                                            {(() => {
                                                const cageKey = `${cage.room || 'default'}|${cage.tag}`;
                                                const pupsCount = pupsByCage[cageKey] || 0;
                                                if (pupsCount <= 0) return null;
                                                return (
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '2px',
                                                        marginTop: '2px',
                                                        fontSize: '0.62rem',
                                                        fontWeight: 700,
                                                        color: '#ec4899',
                                                        lineHeight: 1
                                                    }}>
                                                        <PupAnimalIcon size={13} style={{ flexShrink: 0 }} />
                                                        <span>+{pupsCount} pups</span>
                                                    </div>
                                                );
                                            })()}
                                            <div style={{ position: 'absolute', bottom: '2px', right: '4px', opacity: 0.65, fontSize: '0.52rem', fontWeight: 600 }}>
                                                {(() => {
                                                    const cageKey = `${cage.room || 'default'}|${cage.tag}`;
                                                    const adultCount = miceByCage[cageKey]?.length || 0;
                                                    const pupsCount = pupsByCage[cageKey] || 0;
                                                    if (pupsCount > 0) {
                                                        return `${adultCount} (+${pupsCount})`;
                                                    }
                                                    return adultCount;
                                                })()}
                                            </div>
                                            {isOvercrowded && (
                                                <div style={{ position: 'absolute', top: '1px', right: '3px' }} title={`Over capacity (max: ${maxMice})${hasNursing ? ' - Nursing' : hasPregnant ? ' - Pregnant' : ''}`}>
                                                    <AlertTriangle size={10} color={hasNursing || hasPregnant ? "#84cc16" : "#dc2626"} strokeWidth={3} />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div style={{ color: 'var(--text-muted)', opacity: 0.3, fontSize: '0.55rem' }}>{getRowLabel(rIdx)}-{getColLabel(cIdx)}</div>
                                    )}
                                </div>
                                );
                            }))}
                        </div>

                        {floatingCages.length > 0 && (
                            <div style={{ marginTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Floating Cages (No Grid Position)</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                    {floatingCages.map(cage => {
                                        const cageKey = `${cage.room || 'default'}|${cage.tag}`;
                                        const adultCount = miceByCage[cageKey]?.length || 0;
                                        const pupsCount = pupsByCage[cageKey] || 0;
                                        return (
                                             <div 
                                                key={cage.id} 
                                                className="card" 
                                                onClick={() => setSelectedCageModal(cage)}
                                                style={{ padding: '0.75rem', minWidth: '150px', cursor: 'pointer' }}
                                                title={`Click to view mice in ${getCageDisplayTag(cage.room, cage.tag)}`}
                                            >
                                                <div style={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span>{getCageDisplayTag(cage.room, cage.tag)}</span>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                        {adultCount}{pupsCount > 0 ? ` (+${pupsCount})` : ''} mice
                                                    </span>
                                                </div>
                                                {pupsCount > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.7rem', color: '#ec4899', fontWeight: 700 }}>
                                                        <PupAnimalIcon size={14} />
                                                        <span>+{pupsCount} pups</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
            </div>

            {/* Cage Mice Detail Popup Modal */}
            {selectedCageModal && (() => {
                const cage = selectedCageModal;
                const cageKey = `${cage.room || 'default'}|${cage.tag}`;
                const cageMice = miceByCage[cageKey] || [];
                const pupsCount = pupsByCage[cageKey] || 0;

                // Find associated active litters for this cage
                const cageLitters = litters.filter(l => {
                    const lStatus = (l.status || '').toLowerCase();
                    if (lStatus === 'weaned' || lStatus === 'inactive' || lStatus === 'dead') return false;
                    const mating = matings.find(m => m.id === l.matingId);
                    const dam = mice.find(m => m.id === mating?.damId);
                    const targetCageTag = l.cageTag || dam?.cageTag || mating?.cageTag;
                    const targetRoom = l._roomSearch || dam?._roomSearch || mating?._roomSearch || l.room || mating?.room;
                    let matchedCage = cages.find(c => c.tag === targetCageTag && (!targetRoom || c.room === targetRoom));
                    if (!matchedCage) matchedCage = cages.find(c => c.tag === targetCageTag);
                    return (matchedCage?.tag === cage.tag && (matchedCage?.room || targetRoom) === cage.room) || (targetCageTag === cage.tag);
                });

                const roomInfo = rooms.find(r => r.name === cage.room) || {};
                const displayRoom = roomInfo.roomName || (cage.room?.includes('/') ? cage.room.split('/')[0] : cage.room) || '-';
                const displayRack = (cage.room?.includes('/') ? cage.room.split('/')[1] : (roomInfo.roomName ? roomInfo.name : '')) || '-';

                return (
                    <div 
                        className="modal-overlay" 
                        style={{ 
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            zIndex: 10000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' 
                        }} 
                        onClick={() => setSelectedCageModal(null)}
                    >
                        <div 
                            style={{ 
                                position: 'relative', width: '92%', maxWidth: '560px', maxHeight: '85vh', 
                                background: 'var(--card-bg)', borderRadius: '18px', border: '1px solid var(--card-border)', 
                                boxShadow: '0 24px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden' 
                            }} 
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.4rem', borderBottom: '1px solid var(--card-border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCageModal(null)}
                                        className="mac-traffic-close"
                                        title="Close"
                                    >
                                        <X size={8} strokeWidth={3} />
                                    </button>
                                    <div>
                                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Box size={17} color="var(--accent-primary)" />
                                            <span>{getCageDisplayTag(cage.room, cage.tag)}</span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            Room: {displayRoom} {displayRack !== '-' && `• Rack: ${displayRack}`}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ 
                                        fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', 
                                        borderRadius: '20px', background: 'var(--background)', border: '1px solid var(--glass-border)' 
                                    }}>
                                        {cageMice.length} {cageMice.length === 1 ? 'Mouse' : 'Mice'}{pupsCount > 0 ? ` (+${pupsCount} pups)` : ''}
                                    </span>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {/* Mice List */}
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                                        Mice in this cage ({cageMice.length})
                                    </div>
                                    {cageMice.length === 0 ? (
                                        <div style={{ padding: '1.2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--background)', borderRadius: '10px' }}>
                                            No adult mice currently in this cage.
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                            {cageMice.map(m => {
                                                const isMale = m.sex === '♂' || m.sex === 'Male';
                                                return (
                                                    <div 
                                                        key={m.id} 
                                                        style={{ 
                                                            background: 'var(--background)', 
                                                            borderRadius: '10px', 
                                                            border: '1px solid var(--glass-border)', 
                                                            padding: '0.75rem 1rem', 
                                                            display: 'flex', 
                                                            flexDirection: 'column', 
                                                            gap: '0.4rem',
                                                            transition: 'all 0.15s ease'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <span style={{ 
                                                                    fontWeight: 800, fontSize: '0.92rem', 
                                                                    color: isMale ? '#3b82f6' : '#ec4899',
                                                                    display: 'flex', alignItems: 'center', gap: '4px'
                                                                }}>
                                                                    <span>{isMale ? '♂' : '♀'}</span>
                                                                    <span>{m.tag || m.id}</span>
                                                                </span>
                                                                {m.tag && m.id !== m.tag && (
                                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({m.id})</span>
                                                                )}
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                {m.status && (
                                                                    <span className={`badge badge-${m.status.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                                                                        {m.status}
                                                                    </span>
                                                                )}
                                                                {onSelect && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-ghost"
                                                                        style={{ padding: '2px 7px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--accent-primary)', border: '1px solid var(--glass-border)', borderRadius: '6px' }}
                                                                        onClick={() => {
                                                                            setSelectedCageModal(null);
                                                                            onSelect('mice', m.id);
                                                                        }}
                                                                        title="View in Manage"
                                                                    >
                                                                        <span>Manage</span>
                                                                        <ExternalLink size={11} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.35rem', fontSize: '0.78rem', marginTop: '2px' }}>
                                                            {m.line && (
                                                                <div>
                                                                    <span style={{ color: 'var(--text-muted)' }}>Line: </span>
                                                                    <span style={{ fontWeight: 600 }}>{m.line}</span>
                                                                </div>
                                                            )}
                                                            {m.genotype && (
                                                                <div>
                                                                    <span style={{ color: 'var(--text-muted)' }}>Genotype: </span>
                                                                    <span style={{ fontWeight: 600 }}>{m.genotype}</span>
                                                                </div>
                                                            )}
                                                            {m.dob && (
                                                                <div>
                                                                    <span style={{ color: 'var(--text-muted)' }}>DOB: </span>
                                                                    <span>{m.dob}</span>
                                                                    <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>({getAge(m.dob)})</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {m.comment && (
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--glass-border)', paddingTop: '4px', marginTop: '2px' }}>
                                                                Note: {m.comment}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Active Litters in this cage */}
                                {cageLitters.length > 0 && (
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                                            Active Litters ({cageLitters.length})
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                            {cageLitters.map(l => {
                                                const registeredPups = mice.filter(m => m.litterId === l.id);
                                                const count = parseInt(l.count, 10) || 0;
                                                const unreg = Math.max(0, count - registeredPups.length);
                                                return (
                                                    <div 
                                                        key={l.id}
                                                        style={{
                                                            background: 'rgba(236, 72, 153, 0.05)',
                                                            border: '1px solid rgba(236, 72, 153, 0.2)',
                                                            borderRadius: '10px',
                                                            padding: '0.75rem 1rem',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '0.4rem'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.9rem', color: '#ec4899' }}>
                                                                <PupAnimalIcon size={18} />
                                                                <span>{l.id}</span>
                                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginLeft: '4px' }}>
                                                                    ({count} pups{unreg > 0 ? `, ${unreg} unweaned` : ''})
                                                                </span>
                                                            </div>
                                                            {onSelect && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-ghost"
                                                                    style={{ padding: '2px 7px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '6px' }}
                                                                    onClick={() => {
                                                                        setSelectedCageModal(null);
                                                                        onSelect('litters', l.id);
                                                                    }}
                                                                >
                                                                    <span>Manage</span>
                                                                    <ExternalLink size={11} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.35rem', fontSize: '0.78rem' }}>
                                                            {l.dob && (
                                                                <div>
                                                                    <span style={{ color: 'var(--text-muted)' }}>DOB: </span>
                                                                    <span>{l.dob} ({getAge(l.dob)})</span>
                                                                </div>
                                                            )}
                                                            {l.matingId && (
                                                                <div>
                                                                    <span style={{ color: 'var(--text-muted)' }}>Mating: </span>
                                                                    <span>{l.matingId}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div style={{ padding: '0.8rem 1.4rem', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--card-bg)' }}>
                                <button 
                                    type="button" 
                                    className="btn btn-primary" 
                                    style={{ padding: '0.45rem 1.4rem', fontSize: '0.82rem', fontWeight: 600 }}
                                    onClick={() => setSelectedCageModal(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
