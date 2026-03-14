import { StyleSheet } from 'react-native';

const shareNotifyStyles = StyleSheet.create({
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
  section: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#F5B87A',
    padding: 16,
  },
  sectionTitleBold: {
    fontSize: 17,
    fontWeight: '800',
    color: '#222',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E87A3A',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    backgroundColor: '#FAFAFA',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#222',
    marginLeft: 8,
  },
  vetList: {
    marginBottom: 12,
  },
  shareButton: {
    backgroundColor: '#E87A3A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#E87A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E87A3A',
    borderRadius: 14,
    padding: 16,
  },
  communityIcon: {
    marginRight: 12,
  },
  communityText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  socialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E87A3A',
    borderRadius: 14,
    padding: 16,
  },
  socialIcon: {
    marginRight: 12,
  },
  socialText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default shareNotifyStyles;
