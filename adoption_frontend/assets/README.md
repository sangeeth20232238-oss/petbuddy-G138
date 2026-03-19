# Image Assets Directory

This directory should contain your pet images and app icons.

## Required Images:

### App Icons (for Expo)
- `icon.png` - 1024x1024px
- `splash.png` - 1284x2778px  
- `adaptive-icon.png` - 1024x1024px
- `favicon.png` - 48x48px

### Pet Images (in pets/ subdirectory)
- `cat1.jpg` - Orange/ginger cat
- `cat2.jpg` - White cat
- `dog1.jpg` - Golden Retriever
- `dog2.jpg` - Labrador

### Banner
- `banner-pet.png` - Person holding a pet (300x300px, transparent background)

## Current Status

The app currently uses placeholder images from the internet, so it will work without these files. Add them when you're ready to customize!

## How to Add Images

1. Download or create your images
2. Place them in this directory (or `pets/` subdirectory for pet images)
3. Update the code to use `require()` instead of `{ uri: ... }`
4. Restart the Metro bundler

See QUICKSTART.md for more details.
