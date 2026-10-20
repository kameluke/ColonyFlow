import { useState } from 'react';
import { Clock, Check, History, Undo } from 'lucide-react';

export default function TodoList({ data, onUpdate, onSelect }) {
    const [showHistory, setShowHistory] = useState(false);
    const tasks = [];
    const completedIds = data?.completedTasks || [];

    // Lookup helpers
    const getMouseTag = (id) => {
        const m = data?.mice?.find(x => x.id === id);
        return m ? m.tag || m.id : 'Unknown';
    };

    const getCageInfo = (cageTag) => {
        if (!cageTag || cageTag === 'nan') return { roomName: '', cageLabel: '' };
        const mode = data.settings?.cageDisplayMode || 'full';
        const cage = data?.cages?.find(x => x.tag === cageTag);
        const roomName = cage?.room || '';

        const roomObj = data?.rooms?.find(r => r.name === roomName);
        const displayRoom = roomObj?.roomName || (roomName.includes('/') ? roomName.split('/')[0] : roomName);

        // Logic for cageLabel
        let cageLabel = cageTag;
        if (cageTag.includes('_') && cageTag.includes('-')) {
            const underscoreIndex = cageTag.indexOf('_');
            const dashIndex = cageTag.indexOf('-', underscoreIndex);
            const rackPart = cageTag.substring(underscoreIndex + 1, dashIndex);
            const shortTag = cageTag.substring(dashIndex + 1);

            if (mode === 'tag') cageLabel = shortTag;
            else if (mode === 'rack-tag') cageLabel = `${rackPart}-${shortTag}`;
            else cageLabel = cageTag;
        } else {
            // Legacy
            if (mode === 'tag') cageLabel = cageTag;
            else {
                const rackPart = roomName.includes('/') ? roomName.split('/')[1] : (roomObj?.roomName ? roomObj.name : roomName);
                if (mode === 'rack-tag') cageLabel = rackPart ? `${rackPart}-${cageTag}` : cageTag;
                else {
                    const fullPrefix = roomName.replace('/', '_');
                    cageLabel = fullPrefix ? `${fullPrefix}-${cageTag}` : cageTag;
                }
            }
        }

        return {
            roomName: displayRoom,
            cageLabel: cageLabel
        };
    };

    const getMatingInfo = (matingId) => {
        const m = data?.matings?.find(x => x.id === matingId);
        if (!m) return { text: 'Unknown Pair', loc: { roomRack: '', cageTag: '' } };
        // Use dam's (female) cage as the primary location
        const dam = data?.mice?.find(mouse => mouse.id === m.damId);
        const primaryCageTag = dam?.cageTag || m.cageTag;
        return {
            text: `${getMouseTag(m.sireId)} x ${getMouseTag(m.damId)}`,
            loc: getCageInfo(primaryCageTag)
        };
    };

    // 1. Pup Birth Checks (20 days from mating start)
    const weaningDays = data?.settings?.weaningDays || 21;

    if (data?.matings) {
        data.matings.forEach(mating => {
            if (!mating.startDate) return;
            const start = new Date(mating.startDate);
            if (isNaN(start.getTime())) return;

            const birthCheckDays = data?.settings?.birthCheckDays || 20;
            const checkDate = new Date(start);
            checkDate.setDate(start.getDate() + birthCheckDays); 

            const taskId = `birthcheck-${mating.id}`;
            const isCompleted = completedIds.includes(taskId);

            // Logic: Bifurcate based on showHistory
            const shouldAdd = isCompleted === showHistory;
            if (!shouldAdd) return;

            const hasLitter = data?.litters?.some(l => l.matingId === mating.id);
            if (!hasLitter || isCompleted) {
                const now = new Date();
                const diffDays = Math.ceil((checkDate - now) / (1000 * 60 * 60 * 24));
                if (showHistory || diffDays <= 30) {
                    const dam = data?.mice?.find(mouse => mouse.id === mating.damId);
                    const cageInfo = getCageInfo(dam?.cageTag || mating.cageTag);
                    tasks.push({
                        id: taskId,
                        matingId: mating.id,
                        title: `Birth Check`,
                        loc: cageInfo,
                        due: checkDate.toLocaleDateString(),
                        daysLeft: diffDays,
                        type: 'birthcheck',
                        tab: 'matings',
                        isCompleted
                    });
                }
            }
        });
    }

    // 2. Weaning (21 days from litter birth date)
    if (data?.litters) {
        data.litters.forEach(litter => {
            if (!litter.dob) return;
            const dob = new Date(litter.dob);
            if (isNaN(dob.getTime())) return;

            const weaningDate = new Date(dob);
            weaningDate.setDate(dob.getDate() + weaningDays); // Dynamic based on settings

            const taskId = `wean-litter-${litter.id}`;
            const isCompleted = completedIds.includes(taskId);

            // Logic: Bifurcate based on showHistory
            if (isCompleted !== showHistory) return;

            const now = new Date();
            const diffDays = Math.ceil((weaningDate - now) / (1000 * 60 * 60 * 24));
            if (showHistory || diffDays <= 30) {
                const mInfo = getMatingInfo(litter.matingId);
                tasks.push({
                    id: taskId,
                    litterId: litter.id,
                    title: `Wean Pups`,
                    loc: mInfo.loc,
                    due: weaningDate.toLocaleDateString(),
                    daysLeft: diffDays,
                    type: 'weaning',
                    tab: 'litters',
                    isCompleted
                });
            }
        });
    }

    // 3. User Defined Reminders (Mice & Cages)
    if (data?.mice) {
        data.mice.forEach(mouse => {
            const reminders = [...(mouse.reminders || [])];
            if (mouse.reminderDate && mouse.reminderPurpose) {
                if (!reminders.some(r => r.date === mouse.reminderDate && r.purpose === mouse.reminderPurpose)) {
                    reminders.push({ date: mouse.reminderDate, purpose: mouse.reminderPurpose });
                }
            }

            reminders.forEach((rem, idx) => {
                const due = new Date(rem.date);
                if (isNaN(due.getTime())) return;

                const taskId = `rem-mouse-${mouse.id}-${rem.date}-${rem.purpose}`;
                const isCompleted = completedIds.includes(taskId);

                if (isCompleted !== showHistory) return;

                const now = new Date();
                const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
                if (showHistory || diffDays <= 30) {
                    tasks.push({
                        id: taskId,
                        itemId: mouse.id,
                        title: `${rem.purpose}: ${mouse.tag || mouse.id}`,
                        loc: getCageInfo(mouse.cageTag),
                        due: due.toLocaleDateString(),
                        daysLeft: diffDays,
                        type: 'reminder',
                        tab: 'mice',
                        isCompleted
                    });
                }
            });
        });
    }

    if (data?.cages) {
        data.cages.forEach(cage => {
            const reminders = [...(cage.reminders || [])];
            if (cage.reminderDate && cage.reminderPurpose) {
                if (!reminders.some(r => r.date === cage.reminderDate && r.purpose === cage.reminderPurpose)) {
                    reminders.push({ date: cage.reminderDate, purpose: cage.reminderPurpose });
                }
            }

            reminders.forEach((rem, idx) => {
                const due = new Date(rem.date);
                if (isNaN(due.getTime())) return;

                const itemId = cage.id || cage.tag;
                const taskId = `rem-cage-${itemId}-${rem.date}-${rem.purpose}`;
                const isCompleted = completedIds.includes(taskId);

                if (isCompleted !== showHistory) return;

                const now = new Date();
                const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
                if (showHistory || diffDays <= 30) {
                    tasks.push({
                        id: taskId,
                        itemId: itemId,
                        title: `${rem.purpose}: Cage ${cage.tag}`,
                        loc: getCageInfo(cage.tag),
                        due: due.toLocaleDateString(),
                        daysLeft: diffDays,
                        type: 'reminder',
                        tab: 'cages',
                        isCompleted
                    });
                }
            });
        });
    }

    if (data?.matings) {
        data.matings.forEach(mating => {
            const reminders = [...(mating.reminders || [])];
            if (mating.reminderDate && mating.reminderPurpose) {
                if (!reminders.some(r => r.date === mating.reminderDate && r.purpose === mating.reminderPurpose)) {
                    reminders.push({ date: mating.reminderDate, purpose: mating.reminderPurpose });
                }
            }

            reminders.forEach((rem, idx) => {
                const due = new Date(rem.date);
                if (isNaN(due.getTime())) return;

                const itemId = mating.id;
                const taskId = `rem-mating-${itemId}-${rem.date}-${rem.purpose}`;
                const isCompleted = completedIds.includes(taskId);

                if (isCompleted !== showHistory) return;

                const now = new Date();
                const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
                if (showHistory || diffDays <= 30) {
                    const mInfo = getMatingInfo(mating.id);
                    tasks.push({
                        id: taskId,
                        itemId: itemId,
                        title: `${rem.purpose}: Mating ${mInfo.text}`,
                        loc: mInfo.loc,
                        due: due.toLocaleDateString(),
                        daysLeft: diffDays,
                        type: 'reminder',
                        tab: 'matings',
                        isCompleted
                    });
                }
            });
        });
    }

    if (data?.litters) {
        data.litters.forEach(litter => {
            const reminders = [...(litter.reminders || [])];
            if (litter.reminderDate && litter.reminderPurpose) {
                if (!reminders.some(r => r.date === litter.reminderDate && r.purpose === litter.reminderPurpose)) {
                    reminders.push({ date: litter.reminderDate, purpose: litter.reminderPurpose });
                }
            }

            reminders.forEach((rem, idx) => {
                const due = new Date(rem.date);
                if (isNaN(due.getTime())) return;

                const itemId = litter.id;
                const taskId = `rem-litter-${itemId}-${rem.date}-${rem.purpose}`;
                const isCompleted = completedIds.includes(taskId);

                if (isCompleted !== showHistory) return;

                const now = new Date();
                const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
                if (showHistory || diffDays <= 30) {
                    const mInfo = getMatingInfo(litter.matingId);
                    tasks.push({
                        id: taskId,
                        itemId: itemId,
                        title: `${rem.purpose}: Litter ${litter.id}`,
                        loc: mInfo.loc,
                        due: due.toLocaleDateString(),
                        daysLeft: diffDays,
                        type: 'reminder',
                        tab: 'litters',
                        isCompleted
                    });
                }
            });
        });
    }

    const handleComplete = async (e, taskId, undo = false) => {
        e.stopPropagation();
        const action = undo ? 'undoTask' : 'completeTask';
        const res = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, item: { taskId } })
        });
        if (res.ok) onUpdate();
    };

    tasks.sort((a, b) => (a.daysLeft || 0) - (b.daysLeft || 0));

    // Filter down array depending on mode
    const displayedTasks = tasks;

    const getTaskColor = (task) => {
        if (task.type === 'birthcheck') return '#ec4899';
        if (task.type === 'reminder') {
            const p = (task.title || '').toLowerCase();
            if (p.includes('tissue collection')) return '#d97706';
            if (p.includes('experiment')) return '#d97706';
            if (p.includes('health check')) return '#0d9488';
        }
        return 'var(--accent-primary)';
    };

    const renderTask = (task) => {
        const taskColor = getTaskColor(task);
        const isOverdue = !task.isCompleted && task.daysLeft < 0;
        
        return (
        <div
            key={task.id}
            onClick={() => onSelect(task.tab, task.itemId || task.litterId || task.matingId)}
            style={{
                padding: '1rem',
                background: isOverdue ? 'rgba(239, 68, 68, 0.08)' : 'var(--glass)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: isOverdue ? '1.5px solid rgba(239, 68, 68, 0.3)' : '1.5px solid var(--card-border, rgba(0,0,0,0.1))',
                cursor: 'pointer'
            }}
            title="Click to view full record"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                {/* Location Display matching Mice Table */}
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '80px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent-secondary)' }}>{task.loc.cageLabel}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{task.loc.roomName}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <div style={{
                        fontWeight: 400,
                        fontSize: '0.95rem',
                        color: taskColor
                    }}>
                        {task.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Due: {task.due} {!task.isCompleted && `(${task.daysLeft === 0 ? 'Today' : task.daysLeft > 0 ? `In ${task.daysLeft} days` : `${Math.abs(task.daysLeft)} days overdue`})`}
                    </div>
                </div>
            </div>
            <button
                className="btn btn-ghost"
                style={{ padding: '0.4rem', borderRadius: '50%' }}
                onClick={(e) => handleComplete(e, task.id, task.isCompleted)}
                title={task.isCompleted ? "Undo Complete" : "Mark as Complete"}
            >
                {task.isCompleted ? <Undo size={16} color="var(--text-muted)" /> : <Check size={16} color="var(--success)" />}
            </button>
        </div>
    );
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-title" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {showHistory ? <History size={20} color="var(--accent-primary)" /> : <Clock size={20} color="var(--accent-secondary)" />}
                    {showHistory ? 'Task History' : 'Active Tasks'}
                </div>
                <button
                    className="btn btn-ghost"
                    onClick={() => setShowHistory(!showHistory)}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                    {showHistory ? 'Show Active' : 'Show History'}
                </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {displayedTasks.length > 0 ? (() => {
                    if (showHistory) {
                        return displayedTasks.map(renderTask);
                    }
                    const nearTasks = displayedTasks.filter(t => t.daysLeft <= 7);
                    const laterTasks = displayedTasks.filter(t => t.daysLeft > 7);
                    return (
                        <>
                            {nearTasks.length > 0 && nearTasks.map(renderTask)}
                            {laterTasks.length > 0 && (
                                <>
                                    <div style={{ padding: '1rem 0', display: 'flex', alignItems: 'center' }}>
                                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                                        <div style={{ padding: '0 1rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upcoming (8+ days)</div>
                                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                                    </div>
                                    {laterTasks.map(renderTask)}
                                </>
                            )}
                        </>
                    );
                })() : (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
                        {showHistory ? 'No completed tasks found.' : 'No pending tasks within 30 days.'}
                    </div>
                )}
            </div>
        </div>
    );
}
