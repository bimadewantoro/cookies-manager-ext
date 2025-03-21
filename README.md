# CookiesKu - Browser Cookie Manager Extension

A browser extension for managing cookies and user sessions across different websites. CookiesKu allows you to save, load, and apply cookie profiles to quickly switch between different accounts or sessions.

## 📋 Features

- **Profile Management**: Create, save, and delete cookie profiles
- **Quick Application**: Apply saved cookies and automatically open websites
- **Cross-domain Support**: Works across all websites
- **Import/Export**: Share profiles between browsers or devices
- **Easy Interface**: Simple, intuitive UI for managing cookies

## 🔧 Installation

### Developer Mode (From Source)
1. Clone or download this repository
2. Open your browser and navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Other Chromium browsers: Check their extensions page
3. Enable "Developer mode" (usually a toggle in the top-right corner)
4. Click "Load unpacked" and select the folder containing this extension
5. The CookiesKu extension should now appear in your browser toolbar

## 🚀 Usage

### Creating a Cookie Profile

1. Click the CookiesKu icon in your browser toolbar
2. Enter a profile name, domain, and URL to open
3. Add cookie name-value pairs using the cookie fields
4. Click "Save Profile" to store the configuration

### Managing Profiles

- **Load Profile**: Select a profile from the dropdown and click "Load Profile"
- **Apply & Open**: Load a profile and click "Apply & Open Tab" to set cookies and open the website
- **Delete Profile**: Select a profile and click "Delete" to remove it

### Import/Export

- **Export All Profiles**: Click "Export All Profiles" to download a JSON file containing your profiles
- **Import Profiles**: Click "Import Profiles" to upload a previously exported profiles file

## ⚠️ Important Notes

- This extension is designed for legitimate purposes such as testing, development, and managing multiple accounts
- The extension requires permissions to read and modify cookies for all websites you visit
- Always use responsibly and in compliance with websites' terms of service

## 🛠️ Technical Details

- Built with Manifest V3 for modern browser compatibility
- Uses Chrome Storage API for saving profiles
- Implements proper security measures for handling cookie data

## 📝 License

This project is provided for educational purposes. Please use responsibly and in accordance with website terms of service.

## 📚 Disclaimer

CookiesKu is not responsible for any misuse or violation of website terms of service that may result from using this extension. Use at your own risk and responsibility.

---

Made with ❤️ for web developers and testers.