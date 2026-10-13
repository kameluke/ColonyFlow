"use client";
import { useState, useEffect } from 'react';
import Tabs from '../components/Navigation/Tabs';
import Calendar from '../components/Dashboard/Calendar';
import TodoList from '../components/Dashboard/TodoList';
import PedigreeView from '../components/Tracking/PedigreeView';
import CageGrid from '../components/Spatial/CageGrid';
import ManagementView from '../components/Management/ManagementView';
import TimelineView from '../components/Timeline/TimelineView';
import { RefreshCw, LayoutDashboard, Sun, Moon, HelpCircle, X, ChevronRight, ChevronDown, Info, Settings, MapPin, Search, Database, Trash2, Pencil, Folder, Upload, Printer, Baby, Calendar as CalendarIcon, Clock, Box, MousePointer2, Heart, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

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

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [pedigreeMouseId, setPedigreeMouseId] = useState('');
  const [data, setData] = useState({ mice: [], cages: [], matings: [], litters: [], rooms: [], completedTasks: [] });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selection, setSelection] = useState(null); // { type, id }
  const [theme, setTheme] = useState('light');
  const [showHelp, setShowHelp] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [helpLang, setHelpLang] = useState('jp');
  const [lastBackupTime, setLastBackupTime] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState('default');
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dataRoot, setDataRoot] = useState('');
  const [localNotes, setLocalNotes] = useState('');
  const [manageSubTab, setManageSubTab] = useState('mice');
  const [showManageMenu, setShowManageMenu] = useState(false);

  useEffect(() => {
    const handleWindowClick = () => {
      setShowManageMenu(false);
    };
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  useEffect(() => {
    if (data.settings?.dashboardNotes !== undefined && data.settings?.dashboardNotes !== localNotes) {
      setLocalNotes(data.settings.dashboardNotes);
    }
  }, [data.settings?.dashboardNotes]);

  useEffect(() => {
    if (isInitialLoad) return;
    const timer = setTimeout(() => {
      if (localNotes !== (data.settings?.dashboardNotes || '')) {
        handleUpdateSettings({ dashboardNotes: localNotes });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [localNotes]);

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(t);
    document.body.className = t;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.className = newTheme;
  };

  const handleCreateBackup = async () => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'backup' })
      });
      const result = await res.json();
      if (result.success) {
        setLastBackupTime(new Date());
        alert(`Backup created successfully: ${result.filename}`);
      } else {
        alert(`Backup failed: ${result.error}`);
      }
    } catch (e) {
      console.error(e);
      alert('Backup failed due to a network error.');
    }
  };

  const fetchData = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setIsInitialLoad(false);
      setIsSyncing(false);
    }
  };

  const handleExportAllExcel = () => {
    try {
      const getMouseInfo = (id) => data.mice?.find(x => x.id === id) || { id, tag: '' };

      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const [y, m, d] = parts;
        const fmt = data.settings?.dateFormat || 'YYYY-MM-DD';
        return fmt
          .replace('YYYY', y)
          .replace('YY', y.slice(-2))
          .replace('MM', m)
          .replace('DD', d);
      };

      const getAge = (dobString, format = (data.settings?.ageFormat || 'weeks'), endDateString) => {
        if (!dobString) return '-';
        const parseDateSafe = (str) => {
          const p = str.split(/[-/]/);
          if (p.length === 3) {
            return p[0].length === 4 ? new Date(p[0], p[1] - 1, p[2]) : new Date(p[2], p[0] - 1, p[1]);
          }
          return new Date(str);
        };
        const dob = parseDateSafe(dobString);
        if (isNaN(dob)) return '-';
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

      const wb = XLSX.utils.book_new();

      // 1. Mice Sheet
      const miceRows = (data.mice || []).map(m => {
        const cage = data.cages?.find(c => c.tag === m.cageTag);
        const roomName = cage?.room || m.room;
        const roomObj = data.rooms?.find(r => r.name === roomName);
        const displayRoom = roomObj?.roomName || (roomName?.includes('/') ? roomName.split('/')[0] : roomName) || '-';
        const displayRack = (roomName?.includes('/') ? roomName.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '-';
        const rowSex = m.sex === '♂' || m.sex === 'Male' ? 'Male' : (m.sex === '♀' || m.sex === 'Female' ? 'Female' : (m.sex || ''));

        return {
          'Tag / Ear Mark': m.tag || '',
          'Mouse ID': m.id,
          'Line': m.line || '',
          'Status': m.status || '',
          'Sex': rowSex,
          'DOB': m.dob || '',
          'Age': getAge(m.dob, data.settings?.ageFormat || 'weeks', m.endDate),
          'Weaning Date': m.weaningDate || '',
          'End Date': m.endDate || '',
          'Genotype': m.genotype || '',
          'Room': displayRoom,
          'Rack': displayRack,
          'Location (Cage)': m.cageTag || '',
          'Sire ID': m.sireId || '',
          'Dam ID': m.damId || '',
          'Mating ID': m.matingId || '',
          'Comment': m.comment || ''
        };
      });
      const wsMice = XLSX.utils.json_to_sheet(miceRows);
      XLSX.utils.book_append_sheet(wb, wsMice, "Mice");

      // 2. Cages Sheet
      const cagesRows = (data.cages || []).map(c => {
        const roomObj = data.rooms?.find(r => r.name === c.room);
        const displayRoom = roomObj?.roomName || (c.room?.includes('/') ? c.room.split('/')[0] : c.room) || '-';
        const displayRack = (c.room?.includes('/') ? c.room.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '-';
        const miceInCage = data.mice?.filter(m => m.cageTag === c.tag && !['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Missing', 'Transferred'].includes(m.status)) || [];
        const miceIds = miceInCage.map(m => m.tag || m.id).join(', ');

        return {
          'Cage ID': c.id,
          'Room': displayRoom,
          'Rack': displayRack,
          'Location Tag': c.tag || '-',
          'Row': c.row || '',
          'Col': c.col || '',
          'Mouse Count': miceInCage.length,
          'Occupant Mice': miceIds
        };
      });
      const wsCages = XLSX.utils.json_to_sheet(cagesRows);
      XLSX.utils.book_append_sheet(wb, wsCages, "Cages");

      // 3. Matings Sheet
      const matingsRows = (data.matings || []).map(m => {
        const cage = data.cages?.find(c => c.tag === m.cageTag);
        const roomObj = cage ? data.rooms?.find(r => r.name === cage.room) : null;
        const displayRoom = roomObj?.roomName || (cage?.room?.includes('/') ? cage.room.split('/')[0] : cage?.room) || '-';
        const displayRack = (cage?.room?.includes('/') ? cage.room.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '-';

        const sire = getMouseInfo(m.sireId);
        const dam = getMouseInfo(m.damId);
        const matingLitters = data.litters?.filter(l => l.matingId === m.id) || [];
        const littersDisplay = matingLitters.map(l => `${l.dob} (${l.count || 0}p)`).join('; ');

        return {
          'Mating ID': m.id,
          'Line': m.line || '',
          'Room': displayRoom,
          'Rack': displayRack,
          'Location (Cage)': m.cageTag || '-',
          'Status': m.status || 'Active',
          'Setup Date': m.startDate || '',
          'End Date': m.endDate || '',
          'Sire ID': sire.id || '',
          'Sire Tag': sire.tag || '',
          'Dam ID': dam.id || '',
          'Dam Tag': dam.tag || '',
          'Litters': littersDisplay,
          'Comment': m.comment || ''
        };
      });
      const wsMatings = XLSX.utils.json_to_sheet(matingsRows);
      XLSX.utils.book_append_sheet(wb, wsMatings, "Matings");

      // 4. Litters Sheet
      const littersRows = (data.litters || []).map(l => {
        const m = data.matings?.find(x => x.id === l.matingId);
        const targetCageTag = l.cageTag || m?.cageTag;
        const cage = data.cages?.find(c => c.tag === targetCageTag);
        const roomObj = cage ? data.rooms?.find(r => r.name === cage.room) : null;
        const displayRoom = roomObj?.roomName || (cage?.room?.includes('/') ? cage.room.split('/')[0] : cage?.room) || '-';
        const displayRack = (cage?.room?.includes('/') ? cage.room.split('/')[1] : (roomObj?.roomName ? roomObj.name : '')) || '-';

        const sire = m ? getMouseInfo(m.sireId) : { id: '', tag: '' };
        const dam = m ? getMouseInfo(m.damId) : { id: '', tag: '' };
        const pups = data.mice?.filter(mouse => mouse.litterId === l.id) || [];

        return {
          'Litter ID': l.id,
          'Mating ID': l.matingId || '',
          'Line': l.line || m?.line || '',
          'Room': displayRoom,
          'Rack': displayRack,
          'Location (Cage)': targetCageTag || '-',
          'Status': l.status || 'Active',
          'DOB': l.dob || '',
          'Scheduled Wean Date': getScheduledWeanDate(l.dob),
          'End Date (Weaned)': l.endDate || '',
          'Total Count': parseInt(l.count, 10) || pups.length,
          'Registered Mice Count': pups.length,
          'Sire ID': sire.id || '',
          'Sire Tag': sire.tag || '',
          'Dam ID': dam.id || '',
          'Dam Tag': dam.tag || '',
          'Comment': l.comment || ''
        };
      });
      const wsLitters = XLSX.utils.json_to_sheet(littersRows);
      XLSX.utils.book_append_sheet(wb, wsLitters, "Litters");

      // 5. Rooms Sheet
      const roomsRows = (data.rooms || []).map(r => ({
        'Room / Rack Name': r.name || '',
        'Display Room': r.roomName || (r.name?.includes('/') ? r.name.split('/')[0] : r.name) || '',
        'Display Rack': (r.name?.includes('/') ? r.name.split('/')[1] : (r.roomName ? r.name : '')) || '',
        'Rows': r.rows || 5,
        'Cols': r.cols || 8
      }));
      const wsRooms = XLSX.utils.json_to_sheet(roomsRows);
      XLSX.utils.book_append_sheet(wb, wsRooms, "Rooms");

      // 6. Mouselines Sheet
      if (data.mouselines && data.mouselines.length > 0) {
        const mouselinesRows = data.mouselines.map(ml => ({
          'Line Name': ml.name || '',
          'Description': ml.description || '',
          'Genotypes': Array.isArray(ml.genotypes) ? ml.genotypes.join(', ') : (ml.genotypes || '')
        }));
        const wsLines = XLSX.utils.json_to_sheet(mouselinesRows);
        XLSX.utils.book_append_sheet(wb, wsLines, "Mouselines");
      }

      // Safe browser download via Blob
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

      const now = new Date();
      const dateStr = now.getFullYear().toString() + 
                      (now.getMonth() + 1).toString().padStart(2, '0') + 
                      now.getDate().toString().padStart(2, '0');
      const timeStr = now.getHours().toString().padStart(2, '0') + 
                      now.getMinutes().toString().padStart(2, '0');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ColonyFlow_All_Data_${dateStr}-${timeStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export Excel:', e);
      alert('Failed to export Excel file. Please try again.');
    }
  };

  const [isSelectingFolder, setIsSelectingFolder] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const json = await res.json();
      setProjects(json.projects || []);
      setActiveProject(json.activeProject || 'default');
      setDataRoot(json.dataRoot || '');
    } catch (err) {
      console.error('Project fetch error:', err);
    }
  };

  const handleSwitchProject = async (projectName) => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName })
      });
      const result = await res.json();
      if (result.success) {
        setActiveProject(projectName);
        setShowProjectMenu(false);
        await fetchData(); // Reload data for the new project
      }
    } catch (e) {
      console.error(e);
      alert('Failed to switch project');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateProject = async () => {
    const name = prompt('Enter new project name (alphanumeric only):');
    if (!name) return;
    const sanitized = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    if (sanitized) {
      await handleSwitchProject(sanitized);
      await fetchProjects();
    }
  };

  const handleRenameProject = async (oldName) => {
    const newName = prompt('Enter new project name:', oldName);
    if (!newName || newName === oldName) return;
    const sanitized = newName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName, newName: sanitized })
      });
      const result = await res.json();
      if (result.success) {
        if (activeProject === oldName) setActiveProject(sanitized);
        await fetchProjects();
      } else {
        alert(result.error);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to rename project');
    }
  };

  const handleDeleteProject = async (projectName) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"? This will delete all data and backups.`)) return;
    
    try {
      const res = await fetch(`/api/projects?projectName=${projectName}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.success) {
        if (activeProject === projectName) {
          setActiveProject('default'); // Fallback in state, API will handle finding next available
          await fetchData();
        }
        await fetchProjects();
      } else {
        alert(result.error);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to delete project');
    }
  };

  const handleSetCustomDataRoot = async () => {
    const newPath = prompt('Enter absolute path for data storage (e.g. /Users/name/Dropbox/ColonyFlow):', dataRoot);
    if (newPath === null) return; // Cancel
    
    // If empty, reset to default
    const finalPath = newPath.trim() === '' ? null : newPath.trim();
    
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customDataRoot: finalPath })
      });
      const result = await res.json();
      if (result.success) {
        await fetchProjects();
        await fetchData();
      } else {
        alert(result.error);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update storage path');
    }
  };

  const handleUpdateSettings = async (updates) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'settings', action: 'updateSettings', item: updates })
      });
      const result = await res.json();
      if (result.success) {
        await fetchData();
      } else {
        alert(result.error);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update settings');
    }
  };

  const handleSelectFolderMac = async () => {
    if (isSelectingFolder) return;
    setIsSelectingFolder(true);
    try {
      const folderRes = await fetch('/api/select-folder');
      const folderResult = await folderRes.json();
      
      if (folderResult.success && folderResult.path) {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customDataRoot: folderResult.path })
        });
        const result = await res.json();
        if (result.success) {
          await fetchProjects();
          await fetchData();
        } else {
          alert(result.error);
        }
      } else if (folderResult.error && folderResult.error !== 'User canceled' && folderResult.error !== 'No folder selected') {
        alert(folderResult.error);
      }
    } catch (e) {
      console.error(e);
      alert('Local storage path update failed. If this is Mac, please ensure Terminal has Automation permissions.');
    } finally {
      setIsSelectingFolder(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchProjects();
  }, []);

  const [returnToHomeOnClose, setReturnToHomeOnClose] = useState(false);

  const handleSelectRecord = (type, id) => {
    setSelection({ type, id });
    setReturnToHomeOnClose(activeTab === 'home');
    setActiveTab('manage');
  };

  const handleOpenPedigree = (mouseId) => {
    setPedigreeMouseId(mouseId || '');
    setActiveTab('tracking');
  };
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <PupAnimalIcon size={56} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
          <div>
            <h1>ColonyFlow</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {(() => {
                const isNotLive = (status) => ['Dead', 'Dead/Culled', 'Euthanasia', 'Tissue Collection', 'Terminated', 'Missing', 'Transferred', 'Inactive'].includes(status);
                const liveMice = data.mice?.filter(m => !isNotLive(m.status)) || [];
                const liveCagesCount = new Set(liveMice.filter(m => m.cageTag && m.cageTag !== 'nan').map(m => (m._roomSearch || 'default') + '|' + m.cageTag)).size;
                return (
                  <>
                    Tracking <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>{liveMice.length}</span> live mice across <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{liveCagesCount}</span> cages
                  </>
                );
              })()}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          {/* Unified Master Board - WIDER VERSION */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            background: 'var(--glass)', 
            borderRadius: '14px', 
            border: '1px solid var(--glass-border)',
            padding: '4px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            position: 'relative',
            zIndex: 5100,
            gap: '2px',
            minWidth: '425px' // Final adjustment to 425px
          }}>
            {/* Row 1: Project & Storage Actions */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '1px',
              background: 'rgba(var(--accent-rgb), 0.03)',
              borderRadius: '8px'
            }}>
              {/* Project Mini Switcher */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '0.25rem 0.8rem', 
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
                  background: showProjectMenu ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
                  flex: '0 0 160px'
                }}
                onClick={() => setShowProjectMenu(!showProjectMenu)}
              >
                <div style={{ background: 'var(--accent-primary)', padding: '4px', borderRadius: '5px', display: 'flex' }}>
                  <Database size={11} color="white" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeProject}</span>
                  <ChevronRight size={10} style={{ transform: showProjectMenu ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', opacity: 0.5 }} />
                </div>

                {showProjectMenu && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: '0', 
                    width: '100%', 
                    background: theme === 'dark' ? '#1c1c1e' : '#ffffff', 
                    border: '1px solid var(--card-border)', 
                    borderRadius: '12px', 
                    boxShadow: '0 12px 36px rgba(0,0,0,0.22), 0 0 0 1px var(--card-border)', 
                    zIndex: 9999,
                    padding: '0.5rem',
                    backdropFilter: 'blur(15px)',
                    marginTop: '4px'
                  }}>
                    <div style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.4rem', pointerEvents: 'none' }}>
                      <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Database Store</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-main)', opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'monospace' }}>
                        {dataRoot || '/Internal/App/Storage'}
                      </div>
                    </div>
                    {projects.map(p => (
                      <div
                        key={p}
                        onClick={(e) => { e.stopPropagation(); handleSwitchProject(p); }}
                        style={{ 
                          width: '100%', 
                          textAlign: 'left', 
                          padding: '0.5rem 0.6rem', 
                          borderRadius: '6px', 
                          background: p === activeProject ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
                          color: p === activeProject ? 'var(--accent-primary)' : 'var(--text-main)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '2px'
                        }}
                      >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0px', overflow: 'hidden' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: p === activeProject ? 800 : 500, lineHeight: 1.2 }}>{p}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '4px', opacity: 0.6 }}>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleRenameProject(p); }}
                              style={{ background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer', borderRadius: '4px', display: 'flex', color: 'var(--text-muted)' }}
                              onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                              <Pencil size={12} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteProject(p); }}
                              style={{ background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer', borderRadius: '4px', display: 'flex', color: 'var(--text-muted)' }}
                              onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCreateProject(); }}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'var(--accent-primary)', color: 'white', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                      >+ New Project</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'flex-end', paddingRight: '8px' }}>
                <button 
                  onClick={handleCreateBackup}
                  style={{ background: 'transparent', border: 'none', padding: '0.25rem 0.8rem', borderRadius: '5px', cursor: 'pointer', color: 'var(--text-main)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1 }}>Backup</span>
                    {lastBackupTime && <span style={{ fontSize: '0.65rem', opacity: 0.4, fontWeight: 500 }}>{lastBackupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                  </div>
                </button>

                <button 
                  onClick={fetchData}
                  style={{ background: 'transparent', border: 'none', padding: '0.25rem 0.6rem', borderRadius: '5px', cursor: 'pointer', color: 'var(--text-main)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RefreshCw size={10} className={isSyncing ? 'animate-spin' : ''} /> Sync
                    </span>
                    {data.lastModified && <span style={{ fontSize: '0.65rem', opacity: 0.4, fontWeight: 500 }}>{new Date(data.lastModified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                  </div>
                </button>

                <button 
                  onClick={() => setShowSettings(true)}
                  style={{ background: 'transparent', border: 'none', padding: '0.25rem 0.6rem', borderRadius: '5px', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Settings"
                >
                  <Settings size={11} style={{ opacity: 0.7 }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1 }}>Settings</span>
                </button>
              </div>
            </div>

            {/* Row 2: Main Navigation */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.04)', padding: '3px', borderRadius: '9px', gap: '2px', position: 'relative' }}>
              {[
                { id: 'home', label: 'Dashboard' },
                { id: 'manage', label: 'Manage' },
                { id: 'summary', label: 'Summary' },
                { id: 'timeline', label: 'Timeline' },
                { id: 'cages', label: 'Location' },
                { id: 'tracking', label: 'Pedigree' }
              ].map(tab => {
                if (tab.id === 'manage') {
                  return (
                    <div key={tab.id} style={{ position: 'relative', flex: 1, display: 'flex' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowManageMenu(!showManageMenu);
                        }}
                        style={{
                          padding: '0.35rem 0.6rem',
                          borderRadius: '7px',
                          border: 'none',
                          background: activeTab === 'manage' ? 'var(--accent-primary)' : 'transparent',
                          color: activeTab === 'manage' ? 'white' : 'var(--text-muted)',
                          fontWeight: activeTab === 'manage' ? 700 : 500,
                          boxShadow: activeTab === 'manage' ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '3px',
                          transition: 'all 0.15s ease-out',
                          lineHeight: 1
                        }}
                      >
                        <span>Manage</span>
                        <ChevronDown 
                          size={11} 
                          style={{ 
                            transform: showManageMenu ? 'rotate(180deg)' : 'rotate(0deg)', 
                            transition: 'transform 0.2s',
                            opacity: activeTab === 'manage' ? 0.9 : 0.6
                          }} 
                        />
                      </button>

                      {showManageMenu && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            minWidth: '175px',
                            background: theme === 'dark' ? '#1c1c1e' : '#ffffff',
                            border: '1px solid var(--card-border)',
                            borderRadius: '12px',
                            boxShadow: '0 12px 36px rgba(0,0,0,0.22), 0 0 0 1px var(--card-border)',
                            zIndex: 9999,
                            padding: '0.4rem',
                            backdropFilter: 'blur(20px)',
                            marginTop: '6px'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {[
                            { id: 'mice', label: 'Mice', icon: <MouseAnimalIcon size={18} /> },
                            { id: 'cages', label: 'Cages', icon: <Box size={13} /> },
                            { id: 'matings', label: 'Matings', icon: <Heart size={13} /> },
                            { id: 'litters', label: 'Litters', icon: <PupAnimalIcon size={13} /> },
                            { id: 'rooms', label: 'Rooms & Racks', icon: <MapPin size={13} /> },
                            { id: 'strains', label: 'Mouseline', icon: <ChevronRight size={13} /> }
                          ].map(sub => {
                            const isSelected = activeTab === 'manage' && manageSubTab === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setManageSubTab(sub.id);
                                  setActiveTab('manage');
                                  setShowManageMenu(false);
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '0.45rem 0.6rem',
                                  borderRadius: '6px',
                                  border: 'none',
                                  background: isSelected ? 'rgba(var(--accent-rgb, 79, 70, 229), 0.12)' : 'transparent',
                                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-main)',
                                  fontWeight: isSelected ? 800 : 500,
                                  fontSize: '0.78rem',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  transition: 'all 0.15s',
                                  marginBottom: '1px'
                                }}
                                onMouseOver={(e) => {
                                  if (!isSelected) e.currentTarget.style.background = 'rgba(var(--accent-rgb, 79, 70, 229), 0.06)';
                                }}
                                onMouseOut={(e) => {
                                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                <span style={{ display: 'flex', alignItems: 'center', color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                                  {sub.icon}
                                </span>
                                <span style={{ flex: 1 }}>{sub.label}</span>
                                {isSelected && (
                                  <span style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: 800 }}>●</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '0.35rem 0.6rem',
                      borderRadius: '7px',
                      border: 'none',
                      background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                      color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                      fontWeight: activeTab === tab.id ? 700 : 500,
                      boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      flex: 1,
                      transition: 'all 0.15s ease-out',
                      lineHeight: 1
                    }}
                  >{tab.label}</button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {isInitialLoad ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: '50vh', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Initializing system...
        </div>
      ) : (
        <div className="content-area" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
              <div className="dashboard-grid">
                <Calendar data={data} onSelect={handleSelectRecord} />
                <TodoList data={data} onUpdate={fetchData} onSelect={handleSelectRecord} />
              </div>
              <div className="card" style={{ flex: 1 }}>
                 <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-primary)' }}>
                      <Pencil size={18} /> 
                      <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Dashboard Notes</span>
                    </div>
                    {localNotes !== (data.settings?.dashboardNotes || '') && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', opacity: 0.7 }}>
                        Saving...
                      </div>
                    )}
                 </div>
                 <textarea
                    style={{
                      width: '100%',
                      minHeight: '200px',
                      padding: '1.2rem',
                      borderRadius: '14px',
                      border: '1px solid var(--card-border)',
                      background: 'var(--background)',
                      color: 'var(--text-main)',
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    placeholder="Write your notes here. They will be saved automatically..."
                 />
              </div>
            </div>
          )}
          {activeTab === 'tracking' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <PedigreeView data={data} onSelect={handleSelectRecord} initialMouseId={pedigreeMouseId} />
            </div>
          )}
          {activeTab === 'timeline' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <TimelineView data={data} onSelect={handleSelectRecord} />
            </div>
          )}
          {activeTab === 'cages' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <CageGrid data={data} onSelect={handleSelectRecord} />
            </div>
          )}
          {activeTab === 'summary' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <ManagementView
                data={data}
                onUpdate={fetchData}
                initialSubTab="summary"
                onClearSelection={() => setSelection(null)}
                onOpenSettings={() => setShowSettings(true)}
              />
            </div>
          )}
          {activeTab === 'manage' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <ManagementView
                data={data}
                onUpdate={fetchData}
                initialSubTab={manageSubTab}
                onSubTabChange={(sub) => setManageSubTab(sub)}
                initialSelection={selection}
                onClearSelection={() => setSelection(null)}
                onOpenSettings={() => setShowSettings(true)}
                onOpenPedigree={handleOpenPedigree}
                onCloseModal={() => {
                  if (returnToHomeOnClose) {
                    setActiveTab('home');
                    setReturnToHomeOnClose(false);
                  }
                }}
              />
            </div>
          )}
        </div>
      )}

      <footer style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>ColonyFlow</span>
            <span>v2.03</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>© 2026</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setShowChangelog(true)} 
              className="btn btn-ghost" 
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', height: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RefreshCw size={12} /> Changelog
            </button>
            <button 
              onClick={() => setShowHelp(true)} 
              className="btn btn-ghost" 
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', height: 'auto', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}
            >
              <HelpCircle size={12} /> Help
            </button>
          </div>
        </div>
      </footer>

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)} style={{ zIndex: 12000 }}>
          <div style={{ position: 'relative', width: '90%', maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{ maxWidth: '100%', padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid var(--card-border)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="mac-traffic-close"
                    title="Close"
                  >
                    <X size={8} strokeWidth={3} />
                  </button>
                  <div className="modal-title" style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Global Settings</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0.5rem 0', maxHeight: '70vh', overflowY: 'auto' }}>
                
                {/* Appearance / Theme */}
                <div className="form-group">
                  <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />} Appearance
                  </label>
                  <div style={{ 
                    background: 'var(--background)', 
                    padding: '0.85rem 1rem', 
                    borderRadius: '12px', 
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        Interface Theme
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Select light or dark appearance for the application
                      </div>
                    </div>
                    {/* Apple-style Segmented Control */}
                    <div style={{ 
                      display: 'flex', 
                      background: 'rgba(0,0,0,0.06)', 
                      padding: '3px', 
                      borderRadius: '8px', 
                      gap: '3px' 
                    }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (theme !== 'light') toggleTheme();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '0.35rem 0.8rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: theme === 'light' ? 'var(--card-bg)' : 'transparent',
                          color: theme === 'light' ? 'var(--text-main)' : 'var(--text-muted)',
                          boxShadow: theme === 'light' ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                          fontWeight: theme === 'light' ? 700 : 500,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Sun size={13} style={{ color: theme === 'light' ? '#f59e0b' : 'currentColor' }} />
                        <span>Light</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (theme !== 'dark') toggleTheme();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '0.35rem 0.8rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: theme === 'dark' ? 'var(--card-bg)' : 'transparent',
                          color: theme === 'dark' ? 'var(--text-main)' : 'var(--text-muted)',
                          boxShadow: theme === 'dark' ? '0 1px 3px rgba(0,0,0,0.25)' : 'none',
                          fontWeight: theme === 'dark' ? 700 : 500,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Moon size={13} style={{ color: theme === 'dark' ? '#818cf8' : 'currentColor' }} />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Folder size={14} /> Data Storage Location
                  </label>
                  <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', wordBreak: 'break-all', opacity: 0.8, fontFamily: 'monospace' }}>
                      {dataRoot || 'Default (Internal)'}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={handleSelectFolderMac}
                        disabled={isSelectingFolder}
                        className="btn"
                        style={{ flex: 1, fontSize: '0.75rem', background: 'var(--accent-primary)', color: 'white', border: 'none' }}
                      >
                        <Folder size={14} /> {isSelectingFolder ? 'Selecting...' : 'Select via Finder'}
                      </button>
                      <button 
                        onClick={handleSetCustomDataRoot}
                        className="btn btn-ghost"
                        style={{ flex: 1, fontSize: '0.75rem', border: '1px solid var(--glass-border)' }}
                      >
                        <Pencil size={14} /> Manual Path
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Database size={14} /> Cage Tag Display
                  </label>
                  <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <select 
                      className="form-control" 
                      value={data.settings?.cageDisplayMode || 'tag'} 
                      onChange={(e) => handleUpdateSettings({ cageDisplayMode: e.target.value })}
                    >
                      <option value="tag">Cage (e.g. B-1)</option>
                      <option value="rack-tag">Rack-Cage (e.g. 2-B-1)</option>
                      <option value="full">Room_Rack-Cage (e.g. 305A_2-B-1)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Box size={14} /> Max Mice Per Cage
                  </label>
                  <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem' }}>Capacity Limit</span>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Exceeding cages are flagged in Location view</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={data.settings?.maxMicePerCage || 5}
                          onBlur={(e) => handleUpdateSettings({ maxMicePerCage: parseInt(e.target.value, 10) || 5 })}
                          style={{ width: '80px', textAlign: 'center' }}
                          min="1"
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>mice</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Date Display Format</label>
                  <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <select 
                      className="form-control" 
                      value={data.settings?.displayDateFormat || 'YYYY-MM-DD'} 
                      onChange={(e) => handleUpdateSettings({ displayDateFormat: e.target.value })}
                    >
                      <option value="YYYY-MM-DD">YYYY-MM-DD (Default)</option>
                      <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YY/MM/DD">YY/MM/DD</option>
                      <option value="MM/DD/YY">MM/DD/YY</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Baby size={14} /> Breeding Parameters
                  </label>
                  <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem' }}>Birth Check Days</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="number"
                            className="form-control"
                            defaultValue={data.settings?.birthCheckDays || 20}
                            onBlur={(e) => handleUpdateSettings({ birthCheckDays: parseInt(e.target.value, 10) || 20 })}
                            style={{ width: '80px', textAlign: 'center' }}
                          />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>days</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem' }}>Weaning Days</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="number"
                            className="form-control"
                            defaultValue={data.settings?.weaningDays || 21}
                            onBlur={(e) => handleUpdateSettings({ weaningDays: parseInt(e.target.value, 10) || 21 })}
                            style={{ width: '80px', textAlign: 'center' }}
                          />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>days</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Printer size={14} /> Cage Label Printing
                  </label>
                  <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>Width (cm)</label>
                        <input 
                          type="number" step="0.1" className="form-control" 
                          defaultValue={data.settings?.labelWidth || 10} 
                          onBlur={(e) => handleUpdateSettings({ labelWidth: parseFloat(e.target.value) || 10 })}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>Height (cm)</label>
                        <input 
                          type="number" step="0.1" className="form-control" 
                          defaultValue={data.settings?.labelHeight || 7} 
                          onBlur={(e) => handleUpdateSettings({ labelHeight: parseFloat(e.target.value) || 7 })}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>User Name</label>
                      <input 
                        type="text" className="form-control" 
                        defaultValue={data.settings?.labelUser || ''} 
                        onBlur={(e) => handleUpdateSettings({ labelUser: e.target.value })}
                        placeholder="e.g. Yamada"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>Lab / Department</label>
                      <input 
                        type="text" className="form-control" 
                        defaultValue={data.settings?.labelLab || ''} 
                        onBlur={(e) => handleUpdateSettings({ labelLab: e.target.value })}
                        placeholder="e.g. Neurogenetics Lab"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>Date Format (DOB)</label>
                      <select 
                        className="form-control" 
                        value={data.settings?.labelDateFormat || 'YYYY/MM/DD'} 
                        onChange={(e) => handleUpdateSettings({ labelDateFormat: e.target.value })}
                      >
                        <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YY/MM/DD">YY/MM/DD</option>
                        <option value="MM/DD/YY">MM/DD/YY</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px solid var(--card-border)' }}>
                <button onClick={() => setShowSettings(false)} className="btn btn-primary" style={{ padding: '0.45rem 1.4rem', fontSize: '0.82rem', fontWeight: 600 }}>Done</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
          <div style={{ position: 'relative', width: '80vw', maxWidth: '80vw', height: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '1px solid var(--card-border)' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{ padding: '0', overflowY: 'auto', flex: 1, borderRadius: '16px', width: '100%', maxWidth: 'none', height: '100%', maxHeight: 'none', border: 'none' }}>
              {(() => {
                const content = {
                  jp: {
                    title: "Colony OS 使い方ガイド",
                    subtitle: "マウス管理を効率化するための操作マニュアル",
                    sections: [
                      {
                        title: "Dashboard (ホーム)",
                        icon: <LayoutDashboard size={22} />,
                        color: "var(--accent-primary)",
                        content: (
                          <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                            <li style={{ marginBottom: '1rem' }}><strong>Calendar:</strong> 2ヶ月分の予定を一覧表示。項目をクリックすると管理画面の該当レコードにジャンプします。</li>
                            <li style={{ marginBottom: '1rem' }}><strong>Active Task:</strong> 「離乳 (Wean Pups)」「検体回収 (Tissue Collection)」「リマインダーで登録した項目」が自動表示されます。</li>
                            <li><strong>Show History:</strong> 完了済みのタスク履歴を確認できます。</li>
                          </ul>
                        )
                      },
                      {
                        title: "Manage (データ管理)",
                        icon: <Settings size={22} />,
                        color: "#10b981",
                        content: (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p style={{ margin: 0 }}>各マウスやケージ、ラックのデータの追加・編集・削除を行います
                              <br /> 歯車アイコンのDisplay columnsから表示する項目のON/OFFを自由に変更できます。</p>
                            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '0.6rem 1rem', borderRadius: '12px', border: '2px solid #10b981' }}>
                              <h4 style={{ fontSize: '1.1rem', color: '#059669', margin: '0 0 0.5rem 0' }}>基本的な流れ</h4>
                              <ol start="0" style={{ paddingLeft: '1rem', margin: 0 }}>
                                <li><strong>Mouseline:</strong> マウスの系統を登録。表示したいGenotypeも登録。</li>
                                <li><strong>Rooms &amp; Racks:</strong> 部屋とラックのレイアウトを登録。</li>
                                <li><strong>Mice:</strong> 個体情報を登録し、系統やケージを割り当て。</li>
                                <li><strong>Matings:</strong> マウスを選択して交配(Mating)。</li>
                                <li><strong>Litters:</strong> 産まれた仔を登録し、離乳(Wean)。その時に仔のID/Tagを登録します。
                                  <br />「&gt;」を開くと仔の個別管理（ID付与、性別など）ができます。</li>
                                <li><strong>Cages:</strong> 現在のマウスのケージとマウスを確認・編集します。</li>
                              </ol>
                            </div>

                            <div style={{ paddingLeft: '0.5rem' }}>
                              <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem' }}>💡 便利な機能</h4>
                              <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                                <li style={{ marginBottom: '0.6rem' }}><strong>Summary:</strong> 各マウスの系統やステータスごとの統計グラフと、抽出したデータの表を確認できます。（各種表ヘッダーで並び替え可能）</li>
                                <li style={{ marginBottom: '0.6rem' }}><strong>Bulk Actions:</strong> 複数のマウスを選択して、一括でケージ移動やステータス変更が可能。</li>
                                <li><strong>Auto Transition:</strong> 離乳(Wean)実行後、1週間は「Weaning」となり、その後自動的に「Stock」へ移行します。</li>
                              </ul>
                            </div>
                          </div>
                        )
                      },
                      {
                        title: "データ移行 (Import CSV / Export xlsx)",
                        icon: <Upload size={22} />,
                        color: "#ef4444",
                        content: (
                          <div style={{ paddingLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                              <p style={{ margin: '0 0 1rem 0' }}>
                                <strong>Import CSV:</strong> 既存のExcelデータを簡単に一括インポートできる専用ツールがあります。
                              </p>
                              <a
                                href="https://import-colonyflow.vercel.app"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: 'inline-block',
                                  padding: '0.6rem 1.2rem',
                                  background: '#fee2e2',
                                  color: '#b91c1c',
                                  borderRadius: '8px',
                                  textDecoration: 'none',
                                  fontWeight: 600,
                                  fontSize: '1rem'
                                }}
                              >
                                Import Tool を開く →
                              </a>
                            </div>

                            <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
                              <p style={{ margin: '0 0 1rem 0' }}>
                                <strong>Export xlsx:</strong> 登録されている全コロニーデータ（Mice, Cages, Matings, Litters, Rooms, Mouselines）を 1 つの Excel ファイル（.xlsx）として一括出力・保存します。
                              </p>
                              <button
                                type="button"
                                onClick={handleExportAllExcel}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '0.65rem 1.4rem',
                                  borderRadius: '8px',
                                  fontWeight: 600,
                                  fontSize: '1rem',
                                  background: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
                                }}
                              >
                                <FileSpreadsheet size={20} />
                                全データをExcelで一括エクスポート (.xlsx)
                              </button>
                            </div>
                          </div>
                        )
                      },
                      {
                        title: "Location (実配置)",
                        icon: <MapPin size={22} />,
                        color: "#f59e0b",
                        content: (
                          <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                            <li><strong>Occupancy:</strong> 色で性別(<span style={{ color: '#3b82f6', fontWeight: 700 }}>♂</span>, <span style={{ color: '#ec4899', fontWeight: 700 }}>♀</span>)、形で世代(■:親, ●:仔)を表示します。</li>
                          </ul>
                        )
                      },
                      {
                        title: "Pedigree (家系図)",
                        icon: <Search size={22} />,
                        color: "#8b5cf6",
                        content: (
                          <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                            <li style={{ marginBottom: '1rem' }}><strong>Lineage Tree:</strong> 選択したマウスの親(Sire/Dam)、祖父母、仔、またそのマウスのlitterを可視化。</li>
                            <li><strong>Navigation:</strong> 家系図内の各ノードをクリックすることで、さらに過去の世代へ遡ることもできます。</li>
                          </ul>
                        )
                      }
                    ],
                    tipTitle: "データの保存について",
                    tipBody: "編集内容は自動的にdata/db.jsonへ保存されます。バックアップはこのdb.jsonをコピーして下さい。",
                    close: "ガイドを閉じる"
                  },
                  en: {
                    title: "Colony OS Guide",
                    subtitle: "Standard operating procedures for the system",
                    sections: [
                      {
                        title: "Dashboard",
                        icon: <LayoutDashboard size={22} />,
                        color: "var(--accent-primary)",
                        content: (
                          <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                            <li style={{ marginBottom: '1rem' }}><strong>Calendar:</strong> 2-month view for upcoming tasks. Click items to jump to management.</li>
                            <li style={{ marginBottom: '1rem' }}><strong>Active Tasks:</strong> Automated alerts for Weaning, Tissue Collection, and custom reminders.</li>
                            <li><strong>Show History:</strong> View history of completed tasks.</li>
                          </ul>
                        )
                      },
                      {
                        title: "Manage",
                        icon: <Settings size={22} />,
                        color: "#10b981",
                        content: (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p style={{ margin: 0 }}>Add, edit, or delete data for mice, cages, and racks.
                              <br /> Use "Display columns" in the gear icon to toggle visible fields.</p>
                            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '0.6rem 1rem', borderRadius: '12px', border: '2px solid #10b981' }}>
                              <h4 style={{ fontSize: '1.1rem', color: '#059669', margin: '0 0 0.5rem 0' }}>Typical Workflow</h4>
                              <ol start="0" style={{ paddingLeft: '1rem', margin: 0 }}>
                                <li><strong>Mouseline:</strong> Register mouse strains and define predefined genotypes.</li>
                                <li><strong>Rooms &amp; Racks:</strong> Register physical layouts.</li>
                                <li><strong>Mice:</strong> Register individuals and assign to strains/cages.</li>
                                <li><strong>Matings:</strong> Set up mating pairs.</li>
                                <li><strong>Litters:</strong> Track newborns until weaning, where you assign IDs/Tags.
                                  <br />Expand "&gt;" to manage individual pups (ID, Sex, Genotype).</li>
                                <li><strong>Cages:</strong> View and manage mice currently in cages.</li>
                              </ol>
                            </div>

                            <div style={{ paddingLeft: '0.5rem' }}>
                              <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem' }}>💡 Features</h4>
                              <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                                <li style={{ marginBottom: '0.6rem' }}><strong>Summary:</strong> View graphical statistics and a sortable table of mice filtered by strain and status.</li>
                                <li style={{ marginBottom: '0.6rem' }}><strong>Bulk Actions:</strong> Move multiple mice or update status in one go.</li>
                                <li><strong>Auto Lifecycle:</strong> Weaned litters stay in "Weaning" for 7 days before moving to "Stock".</li>
                              </ul>
                            </div>
                          </div>
                        )
                      },
                      {
                        title: "Import CSV / Export xlsx",
                        icon: <Upload size={22} />,
                        color: "#ef4444",
                        content: (
                          <div style={{ paddingLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                              <p style={{ margin: '0 0 1rem 0' }}>
                                <strong>Import CSV:</strong> You can easily bulk import your existing Excel data using our dedicated tool.
                              </p>
                              <a
                                href="https://import-colonyflow.vercel.app"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: 'inline-block',
                                  padding: '0.6rem 1.2rem',
                                  background: '#fee2e2',
                                  color: '#b91c1c',
                                  borderRadius: '8px',
                                  textDecoration: 'none',
                                  fontWeight: 600,
                                  fontSize: '1rem'
                                }}
                              >
                                Open Import Tool →
                              </a>
                            </div>

                            <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
                              <p style={{ margin: '0 0 1rem 0' }}>
                                <strong>Export xlsx:</strong> Download all registered colony data (Mice, Cages, Matings, Litters, Rooms, Mouselines) as a single Excel workbook (.xlsx).
                              </p>
                              <button
                                type="button"
                                onClick={handleExportAllExcel}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '0.65rem 1.4rem',
                                  borderRadius: '8px',
                                  fontWeight: 600,
                                  fontSize: '1rem',
                                  background: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
                                }}
                              >
                                <FileSpreadsheet size={20} />
                                Export All to Excel (.xlsx)
                              </button>
                            </div>
                          </div>
                        )
                      },
                      {
                        title: "Location",
                        icon: <MapPin size={22} />,
                        color: "#f59e0b",
                        content: (
                          <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                            <li><strong>Occupancy:</strong> Colors denote sex (<span style={{ color: '#3b82f6', fontWeight: 700 }}>♂</span>, <span style={{ color: '#ec4899', fontWeight: 700 }}>♀</span>) and shapes denote generation (■:Parent, ●:Pup).</li>
                          </ul>
                        )
                      },
                      {
                        title: "Pedigree",
                        icon: <Search size={22} />,
                        color: "#8b5cf6",
                        content: (
                          <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                            <li style={{ marginBottom: '1rem' }}><strong>Lineage Tree:</strong> Visualize parents (Sire/Dam), grandparents, offspring, and the mouse's litter.</li>
                            <li><strong>Navigation:</strong> Click any card in the tree to explore further back in the lineage.</li>
                          </ul>
                        )
                      }
                    ],
                    tipTitle: "Data Backup",
                    tipBody: "Changes are automatically saved to data/db.json. To backup your data, simply make a copy of this db.json file.",
                    close: "Close Guide"
                  }
                };
                const c = content[helpLang];
                return (
                  <>
                    <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', padding: '1.5rem 2rem 2rem 2rem', color: 'white', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                        <button
                          onClick={() => setShowHelp(false)}
                          className="mac-traffic-close"
                          title="Close"
                          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
                        >
                          <X size={8} strokeWidth={3} />
                        </button>
                        <div style={{ display: 'flex', gap: '3px', background: 'rgba(255,255,255,0.2)', padding: '3px', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                          <button onClick={() => setHelpLang('jp')} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, border: 'none', background: helpLang === 'jp' ? 'white' : 'transparent', color: helpLang === 'jp' ? 'var(--accent-primary)' : 'white', cursor: 'pointer', transition: 'all 0.15s' }}>JP</button>
                          <button onClick={() => setHelpLang('en')} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, border: 'none', background: helpLang === 'en' ? 'white' : 'transparent', color: helpLang === 'en' ? 'var(--accent-primary)' : 'white', cursor: 'pointer', transition: 'all 0.15s' }}>EN</button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                        <Info size={26} />
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'white' }}>{c.title}</h2>
                      </div>
                      <p style={{ opacity: 0.9, fontSize: '1rem', margin: 0 }}>{c.subtitle}</p>
                    </div>

                    <div style={{ padding: '4rem 5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', maxWidth: '800px', margin: '0 auto' }}>
                        {c.sections.map((sec, i) => (
                          <section key={i} style={{
                            borderBottom: i === c.sections.length - 1 ? 'none' : '1px solid var(--glass-border)',
                            paddingBottom: '5rem'
                          }}>
                            <h3 style={{
                              fontSize: '2rem',
                              fontWeight: 900,
                              color: 'var(--text-main)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem',
                              margin: '0 0 2rem 0',
                              borderLeft: `8px solid ${sec.color}`,
                              paddingLeft: '1.5rem',
                              letterSpacing: '-0.02em'
                            }}>
                              {sec.icon} {sec.title}
                            </h3>
                            <div style={{
                              fontSize: '1.1rem',
                              lineHeight: '1.9',
                              color: 'var(--text-main)',
                              opacity: 0.95
                            }}>
                              {sec.content}
                            </div>
                          </section>
                        ))}
                      </div>

                      <div style={{
                        marginTop: '2rem',
                        padding: '2.5rem',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                        borderRadius: '24px',
                        border: '1px solid var(--glass-border)',
                        maxWidth: '800px',
                        margin: '5rem auto 0 auto',
                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
                      }}>
                        <h4 style={{
                          color: 'var(--accent-primary)',
                          fontSize: '1.3rem',
                          fontWeight: 900,
                          marginBottom: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          margin: '0 0 1rem 0'
                        }}>
                          <Info size={24} /> {c.tipTitle}
                        </h4>
                        <p style={{
                          fontSize: '1.05rem',
                          color: 'var(--text-main)',
                          margin: 0,
                          lineHeight: '1.7',
                          opacity: 0.9
                        }}>{c.tipBody}</p>
                      </div>

                      <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center' }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => setShowHelp(false)}
                          style={{
                            padding: '1.2rem 5rem',
                            borderRadius: '18px',
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            boxShadow: '0 12px 32px rgba(var(--accent-rgb), 0.3)',
                            transform: 'translateY(0)',
                            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                          }}
                        >
                          {c.close}
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {showChangelog && (
        <div className="modal-overlay" onClick={() => setShowChangelog(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
          <div style={{ position: 'relative', width: '90%', maxWidth: '620px', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{ maxWidth: '100%', width: '100%', padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid var(--card-border)', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <button
                    onClick={() => setShowChangelog(false)}
                    className="mac-traffic-close"
                    title="Close"
                  >
                    <X size={8} strokeWidth={3} />
                  </button>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <RefreshCw size={16} className="text-primary" /> What's New
                  </h2>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.8rem' }}>
              <section>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v2.03</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-10-13</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Unified Vertical Scrolling in Breeding Timeline:</strong> The left list and the Gantt chart now scroll together vertically. The list stays pinned to the left during horizontal scrolling, and the headers stay pinned to the top.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v2.02</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-09-23</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Quick &quot;Add Mating&quot; from Mice Table:</strong> Select a male (♂) and female (♀) directly in the Mice list to launch the Add Mating modal with Sire, Dam, Mouseline, Start Date, and Dam&apos;s cage pre-filled. Displays a highlighted &quot;♂Tag × ♀Tag&quot; badge when a valid pair is selected.</li>
                    <li><strong>Enhanced Parent Selection in Add Mating:</strong> Displays cage location numbers directly in the Sire/Dam dropdown lists with real-time searching by ID, Tag, or Cage. Candidate lists are now filtered to only include available parent candidates (Stock and Mating statuses), preventing unintended selection of experimental or nursing mice.</li>
                    <li><strong>Improved Cage Status Visibility in Location View:</strong> Experiment cages now feature a distinct purple border (2px) and subtle purple tint, ensuring immediate visual contrast on the rack grid. Pregnant cages are updated with an olive green border (matching Nursing) and transparent background. Status legend order updated to Mating → Pregnant → Nursing.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v2.0.1</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-09-12</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Full Colony Data Excel Export (.xlsx):</strong> Added a one-click export feature in the Help modal to download all registered colony data (Mice, Cages, Matings, Litters, Rooms, Mouselines) as a single Excel workbook (.xlsx).</li>
                    <li><strong>Cage Occupant Inspection Popup in Location:</strong> Clicking any cage in the Location view now displays an interactive modal showing comprehensive details of all occupant mice (ID, Tag, Sex, Line, Genotype, Age, Status, and Comments).</li>
                    <li><strong>Unregistered Pups Count Badge in Location:</strong> Cages containing nursing litters with unregistered pups now display a clean badge (e.g. "+8 pups") directly on the rack grid, providing immediate visual headcount.</li>
                    <li><strong>Automatic Parent Status Reversion upon Weaning:</strong> When litters are weaned, parent mice (Sire/Dam) that are no longer part of any other active matings are automatically transitioned from "Mating" back to "Stock" status.</li>
                    <li><strong>Robust Sticky Footer Across All Tabs:</strong> Re-engineered layout containers across all tabs (Mating, Litters, Rooms &amp; Racks, Mouseline, Summary, Pedigree) to ensure the footer consistently anchors to the bottom of the viewport even with sparse records.</li>
                    <li><strong>UI &amp; Navigation Enhancements:</strong> Added a direct shortcut button from the Cage Label Printing modal to Global Settings, unified Help guide typography, and streamlined footer actions.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v2.00</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-09-09</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Apple HIG Design System Renewal:</strong> Completely unified the interface following macOS and iOS Human Interface Guidelines. Features Segmented Controls, subtle elevations, frosted glass surfaces, and standardized 32px toolbars for a cohesive native look and feel.</li>
                    <li><strong>macOS Sheet-Style Modal Windows:</strong> Redesigned all modal popups (Settings, Help, Changelog, Add/Edit forms, Column Selector, Label Printer, Weaning Modal, Pedigree) with native macOS sheet layouts, traffic-light close controls, and clear bottom action bars.</li>
                    <li><strong>Original Biological Mouse Icon & Life-Stage Hierarchy:</strong> Redesigned the adult mouse (Mice) icon with an original minimalist line-art aesthetic harmonized with the pup (Litters) icon. The adult mouse is proportionally sized larger than the pup icon, providing intuitive visual life-stage hierarchy across menus and tabs.</li>
                    <li><strong>Optimized Header Dropdowns:</strong> The "Manage" and "Project" dropdown menus now render above all timeline and calendar elements with high-priority z-indexing, fully opaque backdrop styling, and refined elevation shadows, eliminating background bleed-through.</li>
                    <li><strong>Integrated Appearance Settings:</strong> Relocated the theme toggle from the header bar into the "Settings" modal as a native macOS-style Appearance segmented control (☀️ Light / 🌙 Dark).</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.9.6</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-09-09</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Manage Navigation Dropdown:</strong> The "Manage" navigation tab in the top bar now features an interactive dropdown menu, allowing direct 1-click access to specific views (Mice, Cages, Matings, Litters, Rooms & Racks, Mouseline) from any section of the app.</li>
                    <li><strong>Fixed Header & Table Scrolling:</strong> The record tables in the Management view now scroll within an independent container. Action buttons (Add, Export CSV) and the filter/search toolbar remain permanently pinned at the top while browsing records.</li>
                    <li><strong>Sticky Table Headers:</strong> All table column headers across all management views stay locked to the top during vertical scrolling, ensuring continuous column visibility.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.9.5</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-08-20</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Pedigree Popup in Mouse Edit:</strong> Added a "View Pedigree" button to the Mouse Edit modal. Clicking it opens an inline pedigree popup without navigating away, showing ancestors (grandparents, parents), the target mouse, offspring, and litter siblings. Each node is clickable to navigate the family tree.</li>
                    <li><strong>Sire/Dam Always Visible:</strong> The Sire and Dam dropdowns in the Mouse Edit form now always display the currently saved parent, regardless of their status (e.g., Dead, Inactive). Previously, deceased parents were excluded from the list and appeared blank.</li>
                    <li><strong>Active Mouse Filter in Mating:</strong> The Sire and Dam selection dropdowns in the Add Mating form now exclude mice with terminal statuses (Dead, Inactive, Euthanasia, etc.), showing only active candidates.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.9.4</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-05-21</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Flexible Wean Assignment:</strong> "Wean Litter" action now opens an interactive assignment modal, allowing individual pups to be explicitly assigned to multiple different destination cages.</li>
                    <li><strong>Visual Cage Selection in Weaning:</strong> The new Wean Assignment modal features an interactive graphical rack layout selection UI, consistent with standard cage creation flows.</li>
                    <li><strong>Overdue Task Highlighting:</strong> Overdue active tasks are now visually emphasized with a subtle red background and dashed border instead of red text, improving readability.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.9.3</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-05-11</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Nursing Cage Color:</strong> Cages with nursing litters are now displayed in yellow-green in both the Location view and the Matings table Location column. Works even before "Generate Initial Records" is pressed.</li>
                    <li><strong>Overcapacity Display for Nursing Cages:</strong> Overcrowded cages that contain nursing mice or litters now display a green border and a green warning icon instead of red, to correctly identify expected overcrowding.</li>
                    <li><strong>Litter Auto-Generation Removed:</strong> Creating or editing a Litter no longer auto-generates pup mouse records. Pup records are now only created via the explicit "Generate Initial Records" button in the Litters tab.</li>
                    <li><strong>Litter Delete Button:</strong> Added a delete button (🗑️) to the Litter edit modal, allowing direct deletion of litter records (and associated pup records) from the Mating view.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.9.2</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-04-21</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Matings Location — Dam-Based:</strong> The Location column in Matings now shows the female (dam) cage as the primary location. The male's cage is shown as a sub-note when different.</li>
                    <li><strong>Pup Cage Assignment Fix:</strong> Fixed a bug where pups created from litters were not appearing in Cages/Location views due to missing room assignment data.</li>
                    <li><strong>Dashboard Task Colors:</strong> Active Tasks now use the same color coding as Calendar events (pink for Birth Check, amber for Tissue Collection/Experiment, teal for Health Check).</li>
                    <li><strong>Birth Check Cage Fix:</strong> Birth Check events in both Calendar and Active Tasks now correctly display the dam's cage instead of the mating's cage.</li>
                    <li><strong>Task Card UI:</strong> Improved border visibility on Active Tasks cards and removed the left color bar for a cleaner look.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.9.1</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-04-17</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Paste Fix in Modals:</strong> Fixed an issue where pasting text (Command+V) in comment fields would cause unexpected page navigation. Comment fields now use textarea for multi-line support.</li>
                    <li><strong>Cage Tag Duplication Fix:</strong> Resolved a bug where selecting an existing cage in Mating/Litter/Mice modals would produce duplicated tags (e.g. 305A_2-305A_2-B-1).</li>
                    <li><strong>Location View - Cage Status Colors:</strong> Cages in the Location view are now color-coded by mouse status: amber for Experiment, pink for Mating, and blue for others.</li>
                    <li><strong>Location View - Legend:</strong> Added a visual legend at the top of the Location view showing cage status colors and occupancy marker meanings.</li>
                    <li><strong>Unified Modal Buttons:</strong> Standardized all popup close (×) and save (✓) buttons to a consistent compact circle style with white borders.</li>
                    <li><strong>Max Mice Per Cage Setting:</strong> Added a cage capacity limit setting in Global Settings. Cages exceeding the limit are highlighted in red with a warning icon in the Location view.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.9.0</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-03-31</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Custom Confirmation Modals:</strong> Replaced browser-native <code>confirm()</code> dialogs with styled custom modals for a more integrated look and feel.</li>
                    <li><strong>Improved Weaning Workflow:</strong> Updated the weaning confirmation dialog to show "OK" and "No" buttons instead of "OK" and "Cancel" for clearer navigation.</li>
                    <li><strong>UI Polish:</strong> Enhanced modal transitions and added better visual feedback for destructive actions.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.8.9</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-03-31</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Bug Fix: Duplicate Key Error:</strong> Resolved a React issue where standardization of cage tags caused duplicate keys in dropdown lists and datalists.</li>
                    <li><strong>Bug Fix: Summary Filter:</strong> Fixed the Cage Location filter in the "Filter & Search" tab which was not displaying correctly.</li>
                    <li><strong>Internal Stability:</strong> Improved robust key generation for all locations where Room_Rack-Tag strings are used.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.8.8</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-03-30</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Standardized Location Displays:</strong> Unified cage identification across all views under the "Location" label (formerly "Cage Tag"), supporting customized formats: Cage, Rack-Cage, or Room_Rack-Cage.</li>
                    <li><strong>Discrete Rack Columns:</strong> Restored the "Rack" column in Display Settings, allowing it to be toggled as a separate column alongside Room and Location.</li>
                    <li><strong>Data Integrity in Bulk Moves:</strong> Fixed a critical bug where moving mice via bulk actions (including "New Cage") failed to update the underlying <code>_roomSearch</code> field, ensuring accurate room/rack tracking.</li>
                    <li><strong>Improved Cage Selection:</strong> Refactored the bulk move dropdown to display all cages (including empty ones) in full Room_Rack-Tag format, grouped by room for easier selection.</li>
                    <li><strong>Natural Tag Sorting:</strong> Updated default Mice sort to "Tag (asc)" and improved natural sorting to handle alphanumeric tags like "B-10" after "B-2".</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.8.7</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-03-26</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Dashboard Notes:</strong> Added a persistent "Dashboard Notes" area at the bottom of the Home tab for free-form notes, featuring automatic debounced saving.</li>
                    <li><strong>Mouseline Filtering:</strong> Introduced strain-based filtering to the Mice and Cages tables, allowing for easier navigation of specific breeding lines.</li>
                    <li><strong>Smart Cage Inheritance:</strong> Creating a new mating or litter without a specified cage now automatically inherits the Dam's or Mating's current cage tag.</li>
                    <li><strong>Enhanced Move Confirmation:</strong> The dialog for moving mice to a mating cage now displays comprehensive Room, Rack, and Cage details for clearer confirmation.</li>
                    <li><strong>Safari Date Compatibility:</strong> Optimized date parsing and age calculations to ensure full compatibility with Safari and mobile browsers.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.8.6</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-03-25</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Cage Data Integrity:</strong> Editing a cage's tag now automatically synchronizes and updates the location info across all related Mice, Matings, and Litters.</li>
                    <li><strong>Smart Mating Workflow:</strong> Creating a new mating now prompts to move the Sire and Dam to the mating cage automatically.</li>
                    <li><strong>Auto Mouse Status:</strong> Mice selected for a new mating are automatically updated to "Mating" status; they return to "Stock" when the mating is ended.</li>
                    <li><strong>Customizable Breeding:</strong> Added "Birth Check Days" to Global Settings, allowing users to define the interval from mating start to the first birth check.</li>
                    <li><strong>Context-Aware Calendar:</strong> Birth Checks and Weaning events on the calendar now include Rack-Cage information (e.g., RackA-101) for faster physical tracking.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.8.5</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-03-23</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><strong>Modal Workflow Improvement:</strong> Closing or canceling an edit modal opened from the Dashboard now automatically returns you to the Dashboard tab.</li>
                    <li><strong>Calendar Display Optimization:</strong> Removed the 3-event limit per day; the calendar now expands to show all scheduled tasks and reminders.</li>
                    <li><strong>Enhanced Location Context:</strong> Added Rack-Cage prefix (e.g., 1-C-1) to Calendar events and displayed the Current Cage Tag in edit headers.</li>
                    <li><strong>Litter Management:</strong> Added a "Wean Plan" column to the Litters table and removed the delete button from the edit modal for safer handling.</li>
                    <li><strong>Mating Reminders:</strong> Reminders can now be added to Mating records and viewed directly on the Calendar.</li>
                    <li><strong>Timeline Refinement:</strong> Renamed "Litter" markers to "Birth" for clearer event identification in the Breeding Timeline.</li>
                    <li><strong>Smart Sex Search:</strong> Enhanced search to support matching by sex keywords like "male", "female", "♂", or "♀" with partial match support (e.g., "fe" matches female).</li>
                    <li><strong>Cage Age Tracking:</strong> Added an optional "Age" column to the Cages table, showing the age range of occupants.</li>
                    <li><strong>Age Unit Toggle:</strong> Introduced a quick switcher (d/w/m) in the toolbar to instantly change age display units across all tables.</li>
                    <li><strong>Data Consistency:</strong> Unified the definition of "Live Mice" between the header and Summary reports, including the handling of "Inactive" status and unknown DOBs.</li>
                    <li><strong>Table Sorting:</strong> Enabled sorting by age (DOB) in Mice and Litters tables, replacing the previous header-click unit toggle.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.8.0</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-03-17</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Breeding Timeline (Gantt Chart):</strong> Introduced a visual timeline for tracking breeding periods and litter births. Includes zoom controls and filtering.</li>
                  <li><strong>Summary View Refinement:</strong> Split the Summary view into "Active/Live Summary" and "Filter & Search" tabs for a more focused data analysis experience.</li>
                  <li><strong>Cage Label Enhancements:</strong> Optimized printed label design with separated sections, larger Line names for better legibility, and integrated Genetic Background info.</li>
                  <li><strong>Printing Accessibility:</strong> Moved the "Print Labels" button to the main toolbar in the Cages tab for easier access.</li>
                  <li><strong>Japanese Input Fix:</strong> Resolved IME interruption issues in Global Settings by optimizing input state management.</li>
                  <li><strong>Multi-Select Improvements:</strong> Added "Clear All" buttons to filter dropdowns for more efficient query resetting.</li>
                  <li><strong>Dark Mode Visibility:</strong> Improved UI contrast by increasing the opacity of card backgrounds and enhancing border prominence for better window definition.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.7.0</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-03-16</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Date Formatting Engine:</strong> Implemented a global date display setting (YYYY/MM/DD, etc.) that consistently updates all dates across Mice, Matings, and Litters tables.</li>
                  <li><strong>Sticky App Shell:</strong> Re-engineered the header and footer to use sticky positioning with a "glassmorphism" blur effect, ensuring critical navigation is always accessible.</li>
                  <li><strong>Enhanced Modal Interaction:</strong> Unified all modals to support "click outside to cancel." Improved z-index layering to prevent fixed UI components from overlapping forms.</li>
                  <li><strong>Settings Optimization:</strong> Refined the Global Settings layout with descriptive icons and repositioned the Date Format setting to the top for easier access.</li>
                  <li><strong>UI Cleanup:</strong> Removed redundant sub-tabs from the Management view and polished the Summary page layout for a cleaner, more focused experience.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>v1.6.0</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-03-16</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Global Settings Modal:</strong> Centralized system settings including data storage path and breeding parameters into a new intuitive interface.</li>
                  <li><strong>Customizable Weaning Cycle:</strong> Users can now define the weaning period length, which automatically updates all Calendar and Todo List deadlines.</li>
                  <li><strong>Finder Integration (macOS):</strong> Implemented native folder selection via AppleScript, allowing Mac users to set data directories through a familiar GUI.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.4.0</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-03-13</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Project Evolution:</strong> Renamed system to <strong>ColonyFlow</strong> for a more agile and process-oriented brand identity.</li>
                  <li><strong>Project Management:</strong> Added full control to Create, Rename, and Delete projects directly from the UI.</li>
                  <li><strong>Path Visualization:</strong> Displaying absolute file paths in the project switcher for better data transparency.</li>
                  <li><strong>Header Refinement:</strong> Optimized Master Board width and matched dropdown alignment for a unified design.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>v1.3.0</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-03-11</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Data Consistency:</strong> Consolidated mouse `state` and `status` fields into a single `status` field for better data management.</li>
                  <li><strong>Automated Cage Cleanup:</strong> Implemented fully automated removal of empty cages after mouse updates or deletions.</li>
                  <li><strong>Comment Management:</strong> Updated bulk comment logic to append entries using a semicolon (;) delimiter.</li>
                  <li><strong>Database Protection:</strong> Added a manual "Backup DB" button and timestamp display in the global header.</li>
                  <li><strong>UI Refinement:</strong> Optimized header layout with wider action buttons and moved Help to the footer.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>v1.2.5</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-03-11</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Summary Dashboard:</strong> Added a new statistics page filterable by Line, DOB, End Date, and Status.</li>
                  <li><strong>Bulk Actions UI:</strong> Redesigned the bulk action section into a more efficient 2-row layout.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.7 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>v1.1.0</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-02-27</span>
                </div>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Location Structure Redesign:</strong> Introduced hierarchical management for Room / Rack / Cage.</li>
                  <li><strong>Pedigree View Improvements:</strong> Prioritized ID over Tag for enhanced clarity.</li>
                </ul>
              </section>

              <section style={{ opacity: 0.5 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>v1.0.0</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-02-16</span>
                </div>
                <p style={{ fontSize: '0.9rem', margin: 0, paddingLeft: '1.2rem' }}>ColonyFlow Official Release</p>
              </section>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px solid var(--card-border)' }}>
              <button className="btn btn-primary" onClick={() => setShowChangelog(false)} style={{ padding: '0.45rem 1.4rem', fontSize: '0.82rem', fontWeight: 600 }}>Done</button>
            </div>
          </div>
        </div>
      </div>
    )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .content-area {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
