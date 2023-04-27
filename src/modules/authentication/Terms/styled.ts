import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTile: {
    fontWeight: 'bold',
    marginTop: 16
  },
  wrapper: {
    margin: 16,
    marginVertical: 32,
  },
});
