"use client";
import { useState } from 'react';
import holiday_jp from '@holiday-jp/holiday_jp';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function Calendar({ data, onSelect }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

    const nextMonthObj = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);

    const showHolidays = data?.settings?.showJpHolidays !== false;
    const events = {};
    const completedIds = data?.completedTasks || [];

    // Get cage location display helper
    const getCageDisplayTag = (cageTag, room) => {
        if (!cageTag || cageTag === 'nan') return '';
        const mode = data.settings?.cageDisplayMode || 'full';
        
        // Check if tag is in new composite format: Room_Rack-Tag
        if (cageTag.includes('_') && cageTag.includes('-')) {
            const underscoreIndex = cageTag.indexOf('_');
            const dashIndex = cageTag.indexOf('-', underscoreIndex);
            
            const rackPart = cageTag.substring(underscoreIndex + 1, dashIndex);
            const shortTag = cageTag.substring(dashIndex + 1);

            if (mode === 'tag') return shortTag;
            if (mode === 'rack-tag') return `${rackPart}-${shortTag}`;
            return cageTag;
        }

        // Fallback for legacy or partial data
        if (mode === 'tag') return cageTag;
        
        const targetRoom = room || data.cages?.find(c => String(c.tag) === String(cageTag))?.room;
        if (!targetRoom) return cageTag;
        
        const rackPart = targetRoom.includes('/') ? targetRoom.split('/')[1] : targetRoom;
        if (mode === 'rack-tag') return `${rackPart}-${cageTag}`;
        
        const fullPrefix = targetRoom.replace('/', '_');
        return `${fullPrefix}-${cageTag}`;
    };

    if (data?.matings) {
        data.matings.forEach(mating => {
            if (!mating.startDate) return;
            const start = new Date(mating.startDate);
            if (isNaN(start.getTime())) return;

            const birthCheckDays = data?.settings?.birthCheckDays || 20;
            const d = new Date(start);
            d.setDate(start.getDate() + birthCheckDays); 
            
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            if (!events[key]) events[key] = [];
            
            const taskId = `birthcheck-${mating.id}`;
            const dam = data.mice?.find(m => m.id === mating.damId);
            const cageLoc = getCageDisplayTag(dam?.cageTag || mating.cageTag);
            const cageSuffix = cageLoc ? ` (${cageLoc})` : '';

            events[key].push({ 
                type: 'birthcheck', 
                text: `Birth Check${cageSuffix}`, 
                id: mating.id, 
                tab: 'matings',
                isCompleted: completedIds.includes(taskId)
            });
        });
    }

    if (data?.litters) {
        data.litters.forEach(litter => {
            if (!litter.dob) return;
            const dob = new Date(litter.dob);
            if (isNaN(dob.getTime())) return;

            // Try to determine cage tag
            let cageTag = litter.cageTag;
            if (!cageTag && litter.matingId) {
                const mating = data.matings?.find(m => m.id === litter.matingId);
                const dam = data.mice?.find(m => m.id === mating?.damId);
                cageTag = dam?.cageTag || mating?.cageTag;
            }

            if (cageTag) {
                cageTag = getCageDisplayTag(cageTag);
            }
            const cageSuffix = cageTag ? ` (${cageTag})` : '';

            const bKey = `${dob.getFullYear()}-${dob.getMonth()}-${dob.getDate()}`;
            if (!events[bKey]) events[bKey] = [];
            events[bKey].push({ type: 'birth', text: `Born: ${litter.count} pups${cageSuffix}`, id: litter.id, tab: 'litters' });

            const weaningDays = data?.settings?.weaningDays || 21;
            const w = new Date(dob);
            w.setDate(dob.getDate() + weaningDays); // Dynamic based on settings
            const wKey = `${w.getFullYear()}-${w.getMonth()}-${w.getDate()}`;
            if (!events[wKey]) events[wKey] = [];
            const weaningTaskId = `wean-litter-${litter.id}`;
            events[wKey].push({ 
                type: 'weaning', 
                text: `Wean Pups${cageSuffix}`, 
                id: litter.id, 
                tab: 'litters',
                isCompleted: completedIds.includes(weaningTaskId)
            });
        });
    }

    const processReminders = (items, tab) => {
        if (!items) return;
        items.forEach(item => {
            const reminders = [...(item.reminders || [])];
            if (item.reminderDate && item.reminderPurpose) {
                if (!reminders.some(r => r.date === item.reminderDate && r.purpose === item.reminderPurpose)) {
                    reminders.push({ date: item.reminderDate, purpose: item.reminderPurpose });
                }
            }

            reminders.forEach(rem => {
                const due = new Date(rem.date);
                if (isNaN(due.getTime())) return;
                const key = `${due.getFullYear()}-${due.getMonth()}-${due.getDate()}`;
                if (!events[key]) events[key] = [];
                let text = `${rem.purpose}: `;
                if (tab === 'mice') text += getCageDisplayTag(item.cageTag) || item.id;
                else if (tab === 'cages') text += `Cage ${getCageDisplayTag(item.tag, item.room)}`;
                else if (tab === 'litters') text += `Litter ${item.id} (${getCageDisplayTag(item.cageTag)})`;
                else if (tab === 'matings') text += `Mating ${item.id} (${getCageDisplayTag(item.cageTag)})`;
                
                const typePrefix = tab === 'mice' ? 'mouse' : tab === 'cages' ? 'cage' : tab === 'litters' ? 'litter' : 'mating';
                const itemId = item.id || item.tag;
                const taskId = `rem-${typePrefix}-${itemId}-${rem.date}-${rem.purpose}`;

                events[key].push({ 
                    type: 'reminder', 
                    text, 
                    id: itemId, 
                    tab, 
                    purpose: rem.purpose,
                    isCompleted: completedIds.includes(taskId)
                });
            });
        });
    };

    processReminders(data?.mice, 'mice');
    processReminders(data?.cages, 'cages');
    processReminders(data?.litters, 'litters');
    processReminders(data?.matings, 'matings');

    const renderMonthGrid = (targetDate) => {
        const days = [];
        const totalDays = daysInMonth(targetDate);
        const startDay = firstDayOfMonth(targetDate);
        const targetMonthName = targetDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} style={{ padding: '0.5rem' }}></div>);
        }

        for (let d = 1; d <= totalDays; d++) {
            const key = `${targetDate.getFullYear()}-${targetDate.getMonth()}-${d}`;
            const dayEvents = events[key] || [];
            const isToday = new Date().toDateString() === new Date(targetDate.getFullYear(), targetDate.getMonth(), d).toDateString();
            const cellDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), d);
            const holiday = showHolidays ? holiday_jp.between(cellDate, cellDate)[0] : null;
            const isSunday = cellDate.getDay() === 0 || !!holiday;

            days.push(
                <div key={d} style={{
                    minHeight: '80px',
                    height: 'auto',
                    padding: '0.4rem',
                    background: isToday ? 'rgba(79, 70, 229, 0.1)' : 'var(--glass)',
                    border: isToday ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    overflow: 'hidden'
                }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: isToday ? 800 : 600, color: isToday ? 'var(--accent-primary)' : isSunday ? '#ff3b30' : 'var(--text-muted)' }} title={holiday ? `${holiday.name} (${holiday.name_en})` : undefined}>{d}{holiday && <span style={{ marginLeft: '4px', fontWeight: 600, fontSize: '0.6rem' }}>{holiday.name}</span>}</div>
                    {dayEvents.map((ev, idx) => {
                        const isDone = ev.isCompleted;
                        return (
                            <div
                                key={idx}
                                onClick={() => onSelect(ev.tab, ev.id)}
                                style={{
                                    fontSize: '0.6rem',
                                    padding: '2px 4px',
                                    borderRadius: '4px',
                                    background: isDone ? 'rgba(0,0,0,0.08)' : ev.type === 'birth' ? 'rgba(16, 185, 129, 0.2)' : ev.type === 'birthcheck' ? 'rgba(236, 72, 153, 0.2)' : (ev.type === 'reminder' && ev.purpose === 'Tissue Collection') ? 'rgba(245, 158, 11, 0.2)' : 'rgba(79, 70, 229, 0.2)',
                                    color: isDone ? 'var(--text-muted)' : ev.type === 'birth' ? 'var(--success)' : ev.type === 'birthcheck' ? '#ec4899' : (ev.type === 'reminder' && ev.purpose === 'Tissue Collection') ? '#d97706' : 'var(--accent-primary)',
                                    opacity: isDone ? 0.6 : 1,
                                    textDecoration: isDone ? 'line-through' : 'none',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                title={ev.text + (isDone ? ' (Completed)' : '')}
                            >
                                {ev.text}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CalendarIcon size={16} color="var(--accent-primary)" /> {targetMonthName}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: d === 'Sun' ? '#ff3b30' : 'var(--text-muted)' }}>{d}</div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className="card">
            <div className="card-title" style={{ justifyContent: 'space-between' }}>
                <div>Calendar (2 Months)</div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button onClick={prevMonth} className="btn btn-ghost" style={{ padding: '0.2rem' }}><ChevronLeft size={16} /></button>
                    <button onClick={nextMonth} className="btn btn-ghost" style={{ padding: '0.2rem' }}><ChevronRight size={16} /></button>
                </div>
            </div>
            <div>
                {renderMonthGrid(currentDate)}
                {renderMonthGrid(nextMonthObj)}
            </div>
        </div>
    );
}
