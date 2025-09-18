import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Charger les variables .env à la racine de /frontend/
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // Définir les variables qui seront disponibles dans votre code JS
    define: {
      'process.env.VITE_REVERB_APP_KEY': JSON.stringify(env.VITE_REVERB_APP_KEY),
      'process.env.VITE_REVERB_HOST': JSON.stringify(env.VITE_REVERB_HOST),
      'process.env.VITE_REVERB_PORT': JSON.stringify(env.VITE_REVERB_PORT),
      'process.env.VITE_REVERB_SCHEME': JSON.stringify(env.VITE_REVERB_SCHEME),
    },
  };
});