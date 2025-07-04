# Quick Actions Implementation

This document explains how the Quick Actions feature is implemented in the Subscription App.

## Overview

Quick Actions (also known as Home Screen Quick Actions or 3D Touch Shortcuts) allow users to access specific parts of the app directly from the home screen by long-pressing the app icon.

## Features Implemented

The app supports the following quick actions:

1. **Add Subscription** - Quickly add a new subscription
2. **View Subscriptions** - Go directly to the subscriptions list
3. **View Analytics** - Jump straight to the analytics screen

## Implementation Details

### Files

- `services/quickActionsService.ts` - Core implementation of quick actions
- `app/_layout.tsx` - Integration with the app's root layout

### How It Works

1. **Initialization**: Quick actions are initialized when the app starts in the root layout file.
2. **Action Handling**: When a user selects a quick action, the app navigates to the appropriate screen.
3. **Cleanup**: Proper cleanup is performed when the app is closed.

## Platform Support

- **iOS**: Supports 3D Touch and Haptic Touch shortcuts
- **Android**: Supports app shortcuts

## Usage

To use quick actions in your app:

1. Long press on the app icon from your device's home screen
2. Select one of the available actions
3. The app will open directly to the selected screen

## Technical Notes

- The implementation uses the `expo-quick-actions` library
- A maximum of 4 quick actions are supported (as recommended by Apple and Android)
- Quick actions are dynamically set when the app starts
- The app handles both cold start (app launched via quick action) and warm start (app already running) scenarios
