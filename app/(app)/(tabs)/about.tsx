import { supabase } from '@/lib/supabase';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error Signing Out', error.message);
    }
    console.log("signined out")
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