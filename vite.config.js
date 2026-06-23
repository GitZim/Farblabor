import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Relative base so the build works both at the project-page subpath
// (https://gitzim.github.io/Farblabor/) and at the custom domain root
// (https://farblabor.heidrich.ws/). HashRouter means no deep-path routing,
// so relative asset URLs resolve correctly in either mount point.
export default defineConfig(function (_a) {
    var command = _a.command;
    return ({
        base: command === 'build' ? './' : '/',
        plugins: [react()],
    });
});
