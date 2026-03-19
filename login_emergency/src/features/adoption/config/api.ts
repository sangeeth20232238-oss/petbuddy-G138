import Constants from 'expo-constants';

// This IP is automatically updated by the backend sync-ip.js script
const PC_IP = '192.168.8.100';

// Automatically detect the IP address of the machine running Expo
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost ? debuggerHost.split(':')[0] : PC_IP;

export const API_BASE_URL = `http://${localhost}:5000/api`;

export const ENDPOINTS = {
    ADOPTIONS: `${API_BASE_URL}/adoptions`,
    PETS: `${API_BASE_URL}/pets`,
};
