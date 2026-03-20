import { StyleSheet } from 'react-native';

const createPostStyles = StyleSheet.create({
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
    paddingTop: 45,
    paddingBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    color: '#222',
    marginLeft: 50,
  },
  uploadSection: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#F5B87A',
    borderStyle: 'dashed',
    paddingVertical: 24,
    alignItems: 'center',
  },
  uploadIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#FFF0E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  uploadedImage: {
    width: '90%',
    height: 160,
    borderRadius: 14,
    marginBottom: 10,
  },
  formSection: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#F5B87A',
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#E87A3A',
    marginBottom: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F5D5B8',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#222',
    fontWeight: '500',
  },
  inputIcon: {
    marginLeft: 8,
  },
  createButton: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#E87A3A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#E87A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFF',
  },
});

export default createPostStyles;
