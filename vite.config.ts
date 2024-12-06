import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/f1-team-ranker/', // Replace <repository-name> with your repo name
});
