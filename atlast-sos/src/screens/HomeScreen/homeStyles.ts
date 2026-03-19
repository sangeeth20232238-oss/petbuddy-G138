import { StyleSheet } from 'react-native';

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5EC',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
    marginLeft: 12,
  },

  // Enhanced Hero Section
  heroSection: {
    marginHorizontal: 20,
    marginTop: 20,

  },
  heroCard: {
    backgroundColor: '#F5B87A',
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 32,
    // Layered card shadow
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },

  // Peeking Pets
  peekingPetsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: -15,
    zIndex: 2,
  },
  peekingPetSide: {
    width: 100,
    height: 100,
    marginHorizontal: -6,
  },
  peekingPetCenter: {
    width: 115,
    height: 115,
    marginHorizontal: -6,
    zIndex: 3,
  },

  // Paw watermark
  pawWatermarkContainer: {
    position: 'absolute',
    top: 60,
    right: -10,
    transform: [{ rotate: '25deg' }],
    zIndex: 0,
  },

  pawIcon: {
    marginVertical: 6,
    zIndex: 1,
  },

  // Animated Emergency Button
  emergencyButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 130,
    height: 130,
  },
  glowRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#E87A3A',
  },
  emergencyButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    // Elevated shadow
    shadowColor: '#E87A3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(232, 122, 58, 0.15)',
  },