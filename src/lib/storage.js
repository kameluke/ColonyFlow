import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * ColonyFlowのデータ保存のルートディレクトリ
 * 将来的なアプリ化を見据え、Macの「書類(Documents)」フォルダ内に作成します。
 */
export const DEFAULT_DATA_ROOT = path.join(os.homedir(), 'Documents', 'ColonyFlow');
const APP_CONFIG_PATH = path.join(DEFAULT_DATA_ROOT, 'app_config.json');

// 初期設定のデフォルト値
const DEFAULT_CONFIG = {
    activeProject: 'default',
    customDataRoot: null, // null means use default
    lastModified: new Date().toISOString()
};

/**
 * 実効的なデータルートを取得（カスタムパスが設定されていればそれを、なければデフォルトを返す）
 */
export function getEffectiveDataRoot() {
    const config = getAppConfig();
    const root = config.customDataRoot || DEFAULT_DATA_ROOT;
    
    // Ensure directories exist
    if (!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true });
    }
    const projectsDir = path.join(root, 'projects');
    const backupsDir = path.join(root, 'backups');
    if (!fs.existsSync(projectsDir)) fs.mkdirSync(projectsDir, { recursive: true });
    if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });
    
    return root;
}

/**
 * アプリ全体の設定（現在どのプロジェクトを使っているかなど）を取得
 */
export function getAppConfig() {
    if (!fs.existsSync(DEFAULT_DATA_ROOT)) {
        fs.mkdirSync(DEFAULT_DATA_ROOT, { recursive: true });
    }

    if (!fs.existsSync(APP_CONFIG_PATH)) {
        fs.writeFileSync(APP_CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2));
        return DEFAULT_CONFIG;
    }

    try {
        return JSON.parse(fs.readFileSync(APP_CONFIG_PATH, 'utf8'));
    } catch (e) {
        return DEFAULT_CONFIG;
    }
}

/**
 * アプリ全体の設定を保存
 */
export function saveAppConfig(config) {
    const current = getAppConfig();
    const newConfig = { ...current, ...config, lastModified: new Date().toISOString() };
    fs.writeFileSync(APP_CONFIG_PATH, JSON.stringify(newConfig, null, 2));
}

/**
 * 現在アクティブなプロジェクトのファイルパスを取得
 */
export function getActiveProjectPath() {
    const config = getAppConfig();
    const root = getEffectiveDataRoot();
    return path.join(root, 'projects', `${config.activeProject}.json`);
}

/**
 * 指定したプロジェクトのバックアップディレクトリを取得
 */
export function getBackupDir(projectName) {
    const root = getEffectiveDataRoot();
    const dir = path.join(root, 'backups', projectName || getAppConfig().activeProject);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
}

/**
 * 保存されているプロジェクト一覧を取得
 */
export function listProjects() {
    const root = getEffectiveDataRoot();
    const projectsDir = path.join(root, 'projects');
    if (!fs.existsSync(projectsDir)) return ['default'];
    
    return fs.readdirSync(projectsDir)
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
}

/**
 * プロジェクトを削除
 */
export function deleteProject(projectName) {
    const root = getEffectiveDataRoot();
    const projectPath = path.join(root, 'projects', `${projectName}.json`);
    if (fs.existsSync(projectPath)) {
        fs.unlinkSync(projectPath);
        return true;
    }
    return false;
}

/**
 * プロジェクト名を変更
 */
export function renameProject(oldName, newName) {
    if (!newName) return false;
    const root = getEffectiveDataRoot();
    const oldPath = path.join(root, 'projects', `${oldName}.json`);
    const newPath = path.join(root, 'projects', `${newName}.json`);

    if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
        fs.renameSync(oldPath, newPath);
        
        // Also rename backup folder if it exists
        const oldBackupDir = path.join(root, 'backups', oldName);
        const newBackupDir = path.join(root, 'backups', newName);
        if (fs.existsSync(oldBackupDir)) {
            fs.renameSync(oldBackupDir, newBackupDir);
        }
        return true;
    }
    return false;
}
