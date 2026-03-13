import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Mobile responsive fixes are now scoped per-page via data-page on <body>.
// This prevents one page's mobile overrides from impacting others.
import './mobile-fixes.css';

// Global error handler to catch runtime errors
window.addEventListener('error', (e) => {
  console.error('GLOBAL ERROR:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('UNHANDLED REJECTION:', e.reason);
});

// Capacitor App lifecycle - only import on web platform
const isCapacitor = () => {
  return window.Capacitor?.isNativePlatform?.() === true;
};

// Initialize app - only run Capacitor code on native platforms
const initApp = async () => {
  // Skip Capacitor initialization on web
  if (!isCapacitor()) {
    return;
  }
  
  try {
    // Dynamic import for Capacitor to avoid web build issues
    const { App: CapacitorApp } = await import('@capacitor/app');
    const { SplashScreen } = await import('@capacitor/splash-screen');
    const { StatusBar } = await import('@capacitor/status-bar');
    const { Device } = await import('@capacitor/device');
    
    // Hide splash screen
    await SplashScreen.hide();
    
    // Set status bar style
    await StatusBar.setStyle({
      style: 'DARK'
    });
    
    // Get device info
    const deviceInfo = await Device.getInfo();
    console.log('Device:', deviceInfo);
    
    // Handle back button
    CapacitorApp.addListener('backButton', () => {
      const path = window.location.pathname;
      if (path !== '/') {
        window.history.back();
      }
    });
    
    // Handle app state
    CapacitorApp.addListener('appStateChange', (state) => {
      console.log('App state:', state.isActive ? 'active' : 'inactive');
    });
    
  } catch (error) {
    console.log('Capacitor not available:', error);
  }
};

// Render app with BrowserRouter
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Initialize Capacitor features (will skip on web)
initApp();
