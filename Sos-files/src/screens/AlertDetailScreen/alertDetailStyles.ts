import { StyleSheet } from 'react-native';

const alertDetailStyles = StyleSheet.create({
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
  postedDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
  },
  petImage: {
    width: '90%',
    height: 220,
    borderRadius: 18,
    alignSelf: 'center',
    marginBottom: 16,
  },
  petImagePlaceholder: {
    width: '90%',
    height: 220,
    borderRadius: 18,
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: '#f0e0d0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#F5B87A',
    padding: 20,
  },
  petName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
    marginBottom: 10,
  },
  ownerLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E87A3A',
    marginBottom: 14,
  },
  infoGrid: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
  },
  infoValue: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0D5BB',
    marginVertical: 14,
  },
  additionalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#222',
    marginBottom: 8,
  },
  additionalText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  seeMore: {
    color: '#E87A3A',
    fontWeight: '700',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
});

export default alertDetailStyles;
