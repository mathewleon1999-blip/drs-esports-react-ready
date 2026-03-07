# DRS Esports Mobile App

This project has been converted to a native mobile application using **Capacitor**. The app can now be built for both Android and iOS platforms.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Android Studio (for Android)
- Xcode (for iOS - Mac only)
- Java JDK 17

### Development Server (Web Preview)
```bash
npm run dev
```

### Build Web Assets
```bash
npm run build
```

### Run on Android Device/Emulator
```bash
npx cap sync android
npx cap open android
```

### Build APK (Debug)
```bash
cd android
./gradlew assembleDebug
```
The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

## 📱 Mobile Features

### Native Capabilities
- **Status Bar** - Dark style support
- **Splash Screen** - Custom branded loading screen
- **Haptic Feedback** - Tactile responses
- **Local Notifications** - Push notifications
- **Device Info** - Hardware identification
- **Offline Support** - PWA capabilities

### PWA Features
- Installable on home screen
- Offline functionality
- Push notifications
- Full-screen experience

## 📁 Project Structure

```
drs-esports-react-ready/
├── android/                 # Native Android project
│   └── app/
│       └── src/main/
│           └── assets/      # Web assets (auto-generated)
├── src/
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── context/           # React contexts
│   └── ...
├── capacitor.config.json  # Capacitor configuration
└── package.json
```

## 🔧 Configuration

### App ID
- **Android Package Name**: `com.drs.esports`
- **App Name**: DRS Esports

### Capacitor Plugins Installed
- @capacitor/core
- @capacitor/cli
- @capacitor/app
- @capacitor/device
- @capacitor/haptics
- @capacitor/local-notifications
- @capacitor/preferences
- @capacitor/splash-screen
- @capacitor/status-bar

## 📲 Installation Methods

### Option 1: Build from Source
1. Clone the repository
2. Run `npm install`
3. Run `npm run build`
4. Run `npx cap sync android`
5. Open Android Studio: `npx cap open android`
6. Build and run on device/emulator

### Option 2: Use Pre-built APK
The debug APK can be found at:
`android/app/build/outputs/apk/debug/app-debug.apk`

### Option 3: Install PWA
Simply visit: https://drs-esports-react-ready.vercel.app/
- On mobile: Add to Home Screen
- Works offline after first load

## 🌐 Web Version

The app is deployed at: **https://drs-esports-react-ready.vercel.app/**

### New Routes
- `/` - Home
- `/shop` - Merchandise Store
- `/cart` - Shopping Cart
- `/tournaments` - Tournament Listings
- `/leaderboard` - Player Rankings
- `/achievements` - Achievement System
- `/loyalty` - Loyalty Program
- `/predictions` - Match Predictions
- `/prize-pool` - Prize Pool Tracker
- `/admin` - Admin Login
- `/admin-dashboard` - Admin Dashboard
- `/donate` - Donation Page

## 📱 Building for Production

### Android Release APK
1. Update `android/app/build.gradle` with signing config
2. Run: `./gradlew assembleRelease`
3. Sign the APK with your keystore

### iOS App Store
1. Run: `npx cap add ios`
2. Open: `npx cap open ios`
3. Configure signing in Xcode
4. Archive and upload to App Store

## 🔒 Permissions

The app uses these Android permissions:
- `INTERNET` - Network access
- `VIBRATE` - Haptic feedback (automatic)

## 📄 License

This project is for DRS Esports - All rights reserved.

