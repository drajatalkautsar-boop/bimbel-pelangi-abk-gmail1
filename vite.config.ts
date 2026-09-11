import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const supabaseUrl = 
    env.VITE_SUPABASE_URL || 
    process.env.VITE_SUPABASE_URL || 
    env.SUPABASE_URL || 
    process.env.SUPABASE_URL || 
    '';

  const supabaseAnonKey = 
    env.VITE_SUPABASE_ANON_KEY || 
    process.env.VITE_SUPABASE_ANON_KEY || 
    env.VITE_SUPABASE_PUBLISHABLE_KEY || 
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
    env.SUPABASE_ANON_KEY || 
    process.env.SUPABASE_ANON_KEY || 
    env.SUPABASE_PUBLISHABLE_KEY || 
    process.env.SUPABASE_PUBLISHABLE_KEY || 
    '';

  const supabasePublishableKey = 
    env.VITE_SUPABASE_PUBLISHABLE_KEY || 
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
    supabaseAnonKey;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(supabasePublishableKey),
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
