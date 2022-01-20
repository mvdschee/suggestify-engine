import { defineBuildConfig } from 'unbuild';
import pkg from './package.json';

export default defineBuildConfig({
    declaration: true,
    rollup: {
        emitCJS: true,
    },
    clean: true,
    outDir: 'lib',
    replace: {
        '// __banner__': `/*!
        * ${pkg.name} v${pkg.version}
        * (c) 2022 ${pkg.author}
        * @license ISC
        */`,
    },
    entries: ['src/engine', 'static/'],
});
