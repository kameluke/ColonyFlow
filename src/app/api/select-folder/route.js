import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  if (process.platform !== 'darwin') {
    return NextResponse.json({ success: false, error: 'Only supported on macOS' });
  }

  try {
    // Simplified script that usually works better for showing dialogs
    const script = 'POSIX path of (choose folder with prompt "Select ColonyFlow Data Directory")';
    const { stdout, stderr } = await execAsync(`osascript -e '${script}'`);
    
    if (stderr) console.error("Script stderr:", stderr);
    
    const folderPath = stdout.trim();
    if (folderPath) {
      return NextResponse.json({ success: true, path: folderPath });
    }
    return NextResponse.json({ success: false, error: 'No folder selected' });
  } catch (error) {
    const errorMsg = error.message || String(error);
    console.error('AppleScript error:', errorMsg);
    
    // Check if the user just cancelled
    if (errorMsg.includes('-128')) {
       return NextResponse.json({ success: false, error: 'User canceled' });
    }
    
    return NextResponse.json({ success: false, error: `Finder Error: ${errorMsg}` });
  }
}
