//@ts-check
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const watch = process.argv.includes('--watch');
const minify = process.argv.includes('--minify');

const success = watch ? 'Watch build succeeded' : 'Build succeeded';

function getTime() {
   const date = new Date();
   return `[${`${padZeroes(date.getHours())}:${padZeroes(date.getMinutes())}:${padZeroes(date.getSeconds())}`}] `;
}

function padZeroes(i) {
   return i.toString().padStart(2, '0');
}

/** Copy the webview bundle dir into out/ so the .vsix ships webview.js + emitted asset files
 *  (fonts, images) and the custom editor can load them. */
function copyWebviewBundle() {
   const srcDir = path.resolve(__dirname, '..', '..', 'packages', 'glsp-vscode-webview', 'dist');
   const destDir = path.resolve(__dirname, 'out');
   if (!fs.existsSync(srcDir)) {
      console.warn(getTime() + `webview dist not found at ${srcDir} — run \`yarn build\` in glsp-vscode-webview first.`);
      return;
   }
   fs.mkdirSync(destDir, { recursive: true });
   for (const entry of fs.readdirSync(srcDir)) {
      fs.copyFileSync(path.join(srcDir, entry), path.join(destDir, entry));
   }
   console.log(getTime() + `Copied webview bundle dir -> ${path.relative(__dirname, destDir)}`);
}

const plugins = [
   {
      name: 'watch-plugin',
      setup(build) {
         build.onEnd(result => {
            if (result.errors.length === 0) {
               copyWebviewBundle();
               console.log(getTime() + success);
            }
         });
      }
   }
];

const ctx = await esbuild.context({
   // Entry points for the vscode extension and the language server and the parser worker threads
   entryPoints: ['src/extension.ts', 'src/main.ts', 'src/language-server/parser/worker-thread.ts'],
   outdir: 'out',
   bundle: true,
   target: 'ES2022',
   // VSCode's extension host is still using cjs, so we need to transform the code
   format: 'cjs',
   // To prevent confusing node, we explicitly use the `.cjs` extension
   outExtension: {
      '.js': '.cjs'
   },
   loader: { '.ts': 'ts' },
   external: ['vscode', 'prettier'],
   platform: 'node',
   sourcemap: !minify,
   minify,
   plugins
});

if (watch) {
   await ctx.watch();
} else {
   await ctx.rebuild();
   ctx.dispose();
}
