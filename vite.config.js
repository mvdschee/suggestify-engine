import { defineConfig } from 'vite';
import path from 'path';
import pkg from './package.json';

module.exports = defineConfig({
	build: {
		target: 'esnext',
		emptyOutDir: false,
		lib: {
			entry: path.resolve(__dirname, 'src/engine.js'),
			formats: ['cjs'],
		},
		outDir: './lib',
		rollupOptions: {
			output: {
				entryFileNames: `engine.js`,
				banner: `/*!
* ${pkg.name} v${pkg.version}
* (c) 2021 ${pkg.author}
* @license MIT
* Engine does Vroem Vroem..
*/`,
			},
		},
	},
});
