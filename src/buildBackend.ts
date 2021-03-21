import { Project } from '@rotcare/project';
import * as esbuild from 'esbuild';
import { esbuildPlugin } from './esbuildPlugin';

let result: esbuild.BuildIncremental;

export async function buildBackend(project: Project) {
    if (result) {
        result = await result.rebuild();
    } else {
        result = await (esbuild.build({
            sourcemap: 'inline',
            keepNames: true,
            bundle: true,
            entryPoints: ['@motherboard/backend'],
            platform: 'node',
            format: 'cjs',
            write: false,
            absWorkingDir: project.projectDir,
            plugins: [esbuildPlugin({ project })],
            incremental: true,
        }) as Promise<esbuild.BuildIncremental>);
    }
    return result;
}