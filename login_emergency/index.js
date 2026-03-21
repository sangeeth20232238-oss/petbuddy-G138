import { registerRootComponent } from 'expo';
import App from './App';

// Global flag to prevent double mounting on web
if (typeof window !== 'undefined') {
  if (!window.__PETBUDDY_APP_MOUNTED__) {
    window.__PETBUDDY_APP_MOUNTED__ = true;
    registerRootComponent(App);
  }
} else {
  registerRootComponent(App);
}
