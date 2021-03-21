import { Project } from "@rotcare/project/src/Project";
import type { Plugin } from 'esbuild';
import { buildFile } from "@rotcare/project/src/buildFile";

// @motherboard 开头的路径都是由这个 esbuildPlugin 虚构出来的
// 其源代码来自于 project 的多个 packages 合并而来
export function esbuildPlugin(options: { project: Project }): Plugin {
    const { project } = options;
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
                const projectFile = await buildFile(project, args.path.substr('@motherboard/'.length));
                return {
                    resolveDir: projectFile.resolveDir,
                    contents: projectFile.code,
                    loader: projectFile.isTsx ? 'tsx' : 'ts',
                };
            });
        },
    };
}
