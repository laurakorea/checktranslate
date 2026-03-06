import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'src/auth/login.html'),
                select_test: resolve(__dirname, 'src/user/select_test.html'),
                work: resolve(__dirname, 'src/user/work.html'),
                dashboard: resolve(__dirname, 'src/admin/dashboard.html'),
            },
        },
    },
});
