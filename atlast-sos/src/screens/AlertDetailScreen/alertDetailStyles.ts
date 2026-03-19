import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = 380;

const alertDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },

  // ---------- Image Section ----------
  imageContainer: {
    position: 'relative',
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  petImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  petImagePlaceholder: {
    backgroundColor: '#e0d0c0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ---------- White Content Card ----------
  contentCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
  },
  
  // ---------- Name Row ----------
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  petName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  breedColor: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  likeCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E87A3A',
  },

  // ---------- Owner Card ----------
  ownerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },