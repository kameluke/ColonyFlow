import { NextResponse } from 'next/server';
import { listProjects, saveAppConfig, getAppConfig } from '../../../lib/storage';

export async function GET() {
    try {
        const { listProjects, getAppConfig, getEffectiveDataRoot } = require('../../../lib/storage');
        const projects = listProjects();
        const config = getAppConfig();
        const effectiveRoot = getEffectiveDataRoot();
        return NextResponse.json({ 
            projects, 
            activeProject: config.activeProject,
            dataRoot: effectiveRoot,
            customDataRoot: config.customDataRoot
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to list projects' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { projectName, customDataRoot } = await request.json();
        const { saveAppConfig } = require('../../../lib/storage');

        if (projectName) {
            saveAppConfig({ activeProject: projectName });
        }
        
        if (customDataRoot !== undefined) {
            saveAppConfig({ customDataRoot });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update configuration' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const projectName = searchParams.get('projectName');
    const { deleteProject, saveAppConfig, getAppConfig, listProjects } = require('../../../lib/storage');

    if (!projectName) {
        return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    try {
        const success = deleteProject(projectName);
        if (success) {
            const config = getAppConfig();
            if (config.activeProject === projectName) {
                const remaining = listProjects();
                const nextProject = remaining.length > 0 ? remaining[0] : 'default';
                saveAppConfig({ activeProject: nextProject });
            }
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ error: 'System error' }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const { oldName, newName } = await request.json();
        const { renameProject, saveAppConfig, getAppConfig } = require('../../../lib/storage');

        if (!oldName || !newName) {
             return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const success = renameProject(oldName, newName);
        if (success) {
            const config = getAppConfig();
            if (config.activeProject === oldName) {
                saveAppConfig({ activeProject: newName });
            }
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'Failed to rename project' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ error: 'System error' }, { status: 500 });
    }
}
