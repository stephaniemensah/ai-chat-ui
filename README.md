# Onboardly AI Chat UI with Gemini 1.5 Flash & Image Generation

A modern AI chat interface powered by Google's Gemini 1.5 Flash model with image generation capabilities. This application provides a clean, user-friendly interface for interacting with AI, featuring advanced UX features like command palette, user profiles, interactive tours, and AI-powered image generation.

## ✨ Features

- 🤖 **Gemini 1.5 Flash Integration**: Powered by Google's latest AI model
- 🎨 **AI Image Generation**: Generate images using Gemini 2.0 Flash with image generation
- 💬 **Real-time Chat**: Interactive chat interface with streaming responses
- 🎨 **Modern Material Design UI**: Clean, responsive design with smooth animations
- 👤 **User Profiles**: Customizable user names and profile photos
- 📱 **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- ⚡ **Quick Prompts**: Pre-defined prompt cards for common IPMC Ghana queries and image generation
- 🔄 **Chat Management**: Clear chat history and logout functionality
- 🎯 **Command Palette**: Type "/" to access commands like clear, logout, tour, and mode switching
- 🚀 **Interactive Tour**: Onboarding tour for new users
- 💾 **Local Storage**: Chat history and user data persist across sessions
- 🎭 **Smooth Animations**: Material Design animations and transitions
- 🔄 **Mode Switching**: Toggle between chat and image generation modes

## 🚀 New Features

### Command Palette System
- **Type "/"** in the chat input to open the command palette
- **Available Commands:**
  - `/clear` - Clear chat history
  - `/logout` - Logout and reload page
  - `/tour` - Start the app tour
- **Navigation:** Use arrow keys to navigate, Enter to execute, Escape to close
- **Search:** Type partial commands to filter results

### Enhanced User Experience
- **Automatic Logout:** Type "logout" or use command palette to logout and reload page
- **Interactive Tour:** First-time users get a guided tour of the app
- **Profile Management:** Upload and manage profile photos with drag-and-drop
- **Chat Persistence:** Chat history is saved locally and restored on page reload
- **Streaming Responses:** Real-time AI responses with typing indicators

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the API Key

1. Open `assets/js/gemini-api.js`
2. Replace the API key with your actual key:

```javascript
const GEMINI_API_KEY = 'your-actual-api-key-here';
```

### 3. Run the Application

1. Open `index.html` in your web browser
2. Enter your name when prompted
3. Start chatting with the AI!

## 📖 Usage Guide

### Getting Started
1. **First Visit:** Enter your name when prompted
2. **Upload Photo:** Click on the profile photo to upload your picture
3. **Start Chatting:** Type messages or click on prompt cards

### Chat Commands
- **Type "/"** to open the command palette
- **Use arrow keys** to navigate commands
- **Press Enter** to execute selected command
- **Press Escape** to close the palette

### Available Commands
| Command | Description | Icon |
|---------|-------------|------|
| `/clear` | Clear chat history | 🗑️ |
| `/logout` | Logout and reload page | 🚪 |
| `/tour` | Start the app tour | ❓ |
| `/image` | Switch to image generation mode | 🎨 |
| `/chat` | Switch to chat mode | 💬 |

### Profile Management
- **Upload Photo:** Click profile photo → select image (max 5MB)
- **Change Name:** Use the command palette or clear data to reset
- **Data Persistence:** All data is saved locally in your browser

### Chat Features
- **Streaming Responses:** Real-time AI responses with typing animation
- **Message History:** Chat history is automatically saved (including generated images)
- **Quick Prompts:** Click on cards for instant questions about IPMC Ghana
- **Responsive Design:** Works perfectly on all screen sizes
- **Persistent Images:** Generated images are saved and restored with chat history

