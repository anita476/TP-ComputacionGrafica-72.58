import { defineConfig } from 'vite';

export default defineConfig({
    // Your configuration options here
    optimizeDeps: {
        include: ['three/examples/jsm/utils/BufferGeometryUtils.js']
    }
});