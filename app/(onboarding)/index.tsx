import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Onbording</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
