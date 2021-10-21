import { defineConfig } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default defineConfig({
	input: {
		engine: 'src/engine.js',
	},
	output: {
		dir: 'lib',
		format: 'cjs',
		exports: 'default',
		banner: `/*!
* ${pkg.name} v${pkg.version}
* (c) 2021 ${pkg.author}
* @license MIT
*/`,
	},
	plugins: [terser()],
});
