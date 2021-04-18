import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
    input: ['src/card.js'],
    output: {
        dir: './',
        format: 'es',
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**',
        }),
        terser({
            format: {
                comments: false,
            },
        }),
    ],
};
