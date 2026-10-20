"use client";
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Dna, GitMerge, Search, Users, ExternalLink } from 'lucide-react';

export default function PedigreeView({ data, onSelect, initialMouseId }) {
    const [selectedMouseId, setSelectedMouseId] = useState(initialMouseId || '');
    const [searchQuery, setSearchQuery] = useState('');

    const mice = data.mice || [];

    // Filter mice for the search
    const filteredMice = useMemo(() => {
        if (!searchQuery) return mice.slice(0, 10);
        const q = searchQuery.toLowerCase();
        return mice.filter(m =>
            m.id?.toLowerCase().includes(q) ||
            (m.tag && m.tag.toLowerCase().includes(q))
        ).slice(0, 20);
    }, [mice, searchQuery]);

    const targetMouse = useMemo(() =>
        mice.find(m => m.id === selectedMouseId),
        [mice, selectedMouseId]);

    const getFullPedigree = (mouseId) => {
        if (!mouseId) return null;
        const m = mice.find(x => x.id === mouseId);
        if (!m) return { id: mouseId, missing: true };

        const fetchMouse = (id) => mice.find(x => x.id === id);

        const sire = m.sireId ? fetchMouse(m.sireId) : null;
        const dam = m.damId ? fetchMouse(m.damId) : null;

        // Grandparents
        const gsire_p = sire?.sireId ? fetchMouse(sire.sireId) : null;
        const gdam_p = sire?.damId ? fetchMouse(sire.damId) : null;
        const gsire_m = dam?.sireId ? fetchMouse(dam.sireId) : null;
        const gdam_m = dam?.damId ? fetchMouse(dam.damId) : null;

        // Siblings (Litter)
        const siblings = mice.filter(x =>
            x.id !== m.id &&
            x.sireId === m.sireId &&
            x.damId === m.damId &&
            m.sireId && m.damId
        );

        // Children
        const children = mice.filter(x => x.sireId === m.id || x.damId === m.id);

        return {
            self: m,
            sire, dam,
            gsire_p, gdam_p,
            gsire_m, gdam_m,
            siblings,
            children
        };
    };

    const pedigree = useMemo(() => getFullPedigree(selectedMouseId), [mice, selectedMouseId]);

    const MouseNode = ({ mouse, label, isTarget = false, onClick }) => {
        if (!mouse) return (
            <div style={{
                width: '100px', height: '60px', borderRadius: '8px',
                border: '1px dashed var(--glass-border)', opacity: 0.3,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem'
            }}>
                {label}
            </div>
        );

        const isMale = mouse.sex === '♂' || mouse.sex === 'Male';
        const isFemale = mouse.sex === '♀' || mouse.sex === 'Female';
        const itemStatus = mouse.status || mouse.state;
        const isInactive = ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(itemStatus);

        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => onClick ? onClick(mouse.id) : (onSelect && onSelect('mice', mouse.id))}
                style={{
                    width: '130px',
                    background: 'var(--card-bg)',
                    border: `2px solid ${isTarget ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                    borderRadius: '10px',
                    padding: '0.4rem 0.6rem',
                    cursor: 'pointer',
                    boxShadow: isTarget ? '0 0 15px rgba(99, 102, 241, 0.15)' : '0 2px 6px rgba(0,0,0,0.03)',
                    position: 'relative',
                    textAlign: 'left',
                    zIndex: 2,
                    flexShrink: 0
                }}
            >
                {/* Visual indicator (Square for Male, Circle for Female) */}
                <div style={{
                    position: 'absolute', top: '6px', right: '6px',
                    width: '10px', height: '10px',
                    borderRadius: isFemale ? '50%' : '2px',
                    border: `2px solid ${isMale ? '#3b82f6' : isFemale ? '#ec4899' : '#888'}`,
                    background: isInactive ? 'transparent' : (isMale ? '#3b82f6' : isFemale ? '#ec4899' : '#888'),
                    opacity: 0.8
                }}>
                    {isInactive && <div style={{ position: 'absolute', top: '50%', left: '-2px', width: '14px', height: '1px', background: '#e11d48', transform: 'rotate(-45deg)', transformOrigin: 'center' }} />}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '2px' }}>
                    <div style={{ fontSize: '0.5rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', opacity: 0.5 }}>
                        {mouse.id}
                    </div>
                    {mouse.tag && mouse.tag !== 'nan' && (
                        <div style={{ fontWeight: 800, fontSize: '0.75rem', color: isMale ? '#3b82f6' : isFemale ? '#ec4899' : 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {mouse.tag}
                        </div>
                    )}
                </div>
                <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.6rem' }}>{mouse.genotype || 'No Geno'}</div>
                    <div style={{ opacity: 0.6 }}>{mouse.dob}</div>
                    <div style={{
                        marginTop: '2px', alignSelf: 'flex-start', padding: '1px 4px', borderRadius: '3px',
                        background: 'rgba(0,0,0,0.04)', fontSize: '0.5rem', fontWeight: 800,
                        color: isInactive ? 'var(--danger)' : 'var(--success)', opacity: 0.9
                    }}>{mouse.status || mouse.state}</div>
                </div>
            </motion.div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflow: 'hidden' }}>
            {/* SEARCH */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'nowrap', padding: '0.5rem 0' }}>
                <div style={{ position: 'relative', width: '220px' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                        <Search size={15} />
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search ID/Tag..."
                        style={{ paddingLeft: '38px', borderRadius: '12px', height: '38px', fontSize: '0.9rem', border: '1px solid var(--glass-border)', width: '100%', outline: 'none' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <div style={{
                            position: 'absolute', top: '100%', left: 0, right: 0,
                            background: 'var(--card-bg)', border: '1px solid var(--glass-border)',
                            borderRadius: '10px', marginTop: '4px', zIndex: 100,
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden'
                        }}>
                            {filteredMice.map(m => (
                                <div key={m.id} onClick={() => { setSelectedMouseId(m.id); setSearchQuery(''); }} style={{ padding: '0.6rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)', fontSize: '0.85rem' }} className="hover-bg">
                                    <span style={{ opacity: 0.5, fontSize: '0.7rem', marginRight: '8px' }}>{m.id}</span>
                                    <span style={{ fontWeight: 800 }}>{m.tag && m.tag !== 'nan' ? m.tag : '-'}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {targetMouse && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.6rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                        <GitMerge size={12} color="var(--accent-primary)" />
                        <span style={{ fontSize: '0.65rem', opacity: 0.5, marginRight: '4px' }}>{targetMouse.id}</span>
                        <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{targetMouse.tag && targetMouse.tag !== 'nan' ? targetMouse.tag : '-'}</span>
                    </div>
                )}
            </div>

            <div style={{ flex: 1, position: 'relative', background: 'var(--background)', borderRadius: '20px', padding: '1.5rem', overflow: 'hidden', border: '1px solid var(--glass-border)', display: 'flex' }}>
                {!selectedMouseId ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                        <Users size={48} style={{ marginBottom: '1rem' }} />
                        <h4 style={{ fontWeight: 800 }}>Search for a mouse to see lineage</h4>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 250px', gap: '1.5rem', width: '100%', height: '100%' }}>
                        {/* LEFT: Pedigree Tree (Scrollable) */}
                        <div style={{ overflow: 'auto', padding: '1rem', borderRight: '1px solid var(--glass-border)', position: 'relative' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3.5rem', padding: '1rem 0' }}>

                                {/* GENERATION 1: Grandparents */}
                                <div style={{ display: 'flex', gap: '4rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', position: 'relative' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <MouseNode mouse={pedigree.gsire_p} label="GPS" onClick={setSelectedMouseId} />
                                            <MouseNode mouse={pedigree.gdam_p} label="GPD" onClick={setSelectedMouseId} />
                                        </div>
                                        {/* Marriage line & downward line */}
                                        <div style={{ position: 'absolute', top: '30px', left: '65px', right: '65px', height: '2px', background: 'var(--text-muted)', opacity: 0.4 }} />
                                        <div style={{ height: '20px', width: '2px', background: 'var(--text-muted)', opacity: 0.4 }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', position: 'relative' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <MouseNode mouse={pedigree.gsire_m} label="GMS" onClick={setSelectedMouseId} />
                                            <MouseNode mouse={pedigree.gdam_m} label="GMD" onClick={setSelectedMouseId} />
                                        </div>
                                        {/* Marriage line & downward line */}
                                        <div style={{ position: 'absolute', top: '30px', left: '65px', right: '65px', height: '2px', background: 'var(--text-muted)', opacity: 0.4 }} />
                                        <div style={{ height: '20px', width: '2px', background: 'var(--text-muted)', opacity: 0.4 }} />
                                    </div>
                                </div>

                                {/* GENERATION 2: Parents */}
                                <div style={{ display: 'flex', gap: '7rem', position: 'relative' }}>
                                    {/* Connection bar between parents */}
                                    <div style={{ position: 'absolute', top: '30px', left: '130px', right: '130px', height: '2px', background: 'var(--text-muted)', zIndex: 0 }} />
                                    {/* Middle vertical line */}
                                    <div style={{ position: 'absolute', top: '30px', left: '50%', width: '2px', height: '90px', background: 'var(--text-muted)', zIndex: 0 }} />

                                    <MouseNode mouse={pedigree.sire} label="Sire (♂)" onClick={setSelectedMouseId} />
                                    <MouseNode mouse={pedigree.dam} label="Dam (♀)" onClick={setSelectedMouseId} />
                                </div>

                                {/* GENERATION 3: Target Mouse (G3) */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%', position: 'relative' }}>
                                    <div style={{ height: '35px' }} /> {/* Just for spacing the vertical line from above */}
                                    <MouseNode mouse={pedigree.self} label="Target" isTarget={true} />
                                </div>

                                {/* GENERATION 4: Offspring */}
                                {pedigree.children.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '1rem', width: '100%' }}>
                                        <div style={{ height: '40px', width: '2px', background: 'var(--text-muted)', marginTop: '-3.5rem' }} />
                                        <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', opacity: 0.7 }}>Offspring</div>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', alignItems: 'center' }}>
                                            {(() => {
                                                const groups = {};
                                                pedigree.children.forEach(child => {
                                                    const lid = child.litterId || 'No Litter ID';
                                                    if (!groups[lid]) groups[lid] = [];
                                                    groups[lid].push(child);
                                                });

                                                return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0])).map(([lid, children]) => {
                                                    const litterInfo = data.litters?.find(l => l.id === lid);
                                                    const mating = data.matings?.find(m => m.id === litterInfo?.matingId);
                                                    
                                                    // Get partner info
                                                    const getTag = (id) => {
                                                        const m = data.mice?.find(x => x.id === id);
                                                        return m ? (m.tag && m.tag !== 'nan' ? m.tag : m.id) : id;
                                                    };

                                                    const sireLabel = mating ? getTag(mating.sireId) : (children[0]?.sireId ? getTag(children[0].sireId) : '?');
                                                    const damLabel = mating ? getTag(mating.damId) : (children[0]?.damId ? getTag(children[0].damId) : '?');

                                                    return (
                                                        <div key={lid} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', width: '100%' }}>
                                                            <div style={{ 
                                                                padding: '4px 12px', 
                                                                borderRadius: '20px', 
                                                                background: 'rgba(var(--accent-rgb), 0.05)', 
                                                                border: '1px solid var(--glass-border)',
                                                                fontSize: '0.6rem',
                                                                fontWeight: 800,
                                                                color: 'var(--text-muted)',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: '4px',
                                                                alignItems: 'center',
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                                                            }}>
                                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                                    <span style={{ color: 'var(--accent-secondary)', fontSize: '0.65rem' }}>{lid}</span>
                                                                    {litterInfo?.dob && <span style={{ opacity: 0.6 }}>Born: {litterInfo.dob}</span>}
                                                                    <span style={{ opacity: 0.6 }}>({children.length} pups)</span>
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: 'var(--text-main)', opacity: 0.8 }}>
                                                                    <span style={{ color: '#3b82f6' }}>♂ {sireLabel}</span>
                                                                    <span style={{ opacity: 0.3 }}>×</span>
                                                                    <span style={{ color: '#ec4899' }}>♀ {damLabel}</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ position: 'relative', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '800px' }}>
                                                                {children.length > 1 && (
                                                                    <div style={{ position: 'absolute', top: '-12px', left: '65px', right: '65px', height: '2px', background: 'var(--text-muted)', opacity: 0.4 }} />
                                                                )}
                                                                {children.map(child => (
                                                                    <div key={child.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                        <div style={{ height: '12px', width: '2px', background: 'var(--text-muted)', marginTop: '-12px', opacity: 0.4 }} />
                                                                        <MouseNode mouse={child} onClick={setSelectedMouseId} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Litter List (Compact) */}
                        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                                <Users size={16} color="var(--accent-secondary)" />
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Litter</h4>
                                <div style={{ marginLeft: 'auto', background: 'var(--glass)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>
                                    {pedigree.siblings.length}
                                </div>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.4rem' }}>
                                {pedigree.siblings.length > 0 ? pedigree.siblings.map(sib => (
                                    <div
                                        key={sib.id}
                                        onClick={() => setSelectedMouseId(sib.id)}
                                        className="hover-bg"
                                        style={{
                                            padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
                                            cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '2px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.55rem', opacity: 0.5, fontWeight: 800 }}>{sib.id}</span>
                                            <span style={{
                                                fontSize: '0.8rem', fontWeight: 800,
                                                color: (sib.sex === '♂' || sib.sex === 'Male') ? '#3b82f6' : (sib.sex === '♀' || sib.sex === 'Female') ? '#ec4899' : 'inherit'
                                            }}>
                                                {sib.tag && sib.tag !== 'nan' ? sib.tag : '-'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-main)', opacity: 0.9 }}>{sib.genotype}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6, fontSize: '0.55rem', marginTop: '2px' }}>
                                            <span>{sib.dob}</span>
                                            <span>{sib.status || sib.state}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', opacity: 0.3, fontSize: '0.7rem', marginTop: '2rem' }}>
                                        No siblings
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .hover-bg:hover {
                    background: var(--glass);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .hover-bg { transition: all 0.2s ease; }
            `}</style>
        </div>
    );
}
