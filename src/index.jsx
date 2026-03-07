import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Capacitor App lifecycle
import { App as CapacitorApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { Device } from '@capacitor/device';

// Initialize app
const initApp = async () => {
  try {
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

// Render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize Capacitor features
initApp();

