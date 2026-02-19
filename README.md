# Pet Adoption App - React Native TypeScript

A beautiful pet adoption mobile application built with React Native, Expo, and TypeScript 

## 🎨 Features

- **Modern UI**: Clean, intuitive interface matching the Figma design
- **Pet Categories**: Browse pets by category (Cat, Dog, Rabbit, Hamster)
- **Search Functionality**: Search for pets by name, breed, or type
- **Hero Banner**: Eye-catching banner with call-to-action
- **Pet Grid**: Beautiful card-based layout for pet listings
- **Bottom Navigation**: Custom tab bar with floating center button
- **TypeScript**: Fully typed for better development experience

## 📁 Project Structure

```
pet-adoption/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx       # Main home screen with pet listings
│   │   ├── MessagesScreen.tsx   # Messages/chat screen
│   │   └── ProfileScreen.tsx    # User profile screen
│   ├── navigation/
│   │   └── BottomTabNavigator.tsx  # Bottom tab navigation
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── data/
│       └── pets.ts              # Mock pet data
├── assets/
│   ├── pets/                    # Pet images (to be added)
│   ├── banner-pet.png           # Banner image (to be added)
│   ├── icon.png                 # App icon
│   ├── splash.png               # Splash screen
│   └── adaptive-icon.png        # Android adaptive icon
├── App.tsx                      # Main app entry point
├── app.json                     # Expo configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add pet images:**
   
   Create the following directories and add images:
   ```
   assets/
   ├── pets/
   │   ├── cat1.jpg      # Orange/ginger cat (Samantha)
   │   ├── cat2.jpg      # White cat (Tigri)
   │   ├── dog1.jpg      # Golden Retriever (Max)
   │   └── dog2.jpg      # Labrador (Bella)
   └── banner-pet.png    # Woman holding a cat for the banner
   ```

   **Image Requirements:**
   - Pet images: 400x400px minimum, square aspect ratio
   - Banner image: 300x300px, transparent background preferred
   - Format: JPG or PNG

3. **Create placeholder icons (temporary):**
   
   For now, you can create simple placeholder images:
   - `assets/icon.png` - 1024x1024px
   - `assets/splash.png` - 1284x2778px
   - `assets/adaptive-icon.png` - 1024x1024px

### Running the App

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## 📱 Screens

### Home Screen
- Header with back button and title
- Search bar for finding pets by name, breed, or type
- Hero banner "Find Your Perfect Companion"
- Pet category filters (Cat, Dog, Rabbit, Hams)
- Pet grid with cards showing:
  - Pet image
  - Name and gender icon
  - Breed and age

### Messages Screen
- Placeholder for chat/messaging functionality

### Profile Screen
- Placeholder for user profile

## 🎨 Design Details

### Color Palette
- Primary Blue: `#2196F3` (used for primary buttons, highlights, and key UI accents)
### Typography
- Header Title: 20px, Semi-bold
- Section Title: 18px, Semi-bold
- Pet Name: 16px, Semi-bold
- Pet Breed: 12px, Regular
- Search Placeholder: 15px, Regular

### Components
- **Border Radius**: 12-20px for cards and buttons
- **Shadows**: Subtle elevation for cards and navigation
- **Spacing**: Consistent 20px padding for sections

## 🔧 Customization

### Adding More Pets

Edit `src/data/pets.ts`:

```typescript
{
  id: '5',
  name: 'Your Pet Name',
  type: 'cat', // or 'dog', 'rabbit', 'hamster'
  breed: 'Breed Name',
  age: '2 years',
  gender: 'male', // or 'female'
  image: require('../../assets/pets/your-image.jpg'),
}
```

### Changing Colors

Update the color values in the StyleSheet sections of each component file.

## 📦 Dependencies

- **react** & **react-native**: Core framework
- **expo**: Development platform
- **@react-navigation/native**: Navigation library
- **@react-navigation/bottom-tabs**: Bottom tab navigation
- **expo-linear-gradient**: Gradient backgrounds
- **react-native-safe-area-context**: Safe area handling
- **react-native-screens**: Native screen optimization
- **typescript**: Type safety

## 🐛 Troubleshooting

### Images not showing
- Ensure all image files are in the correct `assets/` directories
- Check that file names match exactly (case-sensitive)
- Restart the Metro bundler after adding new images

### TypeScript errors
- Run `npm install` to ensure all type definitions are installed
- Check `tsconfig.json` for proper configuration

### Navigation issues
- Ensure all navigation dependencies are installed
- Clear cache: `expo start -c`

## 📝 Next Steps

1. **Add Real Images**: Replace placeholder images with actual pet photos
2. **Pet Details Screen**: Create a detailed view when clicking on a pet card
3. **Backend Integration**: Connect to a real API for pet data
4. **Authentication**: Add user login/signup
5. **Favorites**: Implement favorite pets functionality
6. **Filters**: Add more filtering options (age, size, location)
7. **Messages**: Implement real-time chat functionality
8. **Profile**: Add user profile management

## 📄 License

ISC

## 👤 Author
Cheshanth
---

**Note**: This is a frontend implementation based on the Figma design. Backend integration and additional features can be added as needed.
