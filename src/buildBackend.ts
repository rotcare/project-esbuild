import { Project } from '@rotcare/project';
import * as esbuild from 'esbuild';
import { esbuildPlugin } from './esbuildPlugin';

let result: esbuild.BuildIncremental;

/**
 * 增量构建 `@motherboard/backend` 这个入口的后端应用，适配 node.js。可重复调用，内部缓存了中间结果。
 * @param project 要构建的项目
 * @returns 构建结果
 */
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
            plugins: [esbuildPlugin(project)],
            incremental: true,
        }) as Promise<esbuild.BuildIncremental>);
    }
    return result;
}