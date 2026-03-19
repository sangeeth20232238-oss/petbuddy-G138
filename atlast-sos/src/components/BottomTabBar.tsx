// Custom Bottom Tab Bar Component
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomTabBarProps {
  navigation: any;
  activeTab?: string;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ navigation, activeTab = 'Home' }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons
          name={activeTab === 'Home' ? 'home' : 'home-outline'}
          size={26}
          color={activeTab === 'Home' ? '#E87A3A' : '#999'}
        />
      </TouchableOpacity>

      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="hardware-chip-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => {}}
      >
        <Ionicons
          name={activeTab === 'Profile' ? 'person' : 'person-outline'}
          size={26}
          color={activeTab === 'Profile' ? '#E87A3A' : '#999'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonWrapper: {
    marginTop: -35,
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E87A3A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E87A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default BottomTabBar;
