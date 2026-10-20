"use client";
import { motion } from 'framer-motion';
import { User, Dna, Calendar as CalendarIcon } from 'lucide-react';

export default function KanbanBoard({ data, onSelect }) {
    const columns = [
        { title: 'Mating/Pregnancy', states: ['Mating', 'Pregnant'] },
        { title: 'Nursing', states: ['Nursing'] },
        { title: 'Weaning/Geno', states: ['Weaning', 'Genotyping'] },
        { title: 'Stock/Experiment', states: ['Stock', 'Experiment'] }
    ];

    const getColumnData = (states) => {
        const isNotLive = (state) => ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Experiment', 'Missing', 'Transferred'].includes(state);
        return data?.mice?.filter(m => states.includes(m.state) && !isNotLive(m.state)) || [];
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', height: 'calc(100vh - 200px)' }}>
            {columns.map(col => (
                <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.5rem' }}>
                        {col.title} ({getColumnData(col.states).length})
                    </div>
                    <div style={{
                        background: 'var(--glass)',
                        borderRadius: '16px',
                        padding: '0.75rem',
                        flexGrow: 1,
                        overflowY: 'auto',
                        border: '1px solid var(--glass-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}>
                        {getColumnData(col.states).map(mouse => (
                            <motion.div
                                layout
                                key={mouse.id}
                                whileHover={{ y: -2 }}
                                onClick={() => onSelect && onSelect('mice', mouse.id)}
                                style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {mouse.id} {mouse.tag && mouse.tag !== 'nan' ? `[${mouse.tag}]` : ''}
                                        <span style={{ color: mouse.sex === '♂' || mouse.sex === 'Male' ? '#3b82f6' : mouse.sex === '♀' || mouse.sex === 'Female' ? '#ec4899' : '#888' }}>
                                            {mouse.sex === 'Male' ? '♂' : mouse.sex === 'Female' ? '♀' : mouse.sex}
                                        </span>
                                    </span>
                                    <span className={`badge badge-${mouse.state?.toLowerCase().replace('/', '-')}`}>{mouse.state}</span>
                                </div>
                                <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Dna size={12} /> {mouse.line === 'nan' ? 'Unknown' : mouse.line}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <CalendarIcon size={12} /> {mouse.dob}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
