import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithEmail, signUpWithEmail, loading } = useAuthStore();

  const handleSignIn = async () => {
    const { error } = await signInWithEmail({ email, password });
    if (error) Alert.alert(error.message);
  };

  const handleSignUp = async () => {
    const { data, error } = await signUpWithEmail({ email, password });
    if (error) Alert.alert(error.message);
    if (!data.session) Alert.alert('Please check your inbox for email verification!');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* Password Input */}
      <View style={styles.verticallySpaced}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>

      {/* Sign In Button */}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed || loading ? 0.6 : 1 },
          ]}
          disabled={loading}
          onPress={handleSignIn}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </Pressable>
      </View>

      {/* Sign Up Button */}
      <View style={styles.verticallySpaced}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed || loading ? 0.6 : 1 },
          ]}
          disabled={loading}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  label: {
    color: '#333',
    marginBottom: 4,
    fontSize: 16,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});