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
  heroSection: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  heroCard: {
    backgroundColor: '#F5B87A',
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 20,
  },
  petBanner: {
    width: '100%',
    height: 140,
    resizeMode: 'contain',
  },
  petBannerPlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5B87A',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 10,
    gap: 8,
  },
  petEmoji: {
    fontSize: 50,
  },
  pawIcon: {
    marginVertical: 4,
  },
  emergencyButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E87A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 0,
  },
  emergencyIcon: {
    marginBottom: 2,
  },
  emergencyText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#222',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 14,
  },
  alertsRow: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  seeAllButton: {
    backgroundColor: '#E87A3A',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 14,
  },
  seeAllText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default homeStyles;
