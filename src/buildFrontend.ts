import { Project } from '@rotcare/project';
import * as esbuild from 'esbuild';
import { esbuildPlugin } from './esbuildPlugin';

let result: esbuild.BuildIncremental;

/**
 * 增量构建前端应用，适配浏览器环境。可重复调用，内部缓存了中间结果。
 * @param project 要构建的项目
 * @returns 构建结果
 */
export async function buildFrontend(project: Project, entryPoint: string) {
    if (result) {
        result = await result.rebuild();
    } else {
        result = await (esbuild.build({
            sourcemap: 'inline',
            keepNames: true,
            bundle: true,
            entryPoints: [entryPoint],
            write: false,
            platform: 'browser',
            target: 'es2020',
            absWorkingDir: project.projectDir,
            define: { 'process.env.NODE_ENV': `"development"` },
            plugins: [esbuildPlugin(project)],
            incremental: true,
        }) as Promise<esbuild.BuildIncremental>);
    }
    return result;
}