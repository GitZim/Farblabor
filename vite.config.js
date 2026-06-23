import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Project pages are served from https://<user>.github.io/<repo>/, so the
// production build needs that subpath as base. Dev keeps the root path.
export default defineConfig(function (_a) {
    var command = _a.command;
    return ({
        base: command === 'build' ? '/Farblabor/' : '/',
        plugins: [react()],
    });
});
