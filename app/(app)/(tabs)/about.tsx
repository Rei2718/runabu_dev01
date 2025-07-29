import { useAuthStore } from '@/stores/authStore'; // supabaseの代わりにストアをインポート
import { Button, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  const { signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    console.log("signed out");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>About screen</Text>
      <Button title="Sign Out" onPress={handleSignOut} color="#ffd33d" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});