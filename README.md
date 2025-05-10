kreateApp
A Multi-Language Ionic/Cordova Starter Template
Supports Arabic, English, Kurdish (RTL + LTR), with Dark/Light Theme Toggle.

✨ Features
🌍 RTL + LTR support with dynamic language switching

🌗 Light and Dark theme support

🚀 Cordova plugin support via @awesome-cordova-plugins

🔌 No dependency on deprecated @ionic-native plugins

🌐 Internationalization via @ngx-translate/core

🗂️ Persistent storage using @ionic/storage-angular

📱 Android & iOS ready

📦 Simple build and serve setup

🛠️ Tech Stack
Ionic + Angular

Cordova

@awesome-cordova-plugins

ngx-translate

Ionic Storage

🚀 Quick Start
bash
Copy
Edit
# Clone the repository
git clone https://github.com/YOUR_USERNAME/kreateApp.git
cd kreateApp

# Install dependencies
npm install

# Run in browser
ionic serve

# Add Android platform (optional version tag)
ionic cordova platform add android@13.0.0

# Build Android
ionic cordova build android

# (Optional) Production build
ionic cordova build android --prod

# Add iOS platform
ionic cordova platform add ios
ionic cordova build ios
📁 Project Structure Highlights
app.module.ts: Includes ThemeService, LanguageService, and plugin setup

assets/i18n/: JSON translation files for multiple languages

services/: Contains reusable services (auth, database, theme, language)

config.xml: Pre-configured with splash, permissions, Android preferences, and platform settings

📱 Config Highlights (config.xml)
Android min SDK: 24

Target SDK: 35

Permissions: Camera, Location, Media Access, Notifications

AndroidX and MultiDex enabled

Custom splash screen and status bar settings

🔧 Customize
Languages: Add your translation JSON files under assets/i18n/

Themes: Modify logic in theme.service.ts

Plugins: Use @awesome-cordova-plugins for supported features

📬 Contact
KREATE TECHNOLOGIES LLC
📧 info@kreatedev.com
🌐 kreatedev.com
