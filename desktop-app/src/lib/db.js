import fs from 'fs';
import path from 'path';
import { getActiveProjectPath, getBackupDir, getAppConfig } from './storage';

// Old path for migration
const OLD_DB_PATH = path.join(process.cwd(), 'data', 'db.json');

const DEFAULT_DB = {
    mice: [],
    cages: [],
    matings: [],
    litters: [],
    rooms: [],
    racks: [],
    settings: {
        lastMouseId: 0,
        lastMatingId: 0,
        lastLitterId: 0,
        weaningDays: 21
    },
    completedTasks: []
};

/**
 * Migrate old data if necessary
 */
function ensureMigrated() {
    const config = getAppConfig();
    const newPath = getActiveProjectPath();
    
    // Only migrate from old root db.json if we are on the 'default' project
    // and the destination doesn't exist yet.
    if (config.activeProject === 'default' && !fs.existsSync(newPath) && fs.existsSync(OLD_DB_PATH)) {
        console.log(`Migrating data from ${OLD_DB_PATH} to ${newPath}`);
        fs.copyFileSync(OLD_DB_PATH, newPath);
    }
}

export function readDB() {
    ensureMigrated();
    const dbPath = getActiveProjectPath();
    
    if (!fs.existsSync(dbPath)) {
        // Create the file immediately so it appears in listProjects()
        writeDB(DEFAULT_DB);
        return DEFAULT_DB;
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(data);
    // Ensure new fields exist
    return { ...DEFAULT_DB, ...db, settings: { ...DEFAULT_DB.settings, ...db.settings } };
}

export function writeDB(data) {
    const dbPath = getActiveProjectPath();
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

export function getDBLastModified() {
    const dbPath = getActiveProjectPath();
    if (!fs.existsSync(dbPath)) return null;
    const stats = fs.statSync(dbPath);
    return stats.mtime.toISOString();
}

export function createBackup() {
    const dbPath = getActiveProjectPath();
    if (!fs.existsSync(dbPath)) return null;

    const config = getAppConfig();
    const backupDir = getBackupDir(config.activeProject);
    
    // YYYYMMDD-HHmm format for filename
    const now = new Date();
    const dateStr = now.getFullYear().toString() + 
                    (now.getMonth() + 1).toString().padStart(2, '0') + 
                    now.getDate().toString().padStart(2, '0');
    const timeStr = now.getHours().toString().padStart(2, '0') + 
                    now.getMinutes().toString().padStart(2, '0');
                    
    const backupPath = path.join(backupDir, `db_backup_${dateStr}-${timeStr}.json`);
    fs.copyFileSync(dbPath, backupPath);
    return path.basename(backupPath);
}
