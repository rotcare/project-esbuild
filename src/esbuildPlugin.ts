import { Project } from "@rotcare/project/src/Project";
import type { Plugin } from 'esbuild';
import { buildFile } from "@rotcare/project/src/buildFile";

/**
 * `@motherboard` 开头的路径都是由这个 esbuildPlugin 虚构出来的
 * 其源代码来自于 project 的多个 packages 合并而来
 * @param project 要构建的项目
 * @returns 给 esbuild 使用的插件
 */
export function esbuildPlugin(project: Project): Plugin {
    return {
        name: 'rotcare',
        setup: (build) => {
            build.onResolve({ filter: /^[^.]/ }, (args) => {
                if (args.path.startsWith('@motherboard/')) {
                    return { path: args.path, namespace: '@motherboard' };
                } else {
                    project.subscribePackage(args.path);
                    return undefined;
                }
            });
            build.onLoad({ namespace: '@motherboard', filter: /^@motherboard\// }, async (args) => {
                const jsCode = await buildFile(project, args.path.substr('@motherboard/'.length));
                return {
                    resolveDir: project.projectDir,
                    contents: jsCode,
                };
            });
        },
    };
}
