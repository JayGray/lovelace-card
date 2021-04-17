import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';

export default {
    input: ['src/card.js'],
    output: {
        dir: './dist',
        format: 'es',
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**',
        }),
        terser(),
        serve({
            contentBase: './dist',
            host: '0.0.0.0',
            port: 5000,
            allowCrossOrigin: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }),
    ],
};
