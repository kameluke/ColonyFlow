import { NextResponse } from 'next/server';
import { readDB, writeDB, getDBLastModified, createBackup } from '../../../lib/db';

export async function GET() {
  try {
    const data = readDB();
    const lastModified = getDBLastModified();

    // Migration: ensure all mice use 'status' instead of 'state'
    let migrated = false;
    if (data.mice && Array.isArray(data.mice)) {
      data.mice = data.mice.map(mouse => {
        if (mouse.state && !mouse.status) {
          mouse.status = mouse.state;
          delete mouse.state;
          migrated = true;
          return mouse;
        }
        if (mouse.state && mouse.status) {
          delete mouse.state;
          migrated = true;
          return mouse;
        }
        return mouse;
      });
    }

    if (migrated) {
      writeDB(data);
    }

    return NextResponse.json({ ...data, lastModified });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { type, item, action } = payload;
    const db = readDB();

    // Handle special actions
    if (action === 'backup') {
      try {
        const filename = createBackup();
        return NextResponse.json({ success: true, filename });
      } catch (e) {
        return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
      }
    }

    if (action === 'completeTask') {
      if (!db.completedTasks) db.completedTasks = [];
      db.completedTasks.push(item.taskId);
      writeDB(db);
      return NextResponse.json({ success: true, db, lastModified: getDBLastModified() });
    }

    if (action === 'undoTask') {
      if (db.completedTasks) {
        db.completedTasks = db.completedTasks.filter(id => id !== item.taskId);
      }
      writeDB(db);
      return NextResponse.json({ success: true, db, lastModified: getDBLastModified() });
    }

    if (action === 'updateSettings') {
      db.settings = { ...(db.settings || {}), ...item };
      writeDB(db);
      return NextResponse.json({ success: true, db, lastModified: getDBLastModified() });
    }

    if (!db[type]) db[type] = [];

    if (item.id) {
      // Update
      const index = db[type].findIndex(i => i.id === item.id);
      if (index !== -1) {
        const merged = { ...db[type][index], ...item };
        if (type === 'mice' && merged.status && merged.state) {
          delete merged.state;
        }
        db[type][index] = merged;
      } else {
        db[type].push(item);
      }
    } else {
      // Create
      if (type === 'mice') {
        db.settings.lastMouseId += 1;
        item.id = 'M' + db.settings.lastMouseId.toString().padStart(4, '0');
      } else if (type === 'matings') {
        db.settings.lastMatingId = (db.settings.lastMatingId || 0) + 1;
        item.id = 'MAT-' + db.settings.lastMatingId.toString().padStart(4, '0');
      } else if (type === 'litters') {
        db.settings.lastLitterId = (db.settings.lastLitterId || 0) + 1;
        item.id = 'LIT-' + db.settings.lastLitterId.toString().padStart(4, '0');
      } else {
        item.id = Date.now().toString();
      }
      db[type].push(item);
    }

    writeDB(db);
    return NextResponse.json({ success: true, db, lastModified: getDBLastModified() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  try {
    const db = readDB();
    if (db[type]) {
      db[type] = db[type].filter(i => i.id !== id);
      writeDB(db);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
