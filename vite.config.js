import { defineConfig } from 'vite';

export default defineConfig({
    // Your configuration options here
base:'/TP-ComputacionGrafica-72.58/',
	optimizeDeps: {
        include: ['three/examples/jsm/utils/BufferGeometryUtils.js']
    }
});
