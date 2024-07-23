import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

const manifestForPlugin = {
  registerType:'autoUpdate',
  includeAssests:['images/favicon.ico', "images/apple-touch-icon.png"],
  manifest:{
    name:"YieldSmart",
    short_name:"YieldSmart",
    description:"YieldSmart help to maximizing yield and minimizing waste for a sustainable agricultural future",
    icons:[{
      src: '/images/logo192.png',
      sizes:'192x192',
      type:'image/png',
    },
    {
      src:'/images/logo256.png',
      sizes:'256x256',
      type:'image/png',
    },
    {
      src: '/images/logo384.png',
      sizes:'384x384',
      type:'image/png',
    },
    {
      src: '/images/logo512.png',
      sizes:'512x512',
      type:'image/png',
    }
  ],
  theme_color:'#181818',
  background_color:'#e0cc3b',
  display:"standalone",
  scope:'/',
  start_url:"/",
  orientation:'portrait'
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react(), VitePWA(manifestForPlugin)],
})