### Image Generation Features
- **Text-to-Image:** Generate images from text descriptions
- **Mode Toggle:** Switch between chat and image generation modes
- **Quick Image Prompts:** Pre-defined image generation examples that automatically switch to image mode
- **Image Display:** Generated images are displayed inline in chat
- **Smart Prompt Detection:** Image prompt cards automatically switch to image mode when clicked
- **Persistent Images:** Generated images are saved to localStorage and restored with chat history

### Using Image Generation
1. **Switch to Image Mode:** Click the toggle button (chat/image icon) or type `/image`
2. **Generate Images:** Describe what you want to see (e.g., "a futuristic office with computers")
3. **Quick Image Prompts:** Click on image prompt cards to automatically switch to image mode and generate
4. **Switch Back:** Click the toggle button again or type `/chat` to return to chat mode

## 🏗️ File Structure

```
ai-chat-ui/
├── index.html              # Main HTML file
├── assets/
│   ├── js/
│   │   ├── script.js       # Main JavaScript functionality
│   │   └── gemini-api.js   # Gemini API integration
│   ├── css/
│   │   └── styles.css      # Custom CSS styles
│   ├── images/             # Image assets
│   └── design/             # Design assets
├── ABOUT.md                # IPMC Ghana company information
└── README.md               # This file
```

## ⚙️ API Configuration

The Gemini API is configured with the following settings:

### Chat Mode
- **Model**: gemini-1.5-flash
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 2048
- **Safety Settings**: Medium threshold for all categories
- **Streaming**: Real-time response streaming

### Image Generation Mode
- **Model**: gemini-2.0-flash-preview-image-generation
- **Response Modalities**: TEXT and IMAGE
- **Image Format**: PNG with base64 encoding
- **Text-to-Image**: Generate images from text descriptions

## 🎨 UI/UX Features

### Material Design
- **Typography:** Poppins font family with proper weights
- **Elevation:** Material Design shadow system
- **Animations:** Smooth transitions and micro-interactions
- **Color Palette:** Red primary color with proper contrast

### Command Palette
- **Modern Design:** Glassmorphism effect with backdrop blur
- **Keyboard Navigation:** Full keyboard support
- **Visual Feedback:** Hover effects and selection highlighting
- **Responsive:** Adapts to different screen sizes

### Tour System
- **Interactive:** Step-by-step guided tour
- **Highlighting:** Focuses on important UI elements
- **Skip Option:** Users can skip or navigate freely
- **Persistent:** Only shows once per user

## 🌐 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🔧 Troubleshooting

### API Key Issues
- Ensure your API key is correctly copied
- Check that you have sufficient quota on Google AI Studio
- Verify the API key is active

### CORS Issues
- The application uses the official Gemini API endpoint
- No CORS issues should occur with proper API key setup

### Loading Issues
- Check browser console for error messages
- Ensure all files are in the correct directory structure
- Verify internet connection for API calls

### Command Palette Issues
- Ensure you're typing "/" to trigger the palette
- Check that JavaScript is enabled
- Try refreshing the page if palette doesn't appear

## 🔒 Privacy & Security

- **Local Storage:** All chat data is stored locally in your browser
- **No Server Storage:** No chat history is sent to external servers (except for API calls)
- **Profile Photos:** Stored as base64 in localStorage
- **API Calls:** Made directly to Google's servers with your API key
- **Data Control:** Users can clear all data using the logout command

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the appearance by modifying the CSS classes in the HTML file.

### API Settings
Modify the generation config in `assets/js/gemini-api.js` to adjust:
- Temperature (creativity)
- Max output tokens
- Safety settings

### Prompt Cards
Add or modify prompt cards in `index.html` by copying the existing card structure and updating the `data-prompt` attribute.

### Command Palette
Add new commands by modifying the `availableCommands` array in `assets/js/script.js`:

```javascript
{
  command: "your-command",
  description: "Command description",
  icon: "material_icon_name"
}
```

## 🆘 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify your API key is correctly configured
3. Ensure you have an active internet connection
4. Try the command palette for quick actions

## 📄 License

This project is open source and available under the MIT License. 